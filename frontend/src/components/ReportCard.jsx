import React from 'react';
import { BookOpen, Calendar, Cloud, Compass, Star, Trash2, Sparkles, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ReportCard({ report, onDelete, onSelect }) {
  const { user } = useAuth();
  const isOwner = user && (!report.user_id || report.user_id === user.id);

  const seeing = report.seeing_conditions || {};

  return (
    <div
      className="glass-panel"
      style={{
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease',
        cursor: 'pointer'
      }}
      onClick={() => onSelect && onSelect(report)}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.borderColor = 'rgba(52, 211, 153, 0.4)';
        e.currentTarget.style.boxShadow = '0 12px 30px -8px rgba(0, 0, 0, 0.7), 0 0 20px rgba(52, 211, 153, 0.2)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = 'var(--border-subtle)';
        e.currentTarget.style.boxShadow = 'var(--shadow-card)';
      }}
    >
      <div>
        {/* Top Badges */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.85rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className="pill pill-emerald" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Calendar size={12} />
              {report.report_date}
            </span>

            {report.is_auto_generated && (
              <span className="pill pill-purple" style={{ fontSize: '0.68rem' }}>
                <Sparkles size={11} /> Auto Feed Dispatch
              </span>
            )}
          </div>

          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
            {report.discoveries_count || 0} Discoveries • {report.events_count || 0} Events
          </span>
        </div>

        {/* Title */}
        <h3
          style={{
            fontSize: '1.2rem',
            color: '#ffffff',
            lineHeight: 1.35,
            marginBottom: '0.75rem'
          }}
        >
          {report.title}
        </h3>

        {/* Summary */}
        <p
          style={{
            fontSize: '0.875rem',
            color: 'var(--text-muted)',
            lineHeight: 1.55,
            marginBottom: '1rem',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {report.summary}
        </p>

        {/* Seeing Conditions Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            flexWrap: 'wrap',
            background: 'rgba(255, 255, 255, 0.03)',
            padding: '0.65rem 0.85rem',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-subtle)',
            fontSize: '0.78rem',
            color: '#cbd5e1',
            marginBottom: '1rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Star size={13} color="#fbbf24" />
            <span>Bortle Class {seeing.bortleClass || 4}</span>
          </div>
          <div style={{ width: '1px', height: '12px', background: 'var(--border-subtle)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Compass size={13} color="#38bdf8" />
            <span>Seeing: {seeing.seeing || 'Good (1.2")'}</span>
          </div>
          <div style={{ width: '1px', height: '12px', background: 'var(--border-subtle)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Cloud size={13} color="#94a3b8" />
            <span>Cloud: {seeing.cloudCover || '10%'}</span>
          </div>
        </div>

        {/* Highlights Preview */}
        {report.highlights && report.highlights.length > 0 && (
          <ul
            style={{
              paddingLeft: '1.2rem',
              fontSize: '0.8rem',
              color: 'var(--text-muted)',
              marginBottom: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.3rem'
            }}
          >
            {report.highlights.slice(0, 2).map((h, i) => (
              <li key={i}>{typeof h === 'string' ? h : JSON.stringify(h)}</li>
            ))}
          </ul>
        )}
      </div>

      {/* Footer */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: '0.85rem',
          marginTop: 'auto'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <span style={{ fontSize: '0.8rem', color: '#38bdf8', fontWeight: 500 }}>
          Read Full Report →
        </span>

        {isOwner && (
          <button
            onClick={() => onDelete(report.id)}
            className="btn-danger-ghost"
            title="Delete this report"
          >
            <Trash2 size={13} />
            <span>Remove</span>
          </button>
        )}
      </div>
    </div>
  );
}
