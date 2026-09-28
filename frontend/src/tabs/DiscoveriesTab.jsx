import React, { useState } from 'react';
import { Radio, RefreshCw, PlusCircle, Search, Sparkles, Filter, ExternalLink, Share2, Youtube, MessageSquare } from 'lucide-react';
import DiscoveryCard from '../components/DiscoveryCard';
import { useAuth } from '../context/AuthContext';

export default function DiscoveriesTab({
  discoveries,
  onSyncFeeds,
  isSyncing,
  onOpenCreate,
  onOpenSocialHub,
  onDelete,
  onSelect
}) {
  const { user, openAuth } = useAuth();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSource, setSelectedSource] = useState('All');

  const categories = ['All', 'Astrophysics', 'Exoplanets', 'Cosmology', 'Solar System', 'Deep Sky', 'Space Missions'];
  const sources = ['All', 'NASA', 'ESA', 'YouTube', 'Reddit', 'Bluesky', 'X'];

  const filteredDiscoveries = discoveries.filter((d) => {
    const matchesSearch =
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      (d.summary && d.summary.toLowerCase().includes(search.toLowerCase())) ||
      (d.source_name && d.source_name.toLowerCase().includes(search.toLowerCase())) ||
      (d.tags && d.tags.some(t => t.toLowerCase().includes(search.toLowerCase())));

    const matchesCategory = selectedCategory === 'All' || d.category?.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSource =
      selectedSource === 'All' ||
      d.source_name?.toLowerCase().includes(selectedSource.toLowerCase()) ||
      (d.tags && d.tags.some(t => t.toLowerCase().includes(selectedSource.toLowerCase())));

    return matchesSearch && matchesCategory && matchesSource;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', paddingBottom: '3rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <Radio size={26} color="#c084fc" />
            <span>Space-Science Discoveries & Social Streams</span>
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
            Automated official feeds from NASA/JPL, ESA, YouTube, Reddit & Bluesky, along with observatory dispatches
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            onClick={onOpenSocialHub}
            className="btn-secondary"
            style={{ borderColor: 'rgba(168, 85, 247, 0.4)', color: '#c084fc' }}
          >
            <Share2 size={16} />
            <span>Social Streams Hub</span>
          </button>

          <button
            onClick={onSyncFeeds}
            disabled={isSyncing}
            className={`btn-glow-sync ${isSyncing ? 'spinning' : ''}`}
          >
            <RefreshCw size={16} />
            <span>{isSyncing ? 'Scanning Feeds...' : 'Sync All Feeds'}</span>
          </button>

          <button
            onClick={user ? onOpenCreate : () => openAuth('login')}
            className="btn-primary"
          >
            <PlusCircle size={16} />
            <span>Add Discovery</span>
          </button>
        </div>
      </div>


      {/* Search & Filter Controls */}
      <div
        className="glass-panel"
        style={{
          padding: '1rem 1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.85rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          {/* Search bar */}
          <div style={{ position: 'relative', flex: '1 1 300px' }}>
            <input
              type="text"
              placeholder="Search discoveries, telescopes (e.g. JWST, Euclid), exoplanets, dark matter..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-input"
              style={{ width: '100%', paddingLeft: '2.4rem' }}
            />
            <Search size={16} color="#64748b" style={{ position: 'absolute', left: '0.85rem', top: '0.85rem' }} />
          </div>

          {/* Source Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Source:
            </span>
            {sources.map((s) => (
              <button
                key={s}
                onClick={() => setSelectedSource(s)}
                style={{
                  fontSize: '0.75rem',
                  padding: '0.35rem 0.65rem',
                  borderRadius: 'var(--radius-sm)',
                  background: selectedSource === s ? 'rgba(168, 85, 247, 0.25)' : 'rgba(255, 255, 255, 0.04)',
                  border: `1px solid ${selectedSource === s ? 'rgba(168, 85, 247, 0.5)' : 'var(--border-subtle)'}`,
                  color: selectedSource === s ? '#c084fc' : 'var(--text-muted)',
                  fontWeight: selectedSource === s ? 600 : 500
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Category Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Category:
          </span>
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCategory(c)}
              style={{
                fontSize: '0.75rem',
                padding: '0.3rem 0.65rem',
                borderRadius: 'var(--radius-full)',
                background: selectedCategory === c ? 'rgba(56, 189, 248, 0.2)' : 'transparent',
                border: `1px solid ${selectedCategory === c ? 'rgba(56, 189, 248, 0.4)' : 'transparent'}`,
                color: selectedCategory === c ? '#38bdf8' : 'var(--text-muted)',
                fontWeight: selectedCategory === c ? 600 : 400
              }}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Discovery Cards Grid */}
      {filteredDiscoveries.length === 0 ? (
        <div
          className="glass-panel"
          style={{
            padding: '3rem 2rem',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.75rem'
          }}
        >
          <Radio size={40} color="#64748b" />
          <h3 style={{ fontSize: '1.2rem', color: '#ffffff' }}>No discoveries matched criteria</h3>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', maxWidth: '420px' }}>
            Run "Sync Official Feeds" to fetch the latest dispatches from NASA and ESA, or log a custom scientific finding.
          </p>
          <button onClick={onSyncFeeds} disabled={isSyncing} className="btn-primary" style={{ marginTop: '0.5rem' }}>
            <RefreshCw size={15} />
            <span>Sync Official Feeds</span>
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.4rem' }}>
          {filteredDiscoveries.map((disc) => (
            <DiscoveryCard
              key={disc.id}
              discovery={disc}
              onDelete={onDelete}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}
