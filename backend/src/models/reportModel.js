import { supabase } from '../config/supabase.js';
import crypto from 'crypto';

const localReports = [
  {
    id: 'rep-initial-observatory-dispatch',
    user_id: null,
    report_date: new Date().toISOString().split('T')[0],
    title: 'Daily Observatory Log — Deep Sky & Exoplanet Survey',
    summary: 'Observations logged for the cosmic dawn proto-cluster confirmation and atmospheric characterization of K2-18 b. Seeing conditions recorded at Bortle Class 4.',
    discoveries_count: 3,
    events_count: 2,
    highlights: [
      'Spectroscopic analysis of K2-18 b confirmed with methane signatures.',
      'JWST cosmic dawn survey reveals 12 bound galaxy members at z > 7.',
      'Upcoming Orionid meteor stream scheduled for observation window.'
    ],
    seeing_conditions: {
      bortleClass: 4,
      seeing: 'Good (1.2 arcsec)',
      transparency: 'High',
      cloudCover: '10%'
    },
    notes: 'Atmospheric turbulence remained low throughout early morning observations. Calibrated primary 8-inch optics for upcoming planetary transit.',
    is_auto_generated: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export const ReportModel = {
  async listByUser(userId) {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('reports')
          .select('*')
          .or(`user_id.eq.${userId},user_id.is.null`)
          .order('report_date', { ascending: false });

        if (!error && data && data.length > 0) return data;
      } catch (err) {
        console.warn('[ReportModel] Supabase listByUser failed, using local store:', err.message);
      }
    }

    return localReports.filter(r => !r.user_id || r.user_id === userId);
  },

  async getById(id) {
    if (supabase) {
      try {
        const { data, error } = await supabase.from('reports').select('*').eq('id', id).maybeSingle();
        if (!error && data) return data;
      } catch (err) {
        console.warn('[ReportModel] Supabase getById failed:', err.message);
      }
    }
    return localReports.find(r => r.id === id) || null;
  },

  async create(reportData, userId) {
    const newReport = {
      id: crypto.randomUUID(),
      user_id: userId,
      report_date: reportData.report_date || new Date().toISOString().split('T')[0],
      title: reportData.title,
      summary: reportData.summary,
      discoveries_count: reportData.discoveries_count || 0,
      events_count: reportData.events_count || 0,
      highlights: reportData.highlights || [],
      seeing_conditions: reportData.seeing_conditions || {
        bortleClass: 4,
        seeing: 'Average (1.8 arcsec)',
        transparency: 'Moderate',
        cloudCover: '20%'
      },
      notes: reportData.notes || '',
      is_auto_generated: Boolean(reportData.is_auto_generated),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('reports')
          .insert([newReport])
          .select()
          .single();

        if (!error && data) {
          localReports.unshift(data);
          return data;
        }
        if (error) {
          console.warn('[ReportModel] Supabase insert error, falling back locally:', error.message);
        }
      } catch (err) {
        console.warn('[ReportModel] Supabase error:', err.message);
      }
    }

    localReports.unshift(newReport);
    return newReport;
  },

  async deleteByIdAndUser(id, userId) {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('reports')
          .delete()
          .match({ id, user_id: userId })
          .select();

        if (!error && data && data.length > 0) {
          const idx = localReports.findIndex(r => r.id === id && r.user_id === userId);
          if (idx !== -1) localReports.splice(idx, 1);
          return true;
        }
      } catch (err) {
        console.warn('[ReportModel] Supabase delete error:', err.message);
      }
    }

    const idx = localReports.findIndex(r => r.id === id && r.user_id === userId);
    if (idx !== -1) {
      localReports.splice(idx, 1);
      return true;
    }
    return false;
  }
};
