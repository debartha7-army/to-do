import { supabase } from '../config/supabase.js';
import crypto from 'crypto';

// In-memory fallback seeded with starter sky events
const localEvents = [
  {
    id: 'evt-orionids-2026',
    user_id: null,
    title: 'Orionid Meteor Shower Peak',
    event_type: 'Meteor Shower',
    event_date: new Date(Date.now() + 86400000 * 4).toISOString(),
    peak_time: new Date(Date.now() + 86400000 * 4 + 7200000).toISOString(),
    visibility_notes: 'Halley Comet dust trail entering upper atmosphere. Estimated Zenithal Hourly Rate (ZHR): 20 meteors/hr under dark skies.',
    location_notes: 'Facing East-Southeast towards constellation Orion after midnight.',
    equipment: 'Naked Eye / Wide-angle Astrophotography',
    status: 'upcoming',
    notes: 'Moon phase is at 28% crescent, providing minimal light pollution. Best viewing window: 01:30 AM to 04:30 AM.',
    source_url: 'https://in-the-sky.org/meteor_showers.php',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'evt-jupiter-opposition',
    user_id: null,
    title: 'Jupiter at Opposition & Galilean Moons Transit',
    event_type: 'Planetary Conjunction',
    event_date: new Date(Date.now() + 86400000 * 9).toISOString(),
    peak_time: new Date(Date.now() + 86400000 * 9 + 3600000).toISOString(),
    visibility_notes: 'Jupiter reaches closest approach to Earth, shining at magnitude -2.9. Disk diameter: 49.8 arcseconds.',
    location_notes: 'High in the southern sky near constellation Taurus.',
    equipment: 'Refractor / Reflector Telescope (70mm+ aperture)',
    status: 'upcoming',
    notes: 'Great Red Spot and shadow transits of Io and Europa will be visible across the Jovian cloud bands.',
    source_url: 'https://skyandtelescope.org/observing/celestial-objects-to-watch/',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export const EventModel = {
  async listByUser(userId) {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .or(`user_id.eq.${userId},user_id.is.null`)
          .order('event_date', { ascending: true });

        if (!error && data && data.length > 0) return data;
      } catch (err) {
        console.warn('[EventModel] Supabase listByUser failed, using local store:', err.message);
      }
    }

    return localEvents.filter(e => !e.user_id || e.user_id === userId);
  },

  async getById(id) {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .eq('id', id)
          .maybeSingle();

        if (!error && data) return data;
      } catch (err) {
        console.warn('[EventModel] Supabase getById failed:', err.message);
      }
    }

    return localEvents.find(e => e.id === id) || null;
  },

  async create(eventData, userId) {
    const newEvent = {
      id: crypto.randomUUID(),
      user_id: userId,
      title: eventData.title,
      event_type: eventData.event_type || 'Sky Observation',
      event_date: eventData.event_date || new Date().toISOString(),
      peak_time: eventData.peak_time || null,
      visibility_notes: eventData.visibility_notes || '',
      location_notes: eventData.location_notes || '',
      equipment: eventData.equipment || 'Naked Eye',
      status: eventData.status || 'upcoming',
      notes: eventData.notes || '',
      source_url: eventData.source_url || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('events')
          .insert([newEvent])
          .select()
          .single();

        if (!error && data) {
          localEvents.unshift(data);
          return data;
        }
        if (error) {
          console.warn('[EventModel] Supabase insert error, falling back locally:', error.message);
        }
      } catch (err) {
        console.warn('[EventModel] Supabase error:', err.message);
      }
    }

    localEvents.unshift(newEvent);
    return newEvent;
  },

  async deleteByIdAndUser(id, userId) {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('events')
          .delete()
          .match({ id, user_id: userId })
          .select();

        if (!error && data && data.length > 0) {
          const index = localEvents.findIndex(e => e.id === id && e.user_id === userId);
          if (index !== -1) localEvents.splice(index, 1);
          return true;
        }
      } catch (err) {
        console.warn('[EventModel] Supabase delete failed:', err.message);
      }
    }

    const index = localEvents.findIndex(e => e.id === id && e.user_id === userId);
    if (index !== -1) {
      localEvents.splice(index, 1);
      return true;
    }
    return false;
  }
};
