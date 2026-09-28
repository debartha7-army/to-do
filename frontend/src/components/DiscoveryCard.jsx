import React from 'react';
import { ExternalLink, Radio, Trash2, Tag, Calendar, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function DiscoveryCard({ discovery, onDelete, onSelect }) {
  const { user } = useAuth();
  const isOwner = user && discovery.user_id === user.id;

  const pubDate = new Date(discovery.published_at);

  const getSourceBadgeStyle = (source = '') => {
    const s = source.toLowerCase();
    if (s.includes('nasa') || s.includes('jpl')) {
      return { bg: 'rgba(14, 165, 233, 0.15)', text: '#38bdf8', border: 'rgba(56, 189, 248, 0.4)' };
    }
    if (s.includes('esa')) {
      return { bg: 'rgba(168, 85, 247, 0.15)', text: '#c084fc', border: 'rgba(168, 85, 247, 0.4)' };
    }
    if (s.includes('nature') || s.includes('arxiv')) {
      return { bg: 'rgba(52, 211, 153, 0.15)', text: '#34d399', border: 'rgba(52, 211, 153, 0.4)' };
    }
    return { bg: 'rgba(251, 191, 36, 0.15)', text: '#fbbf24', border: 'rgba(251, 191, 36, 0.4)' };
  };

  const badgeStyle = getSourceBadgeStyle(discovery.source_name);

  return (
    <div
      className="glass-panel"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        overflow: 'hidden',
        transition: 'transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease',
        cursor: 'pointer'
      }}
      onClick={() => onSelect && onSelect(discovery)}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.borderColor = 'rgba(168, 85, 247, 0.4)';
        e.currentTarget.style.boxShadow = '0 12px 30px -8px rgba(0, 0, 0, 0.7), 0 0 20px rgba(168, 85, 247, 0.2)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = 'var(--border-subtle)';
        e.currentTarget.style.boxShadow = 'var(--shadow-card)';
      }}
    >
      {/* Optional image preview */}
      {discovery.image_url && (
        <div style={{ width: '100%', height: '170px', overflow: 'hidden', position: 'relative' }}>
          <img
            src={discovery.image_url}
            alt={discovery.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(14, 21, 38, 0.95) 0%, transparent 60%)'
            }}
          />
        </div>
      )}

      <div style={{ padding: '1.4rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Source & Category Badges */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.85rem' }}>
          <span
            style={{
              fontSize: '0.72rem',
              fontWeight: 600,
              padding: '0.25rem 0.65rem',
              borderRadius: 'var(--radius-full)',
              background: badgeStyle.bg,
              color: badgeStyle.text,
              border: `1px solid ${badgeStyle.border}`,
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}
          >
            {discovery.is_official_feed && <Radio size={12} />}
            {discovery.source_name}
          </span>

          <span className="pill pill-purple" style={{ fontSize: '0.7rem' }}>
            {discovery.category || 'Astrophysics'}
          </span>
        </div>

        {/* Title */}
        <h3
          style={{
            fontSize: '1.15rem',
            color: '#ffffff',
            lineHeight: 1.4,
            marginBottom: '0.75rem'
          }}
        >
          {discovery.title}
        </h3>

        {/* Summary Snippet */}
        <p
          style={{
            fontSize: '0.86rem',
            color: 'var(--text-muted)',
            lineHeight: 1.55,
            marginBottom: '1rem',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {discovery.summary}
        </p>

        {/* Date and Tags */}
        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.78rem', color: '#94a3b8' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Calendar size={13} color="#38bdf8" />
            <span>{pubDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>

          {discovery.is_official_feed && (
            <span style={{ color: '#34d399', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Sparkles size={11} /> Verified Feed
            </span>
          )}
        </div>
      </div>

      {/* Footer link & delete */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTop: '1px solid var(--border-subtle)',
          padding: '0.85rem 1.4rem',
          background: 'rgba(9, 14, 26, 0.4)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {discovery.source_url ? (
          <a
            href={discovery.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost"
            style={{ fontSize: '0.8rem', padding: '0.35rem 0.6rem' }}
          >
            <span>Original Article</span>
            <ExternalLink size={13} />
          </a>
        ) : (
          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Archived Discovery</span>
        )}

        {isOwner && (
          <button
            onClick={() => onDelete(discovery.id)}
            className="btn-danger-ghost"
            title="Delete this discovery"
          >
            <Trash2 size={13} />
            <span>Remove</span>
          </button>
        )}
      </div>
    </div>
  );
}
