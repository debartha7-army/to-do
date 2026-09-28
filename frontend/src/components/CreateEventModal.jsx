import React, { useState } from 'react';
import { X, Telescope, Calendar, Clock, Compass, Link as LinkIcon, PlusCircle } from 'lucide-react';
import { api } from '../services/api';

const EVENT_TYPES = [
  'Meteor Shower',
  'Planetary Conjunction',
  'Lunar Eclipse',
  'Solar Eclipse',
  'Comet',
  'Auroral Activity',
  'Occultation',
  'Deep Sky Transit'
];

const EQUIPMENT_OPTIONS = [
  'Naked Eye',
  'Binoculars (7x50+)',
  'Refractor Telescope (70mm - 102mm)',
  'Reflector Telescope (150mm - 200mm+)',
  'Astrophotography Rig with Tracking Mount'
];

export default function CreateEventModal({ isOpen, onClose, onCreated, onToast }) {
  const [title, setTitle] = useState('');
  const [eventType, setEventType] = useState('Meteor Shower');
  const [eventDate, setEventDate] = useState('');
  const [peakTime, setPeakTime] = useState('');
  const [equipment, setEquipment] = useState('Naked Eye');
  const [visibilityNotes, setVisibilityNotes] = useState('');
  const [locationNotes, setLocationNotes] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !eventDate) return;

    setLoading(true);
    try {
      const payload = {
        title,
        event_type: eventType,
        event_date: new Date(eventDate).toISOString(),
        peak_time: peakTime ? new Date(peakTime).toISOString() : null,
        equipment,
        visibility_notes: visibilityNotes,
        location_notes: locationNotes,
        source_url: sourceUrl,
        notes,
        status: 'upcoming'
      };

      const res = await api.createEvent(payload);
      onToast && onToast('Sky Event Logged', `"${title}" has been registered in the observatory logbook.`, 'success');
      onCreated && onCreated(res.event);
      onClose();
    } catch (err) {
      onToast && onToast('Failed to Log Event', err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'rgba(56, 189, 248, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#38bdf8'
              }}
            >
              <Telescope size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem' }}>Log Sky Observation Event</h2>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                Schedule astronomical phenomena, meteor streams, conjunctions, or occultations
              </p>
            </div>
          </div>

          <button onClick={onClose} className="btn-ghost" style={{ padding: '0.4rem' }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">
              <span>Event Name / Phenomenon Title *</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Geminids Meteor Stream Peak Zenith"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="form-input"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">
                <span>Event Classification</span>
              </label>
              <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
                className="form-select"
              >
                {EVENT_TYPES.map((t) => (
                  <option key={t} value={t} style={{ background: '#0f1629' }}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">
                <span>Recommended Optical Gear</span>
              </label>
              <select
                value={equipment}
                onChange={(e) => setEquipment(e.target.value)}
                className="form-select"
              >
                {EQUIPMENT_OPTIONS.map((opt) => (
                  <option key={opt} value={opt} style={{ background: '#0f1629' }}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">
                <span>Observation Date & Time *</span>
              </label>
              <input
                type="datetime-local"
                required
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <span>Calculated Peak Window (Optional)</span>
              </label>
              <input
                type="datetime-local"
                value={peakTime}
                onChange={(e) => setPeakTime(e.target.value)}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              <span>Visibility & Lunar Interference Notes</span>
            </label>
            <input
              type="text"
              placeholder="e.g. ZHR ~ 120 meteors/hr. Moon at 14% waxing crescent, ideal dark conditions."
              value={visibilityNotes}
              onChange={(e) => setVisibilityNotes(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <span>Sky Location / Coordinates / Azimuth</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Facing Northeast towards constellation Gemini; alt 45° at 02:00."
              value={locationNotes}
              onChange={(e) => setLocationNotes(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <span>Ephemeris / External Reference Source URL</span>
            </label>
            <input
              type="url"
              placeholder="https://in-the-sky.org/ or https://skyandtelescope.org/..."
              value={sourceUrl}
              onChange={(e) => setSourceUrl(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <span>Observatory Notes & Prep</span>
            </label>
            <textarea
              placeholder="Field notes, eyepiece focal lengths, filters (e.g. UHC/OIII), camera exposure parameters..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="form-textarea"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary">
              <PlusCircle size={16} />
              <span>{loading ? 'Logging Event...' : 'Add Sky Event'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
