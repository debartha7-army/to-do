import React, { useState } from 'react';
import { X, BookOpen, Star, Compass, Cloud, PlusCircle } from 'lucide-react';
import { api } from '../services/api';

const BORTLE_LABELS = {
  1: 'Class 1 — Truly Pristine Dark Sky (Zodiacal light visible)',
  2: 'Class 2 — Truly Dark Site (Airglow faintly visible)',
  3: 'Class 3 — Rural Sky (Milky Way complex structure evident)',
  4: 'Class 4 — Rural/Suburban Transition (Zodiacal light faintly visible)',
  5: 'Class 5 — Suburban Sky (Milky Way washed out towards horizon)',
  6: 'Class 6 — Bright Suburban Sky (Milky Way only visible near zenith)',
  7: 'Class 7 — Suburban/Urban Transition (Light grey background sky)',
  8: 'Class 8 — City Sky (Sky glows whitish-gray, brighter stars only)',
  9: 'Class 9 — Inner-City Sky (Severely light polluted)'
};

export default function CreateReportModal({ isOpen, onClose, onCreated, onToast }) {
  const [reportDate, setReportDate] = useState(new Date().toISOString().split('T')[0]);
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [bortleClass, setBortleClass] = useState(4);
  const [seeingMetric, setSeeingMetric] = useState('Good (1.2 arcsec)');
  const [transparency, setTransparency] = useState('High');
  const [cloudCover, setCloudCover] = useState('10%');
  const [highlightsText, setHighlightsText] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !summary) return;

    setLoading(true);
    try {
      const highlights = highlightsText
        .split('\n')
        .map(h => h.trim())
        .filter(Boolean);

      const payload = {
        report_date: reportDate,
        title,
        summary,
        discoveries_count: 0,
        events_count: 0,
        highlights,
        seeing_conditions: {
          bortleClass: Number(bortleClass),
          seeing: seeingMetric,
          transparency,
          cloudCover
        },
        notes,
        is_auto_generated: false
      };

      const res = await api.createReport(payload);
      onToast && onToast('Daily Report Filed', `Dated log for ${reportDate} stored in observatory archives.`, 'success');
      onCreated && onCreated(res.report);
      onClose();
    } catch (err) {
      onToast && onToast('Failed to File Report', err.message, 'error');
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
                background: 'rgba(52, 211, 153, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#34d399'
              }}
            >
              <BookOpen size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem' }}>File Dated Observatory Report</h2>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                Record seeing conditions, astronomical reflections, and observational syntheses
              </p>
            </div>
          </div>

          <button onClick={onClose} className="btn-ghost" style={{ padding: '0.4rem' }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">
                <span>Observatory Log Date *</span>
              </label>
              <input
                type="date"
                required
                value={reportDate}
                onChange={(e) => setReportDate(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <span>Sky Dark-Site Quality (Bortle Class)</span>
              </label>
              <select
                value={bortleClass}
                onChange={(e) => setBortleClass(e.target.value)}
                className="form-select"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((b) => (
                  <option key={b} value={b} style={{ background: '#0f1629' }}>
                    {BORTLE_LABELS[b]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              <span>Report Title *</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Daily Dispatch — Planetary Ephemeris & Transits"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="form-input"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">
                <span>Atmospheric Seeing</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Excellent (0.8 arcsec)"
                value={seeingMetric}
                onChange={(e) => setSeeingMetric(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <span>Transparency</span>
              </label>
              <select
                value={transparency}
                onChange={(e) => setTransparency(e.target.value)}
                className="form-select"
              >
                <option value="Very High">Very High (Clear airmass)</option>
                <option value="High">High (Standard clear)</option>
                <option value="Moderate">Moderate (Slight haze)</option>
                <option value="Low">Low (High moisture/smoke)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">
                <span>Cloud Coverage</span>
              </label>
              <input
                type="text"
                placeholder="e.g. 5% cirrus"
                value={cloudCover}
                onChange={(e) => setCloudCover(e.target.value)}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              <span>Daily Executive Summary *</span>
            </label>
            <textarea
              required
              rows={3}
              placeholder="Summary of telescope targets observed, space-science developments synthesized, and environmental atmospheric stability..."
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="form-textarea"
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <span>Key Highlights (one per line)</span>
            </label>
            <textarea
              rows={3}
              placeholder="Spectroscopic confirmation of Jovian moon shadow transit&#10;Solar prominence logged in H-alpha band&#10;NASA press release on Webb deep-field cluster verified"
              value={highlightsText}
              onChange={(e) => setHighlightsText(e.target.value)}
              className="form-textarea"
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <span>Instrument Calibration & Field Notes</span>
            </label>
            <textarea
              rows={2}
              placeholder="Collimation checked with artificial star; Barlow lens 2.5x tested on lunar craters..."
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
              <span>{loading ? 'Filing Report...' : 'File Daily Report'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
