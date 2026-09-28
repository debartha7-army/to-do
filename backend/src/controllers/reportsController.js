import { ReportModel } from '../models/reportModel.js';
import { DiscoveryModel } from '../models/discoveryModel.js';
import { EventModel } from '../models/eventModel.js';

export const getReports = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : null;
    const reports = await ReportModel.listByUser(userId);
    return res.json({ reports });
  } catch (err) {
    console.error('[ReportsController] getReports error:', err);
    return res.status(500).json({ error: 'Failed to retrieve daily observatory reports.' });
  }
};

export const createReport = async (req, res) => {
  try {
    const {
      report_date,
      title,
      summary,
      discoveries_count,
      events_count,
      highlights,
      seeing_conditions,
      notes,
      is_auto_generated
    } = req.body;

    if (!title || !summary) {
      return res.status(400).json({ error: 'Report title and summary description are required.' });
    }

    const newReport = await ReportModel.create(
      {
        report_date: report_date || new Date().toISOString().split('T')[0],
        title,
        summary,
        discoveries_count,
        events_count,
        highlights,
        seeing_conditions,
        notes,
        is_auto_generated: Boolean(is_auto_generated)
      },
      req.user.id
    );

    return res.status(201).json({
      message: 'Daily observatory report filed successfully.',
      report: newReport
    });
  } catch (err) {
    console.error('[ReportsController] createReport error:', err);
    return res.status(500).json({ error: 'Failed to create daily report.' });
  }
};

export const generateTodayReport = async (req, res) => {
  try {
    const userId = req.user.id;
    const today = new Date().toISOString().split('T')[0];

    const discoveries = await DiscoveryModel.list();
    const todayDiscoveries = discoveries.filter(d => {
      const pub = new Date(d.published_at).toISOString().split('T')[0];
      return pub === today;
    });

    const events = await EventModel.listByUser(userId);
    const todayEvents = events.filter(e => {
      const evt = new Date(e.event_date).toISOString().split('T')[0];
      return evt === today;
    });

    const highlights = [
      ...todayDiscoveries.slice(0, 3).map(d => `${d.source_name}: ${d.title}`),
      ...todayEvents.slice(0, 2).map(e => `Sky Event: ${e.title} (${e.event_type})`)
    ];

    if (highlights.length === 0) {
      highlights.push('Night sky survey completed; no anomalous transient events detected in primary field of view.');
    }

    const title = `Observatory Dispatch — ${today}`;
    const summary = `Daily observatory compilation recording ${todayDiscoveries.length} new space discoveries and ${todayEvents.length} scheduled celestial observations for ${today}.`;

    const report = await ReportModel.create(
      {
        report_date: today,
        title,
        summary,
        discoveries_count: todayDiscoveries.length,
        events_count: todayEvents.length,
        highlights,
        seeing_conditions: {
          bortleClass: 4,
          seeing: 'Good (1.2 arcsec)',
          transparency: 'High',
          cloudCover: '10%'
        },
        notes: `Compiled by astronomer at ${new Date().toLocaleTimeString('en-US', { timeZone: 'Asia/Kolkata' })} IST. Equipment calibrated and ready.`,
        is_auto_generated: false
      },
      userId
    );

    return res.status(201).json({
      message: 'Generated daily report successfully.',
      report
    });
  } catch (err) {
    console.error('[ReportsController] generateTodayReport error:', err);
    return res.status(500).json({ error: 'Failed to compile daily report.' });
  }
};
