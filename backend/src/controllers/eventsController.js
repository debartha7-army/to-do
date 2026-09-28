import { EventModel } from '../models/eventModel.js';

export const getEvents = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : null;
    const events = await EventModel.listByUser(userId);
    return res.json({ events });
  } catch (err) {
    console.error('[EventsController] getEvents error:', err);
    return res.status(500).json({ error: 'Failed to retrieve sky events.' });
  }
};

export const createEvent = async (req, res) => {
  try {
    const {
      title,
      event_type,
      event_date,
      peak_time,
      visibility_notes,
      location_notes,
      equipment,
      status,
      notes,
      source_url
    } = req.body;

    if (!title || !event_date) {
      return res.status(400).json({ error: 'Event title and observation date are required.' });
    }

    const newEvent = await EventModel.create(
      {
        title,
        event_type,
        event_date,
        peak_time,
        visibility_notes,
        location_notes,
        equipment,
        status,
        notes,
        source_url
      },
      req.user.id
    );

    return res.status(201).json({
      message: 'Sky event logged successfully.',
      event: newEvent
    });
  } catch (err) {
    console.error('[EventsController] createEvent error:', err);
    return res.status(500).json({ error: 'Failed to create sky event.' });
  }
};
