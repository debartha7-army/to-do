import React, { useState, useEffect } from 'react';
import { X, Share2, Youtube, MessageSquare, Twitter, Globe, RefreshCw, CheckCircle2, ShieldAlert, Sparkles, Key } from 'lucide-react';
import { api } from '../services/api';

export default function SocialHubModal({ isOpen, onClose, onSynced, onToast }) {
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      api.getSocialChannels()
        .then(res => setChannels(res.channels || []))
        .catch(() => setChannels([]))
        .finally(() => setLoading(false));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSyncSocial = async () => {
    setSyncing(true);
    onToast && onToast('Contacting Social Feeds', 'Syncing YouTube, Reddit, Bluesky & X space channels...', 'info');

    try {
      const res = await api.syncSocialFeeds();
      const count = res.stats?.newInserted || 0;
      onToast && onToast(
        'Social Media Streams Synced',
        `Collected ${res.stats?.totalFetched || 0} recent posts across channels. ${count} new items archived.`,
        'success'
      );
      onSynced && onSynced(res.discoveries);
    } catch (err) {
      onToast && onToast('Social Sync Notice', err.message, 'error');
    } finally {
      setSyncing(false);
    }
  };

  const getPlatformIcon = (id) => {
    switch (id) {
      case 'youtube': return <Youtube size={20} color="#f87171" />;
      case 'reddit': return <MessageSquare size={20} color="#fb923c" />;
      case 'twitter': return <Twitter size={20} color="#38bdf8" />;
      case 'bluesky': return <Globe size={20} color="#60a5fa" />;
      default: return <Share2 size={20} color="#c084fc" />;
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
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
              <Share2 size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem' }}>Connected Social Media Channels</h2>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                Multi-platform space streams: YouTube, Reddit, Bluesky & X (Twitter)
              </p>
            </div>
          </div>

          <button onClick={onClose} className="btn-ghost" style={{ padding: '0.4rem' }}>
            <X size={18} />
          </button>
        </div>

        {/* Security / Safe Feeds Banner */}
        <div
          style={{
            background: 'rgba(56, 189, 248, 0.08)',
            border: '1px solid rgba(56, 189, 248, 0.25)',
            borderRadius: 'var(--radius-sm)',
            padding: '0.85rem 1rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.75rem',
            marginBottom: '1.25rem',
            fontSize: '0.825rem',
            color: '#cbd5e1',
            lineHeight: 1.5
          }}
        >
          <Sparkles size={18} color="#38bdf8" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <strong style={{ color: '#38bdf8' }}>Safe Credential Architecture:</strong>
            <p style={{ marginTop: '0.2rem', color: '#94a3b8' }}>
              Orbit Notes connects to official public channels via open RSS XML, Reddit JSON, and AT Protocol feeds.
              <strong> You never need to share personal account passwords.</strong> Optional developer API tokens (like X Bearer token or YouTube Data API) are stored privately in <code style={{ color: '#fbbf24' }}>backend/.env</code>.
            </p>
          </div>
        </div>

        {/* Channels List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.5rem' }}>
          {channels.map((chan) => (
            <div
              key={chan.id}
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: '1rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
                <div style={{ marginTop: '2px' }}>
                  {getPlatformIcon(chan.id)}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontWeight: 600, color: '#ffffff', fontSize: '0.95rem' }}>
                      {chan.name}
                    </span>
                    <span
                      className={`pill ${chan.status === 'active' ? 'pill-emerald' : 'pill-gold'}`}
                      style={{ fontSize: '0.65rem' }}
                    >
                      {chan.status === 'active' ? '● Active Stream' : 'Ready / Configurable'}
                    </span>
                  </div>

                  <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.2rem' }}>
                    {chan.description}
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.45rem', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Channels monitored:</span>
                    {chan.channels.map((c, i) => (
                      <span
                        key={i}
                        style={{
                          fontSize: '0.72rem',
                          background: 'rgba(255, 255, 255, 0.06)',
                          padding: '0.15rem 0.45rem',
                          borderRadius: '4px',
                          color: '#e2e8f0'
                        }}
                      >
                        {c}
                      </span>
                    ))}
                  </div>

                  <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '0.35rem' }}>
                    Method: {chan.method}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Actions */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem' }}>
          <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
            Automatic background sync runs daily at 08:00 AM IST
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button onClick={onClose} className="btn-secondary">
              Close
            </button>
            <button
              onClick={handleSyncSocial}
              disabled={syncing}
              className={`btn-glow-sync ${syncing ? 'spinning' : ''}`}
            >
              <RefreshCw size={16} />
              <span>{syncing ? 'Scanning Social Streams...' : 'Sync All Social Feeds'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
