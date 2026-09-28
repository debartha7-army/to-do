import React from 'react';

export default function StatWidget({ title, value, subtitle, icon: Icon, color = 'cyan', badge }) {
  const colorMap = {
    cyan: {
      border: 'rgba(56, 189, 248, 0.25)',
      glow: 'rgba(56, 189, 248, 0.15)',
      iconBg: 'rgba(56, 189, 248, 0.12)',
      iconColor: '#38bdf8'
    },
    purple: {
      border: 'rgba(168, 85, 247, 0.25)',
      glow: 'rgba(168, 85, 247, 0.15)',
      iconBg: 'rgba(168, 85, 247, 0.12)',
      iconColor: '#c084fc'
    },
    gold: {
      border: 'rgba(251, 191, 36, 0.25)',
      glow: 'rgba(251, 191, 36, 0.15)',
      iconBg: 'rgba(251, 191, 36, 0.12)',
      iconColor: '#fbbf24'
    },
    emerald: {
      border: 'rgba(52, 211, 153, 0.25)',
      glow: 'rgba(52, 211, 153, 0.15)',
      iconBg: 'rgba(52, 211, 153, 0.12)',
      iconColor: '#34d399'
    }
  };

  const scheme = colorMap[color] || colorMap.cyan;

  return (
    <div
      className="glass-panel"
      style={{
        padding: '1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden',
        border: `1px solid ${scheme.border}`,
        boxShadow: `0 8px 24px -6px rgba(0, 0, 0, 0.5), 0 0 15px ${scheme.glow}`
      }}
    >
      <div>
        <div style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          {title}
        </div>
        <div
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.85rem',
            fontWeight: 700,
            color: '#ffffff',
            lineHeight: 1.2,
            marginTop: '0.25rem'
          }}
        >
          {value}
        </div>
        {subtitle && (
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.35rem' }}>
            {subtitle}
          </div>
        )}
      </div>

      <div
        style={{
          width: '46px',
          height: '46px',
          borderRadius: 'var(--radius-md)',
          background: scheme.iconBg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: scheme.iconColor,
          flexShrink: 0
        }}
      >
        {Icon && <Icon size={24} />}
      </div>
    </div>
  );
}
