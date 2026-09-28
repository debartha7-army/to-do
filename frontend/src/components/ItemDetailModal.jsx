import React from 'react';
import { X, ExternalLink, Calendar, Telescope, Radio, BookOpen, Star, Compass, Cloud, Clock, CheckCircle2 } from 'lucide-react';

export default function ItemDetailModal({ item, kind, onClose }) {
  if (!item || !kind) return null;

  const isEvent = kind === 'event';
  const isDiscovery = kind === 'discovery';
  const isReport = kind === 'report';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '680px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              {isEvent && (
                <>
                  <span className="pill pill-cyan">Sky Event</span>
                  <span className="pill pill-gold">{item.event_type}</span>
                </>
              )}
              {isDiscovery && (
                <>
                  <span className="pill pill-purple">Science Discovery</span>
                  <span className="pill pill-cyan">{item.source_name}</span>
                </>
              )}
              {isReport && (
                <>
                  <span className="pill pill-emerald">Observatory Report</span>
                  <span className="pill pill-gold">{item.report_date}</span>
                </>
              )}
            </div>

            <h2 style={{ fontSize: '1.4rem', color: '#ffffff', lineHeight: 1.3 }}>
              {item.title}
            </h2>
          </div>

          <button onClick={onClose} className="btn-ghost" style={{ padding: '0.4rem' }}>
            <X size={20} />
          </button>
        </div>

        {/* Optional Discovery Hero Image */}
        {isDiscovery && item.image_url && (
          <div style={{ width: '100%', height: '240px', borderRadius: 'var(--radius-md)', overflow: 'hidden', marginBottom: '1.25rem' }}>
            <img
              src={item.image_url}
              alt={item.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
          </div>
        )}

        {/* Content Body */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', color: '#cbd5e1', fontSize: '0.925rem', lineHeight: 1.6 }}>
          {isDiscovery && (
            <>
              {item.summary && (
                <div style={{ padding: '1rem', background: 'rgba(56, 189, 248, 0.05)', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid #38bdf8' }}>
                  <strong>Abstract:</strong> {item.summary}
                </div>
              )}
              {item.content && (
                <div>
                  <h4 style={{ color: '#e2e8f0', marginBottom: '0.35rem', fontSize: '1rem' }}>Scientific Analysis</h4>
                  <p style={{ color: 'var(--text-muted)' }}>{item.content}</p>
                </div>
              )}
            </>
          )}

          {isEvent && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', background: 'rgba(255, 255, 255, 0.03)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Observation Date</span>
                  <div style={{ fontWeight: 600, color: '#ffffff' }}>
                    {new Date(item.event_date).toLocaleString('en-US')}
                  </div>
                </div>

                {item.peak_time && (
                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Peak Activity Time</span>
                    <div style={{ fontWeight: 600, color: '#fbbf24' }}>
                      {new Date(item.peak_time).toLocaleString('en-US')}
                    </div>
                  </div>
                )}

                <div>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Required Optics</span>
                  <div style={{ fontWeight: 600, color: '#38bdf8' }}>
                    {item.equipment || 'Naked Eye'}
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Status</span>
                  <div style={{ fontWeight: 600, textTransform: 'capitalize', color: item.status === 'observed' ? '#34d399' : '#ffffff' }}>
                    {item.status}
                  </div>
                </div>
              </div>

              {item.visibility_notes && (
                <div>
                  <h4 style={{ color: '#e2e8f0', marginBottom: '0.25rem', fontSize: '0.95rem' }}>Visibility & Ephemeris</h4>
                  <p style={{ color: 'var(--text-muted)' }}>{item.visibility_notes}</p>
                </div>
              )}

              {item.location_notes && (
                <div>
                  <h4 style={{ color: '#e2e8f0', marginBottom: '0.25rem', fontSize: '0.95rem' }}>Celestial Coordinates & Direction</h4>
                  <p style={{ color: 'var(--text-muted)' }}>{item.location_notes}</p>
                </div>
              )}

              {item.notes && (
                <div>
                  <h4 style={{ color: '#e2e8f0', marginBottom: '0.25rem', fontSize: '0.95rem' }}>Observer Remarks</h4>
                  <p style={{ color: 'var(--text-muted)' }}>{item.notes}</p>
                </div>
              )}
            </>
          )}

          {isReport && (
            <>
              <div style={{ padding: '1rem', background: 'rgba(52, 211, 153, 0.05)', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid #34d399' }}>
                <strong style={{ color: '#34d399' }}>Executive Summary:</strong>
                <p style={{ marginTop: '0.35rem', color: '#e2e8f0' }}>{item.summary}</p>
              </div>

              {item.seeing_conditions && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem', background: 'rgba(255, 255, 255, 0.03)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Bortle Scale</span>
                    <div style={{ fontWeight: 600, color: '#fbbf24' }}>Class {item.seeing_conditions.bortleClass}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Atmospheric Seeing</span>
                    <div style={{ fontWeight: 600, color: '#38bdf8' }}>{item.seeing_conditions.seeing}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Transparency</span>
                    <div style={{ fontWeight: 600, color: '#c084fc' }}>{item.seeing_conditions.transparency}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Cloud Cover</span>
                    <div style={{ fontWeight: 600, color: '#94a3b8' }}>{item.seeing_conditions.cloudCover}</div>
                  </div>
                </div>
              )}

              {item.highlights && item.highlights.length > 0 && (
                <div>
                  <h4 style={{ color: '#e2e8f0', marginBottom: '0.5rem', fontSize: '0.95rem' }}>Observatory Highlights</h4>
                  <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', color: 'var(--text-muted)' }}>
                    {item.highlights.map((h, i) => (
                      <li key={i}>{typeof h === 'string' ? h : JSON.stringify(h)}</li>
                    ))}
                  </ul>
                </div>
              )}

              {item.notes && (
                <div>
                  <h4 style={{ color: '#e2e8f0', marginBottom: '0.25rem', fontSize: '0.95rem' }}>Field & Instrument Notes</h4>
                  <p style={{ color: 'var(--text-muted)' }}>{item.notes}</p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer Actions */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem', marginTop: '1.5rem' }}>
          {item.source_url ? (
            <a
              href={item.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
              style={{ fontSize: '0.85rem' }}
            >
              <span>Visit External Source / Paper</span>
              <ExternalLink size={14} />
            </a>
          ) : (
            <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Archived in Personal Observatory</span>
          )}

          <button onClick={onClose} className="btn-secondary">
            Close View
          </button>
        </div>
      </div>
    </div>
  );
}
