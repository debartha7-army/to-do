import React, { useState } from 'react';
import { X, Radio, Link as LinkIcon, Image, Tag, PlusCircle } from 'lucide-react';
import { api } from '../services/api';

const CATEGORIES = [
  'Astrophysics',
  'Exoplanets',
  'Cosmology',
  'Solar System',
  'Deep Sky',
  'Space Missions',
  'Gravitational Waves'
];

const COMMON_SOURCES = [
  'NASA / JPL',
  'ESA Space Science',
  'Nature Astronomy',
  'arXiv Astrophysics',
  'Hubble Legacy',
  'James Webb Space Telescope',
  'Astrophysical Journal (ApJ)',
  'ALMA Observatory',
  'X / Social Dispatch',
  'Custom Journal'
];

export default function CreateDiscoveryModal({ isOpen, onClose, onCreated, onToast }) {
  const [title, setTitle] = useState('');
  const [sourceName, setSourceName] = useState('NASA / JPL');
  const [customSourceName, setCustomSourceName] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [category, setCategory] = useState('Astrophysics');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title) return;

    setLoading(true);
    try {
      const finalSource = sourceName === 'Custom Journal' && customSourceName ? customSourceName : sourceName;
      const payload = {
        title,
        source_name: finalSource,
        source_url: sourceUrl,
        category,
        summary,
        content,
        image_url: imageUrl,
        tags: tags ? tags.split(',').map(t => t.trim()) : [category, finalSource],
        is_official_feed: false,
        published_at: new Date().toISOString()
      };

      const res = await api.createDiscovery(payload);
      onToast && onToast('Discovery Archived', `"${title}" has been saved to the science library.`, 'success');
      onCreated && onCreated(res.discovery);
      onClose();
    } catch (err) {
      onToast && onToast('Failed to Save Discovery', err.message, 'error');
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
                background: 'rgba(168, 85, 247, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#c084fc'
              }}
            >
              <Radio size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem' }}>Log Space-Science Discovery</h2>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                Archive research publications, mission updates, or telescope findings with source links
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
              <span>Discovery Title / Paper Headline *</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Discovery of Phosphine Anomalies in Venusian Upper Atmosphere"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="form-input"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">
                <span>Source Agency / Journal</span>
              </label>
              <select
                value={sourceName}
                onChange={(e) => setSourceName(e.target.value)}
                className="form-select"
              >
                {COMMON_SOURCES.map((s) => (
                  <option key={s} value={s} style={{ background: '#0f1629' }}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">
                <span>Science Discipline</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="form-select"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c} style={{ background: '#0f1629' }}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {sourceName === 'Custom Journal' && (
            <div className="form-group">
              <label className="form-label">
                <span>Custom Source Name</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Monthly Notices of the Royal Astronomical Society (MNRAS)"
                value={customSourceName}
                onChange={(e) => setCustomSourceName(e.target.value)}
                className="form-input"
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">
              <span>Primary Source / Publication URL</span>
            </label>
            <input
              type="url"
              placeholder="https://arxiv.org/abs/... or https://www.nature.com/articles/..."
              value={sourceUrl}
              onChange={(e) => setSourceUrl(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <span>Scientific Summary / Abstract</span>
            </label>
            <textarea
              required
              rows={3}
              placeholder="Key findings, methodology, spectroscopic detections, or implications for planetary models..."
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="form-textarea"
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <span>Detailed Notes & Mathematical Parameters (Optional)</span>
            </label>
            <textarea
              rows={3}
              placeholder="Instrument specifications, statistical confidence (sigma levels), observational epochs..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="form-textarea"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">
                <span>Illustrative Image URL (Optional)</span>
              </label>
              <input
                type="url"
                placeholder="https://images.unsplash.com/... or observatory asset"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <span>Tags (comma-separated)</span>
              </label>
              <input
                type="text"
                placeholder="JWST, Spectroscopy, Biosignatures, Red Dwarf"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="form-input"
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary">
              <PlusCircle size={16} />
              <span>{loading ? 'Archiving...' : 'Save Discovery'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
