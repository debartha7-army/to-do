import React from 'react';
import { Calendar, Clock, Compass, Eye, Telescope, Trash2, ExternalLink, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function EventCard({ event, onDelete, onSelect }) {
  const { user } = useAuth();
  const isOwner = user && (!event.user_id || event.user_id === user.id);

  const eventDate = new Date(event.event_date);
  const now = new Date();
  const diffDays = Math.ceil((eventDate - now) / (1000 * 60 * 60 * 24));

  let countdownText = '';
  let countdownPillClass = 'pill-cyan';

  if (diffDays === 0) {
    countdownText = 'Tonight / Today';
    countdownPillClass = 'pill-rose';
  } else if (diffDays > 0) {
    countdownText = `In ${diffDays} day${diffDays > 1 ? 's' : ''}`;
    countdownPillClass = diffDays <= 3 ? 'pill-gold' : 'pill-cyan';
  } else {
    countdownText = `${Math.abs(diffDays)} day${Math.abs(diffDays) > 1 ? 's' : ''} ago`;
    countdownPillClass = 'pill-purple';
  }

  const getTypeColor = (type = '') => {
    switch (type.toLowerCase()) {
      case 'meteor shower': return 'pill-gold';
      case 'planetary conjunction': return 'pill-purple';
      case 'lunar eclipse':
      case 'solar eclipse': return 'pill-rose';
      case 'comet': return 'pill-cyan';
      default: return 'pill-emerald';
    }
  };

  return (
    <div
      className="glass-panel"
      style={{
        padding: '1.4rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        transition: 'transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease',
        cursor: 'pointer'
      }}
      onClick={() => onSelect && onSelect(event)}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.4)';
        e.currentTarget.style.boxShadow = '0 12px 30px -8px rgba(0, 0, 0, 0.7), 0 0 20px rgba(56, 189, 248, 0.2)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = 'var(--border-subtle)';
        e.currentTarget.style.boxShadow = 'var(--shadow-card)';
      }}
    >
      <div>
        {/* Top Badges */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
            <span className={`pill ${getTypeColor(event.event_type)}`}>
              {event.event_type}
            </span>
            <span className={`pill ${countdownPillClass}`}>
              {countdownText}
            </span>
          </div>

          <span
            style={{
              fontSize: '0.72rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              color: event.status === 'observed' ? '#34d399' : '#94a3b8',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem'
            }}
          >
            {event.status === 'observed' && <CheckCircle2 size={13} color="#34d399" />}
            {event.status}
          </span>
        </div>

        {/* Title */}
        <h3
          style={{
            fontSize: '1.15rem',
            color: '#ffffff',
            lineHeight: 1.35,
            marginBottom: '0.65rem'
          }}
        >
          {event.title}
        </h3>

        {/* Visibility / Notes Snippet */}
        <p
          style={{
            fontSize: '0.85rem',
            color: 'var(--text-muted)',
            lineHeight: 1.5,
            marginBottom: '1rem',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {event.visibility_notes || event.notes || 'No specific observation notes recorded for this sky event.'}
        </p>

        {/* Event Meta Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar size={14} color="#38bdf8" />
            <span>{eventDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>

          {event.peak_time && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock size={14} color="#fbbf24" />
              <span>Peak: {new Date(event.peak_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Telescope size={14} color="#a855f7" />
            <span>Equipment: {event.equipment || 'Naked Eye'}</span>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: '0.75rem',
          marginTop: 'auto'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {event.source_url ? (
          <a
            href={event.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost"
            style={{ fontSize: '0.78rem', padding: '0.35rem 0.55rem' }}
          >
            <span>Ephemeris Link</span>
            <ExternalLink size={12} />
          </a>
        ) : (
          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Personal Log</span>
        )}

        {isOwner && (
          <button
            onClick={() => onDelete(event.id)}
            className="btn-danger-ghost"
            title="Delete this sky event"
          >
            <Trash2 size={13} />
            <span>Remove</span>
          </button>
        )}
      </div>
    </div>
  );
}
