import React, { useState } from 'react';
import { Telescope, PlusCircle, Search, Filter, Calendar } from 'lucide-react';
import EventCard from '../components/EventCard';
import { useAuth } from '../context/AuthContext';

export default function EventsTab({ events, onOpenCreate, onDelete, onSelect }) {
  const { user, openAuth } = useAuth();
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  const types = ['All', 'Meteor Shower', 'Planetary Conjunction', 'Lunar Eclipse', 'Solar Eclipse', 'Comet', 'Deep Sky Transit'];

  const filteredEvents = events.filter((e) => {
    const matchesSearch =
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      (e.visibility_notes && e.visibility_notes.toLowerCase().includes(search.toLowerCase())) ||
      (e.location_notes && e.location_notes.toLowerCase().includes(search.toLowerCase()));

    const matchesType = selectedType === 'All' || e.event_type.toLowerCase() === selectedType.toLowerCase();
    const matchesStatus = selectedStatus === 'All' || e.status === selectedStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', paddingBottom: '3rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <Telescope size={26} color="#38bdf8" />
            <span>Sky Observation Targets</span>
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
            Upcoming planetary alignments, meteor streams, occultations, and deep-sky observation windows
          </p>
        </div>

        <button
          onClick={user ? onOpenCreate : () => openAuth('login')}
          className="btn-primary"
        >
          <PlusCircle size={16} />
          <span>Log Sky Event</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div
        className="glass-panel"
        style={{
          padding: '1rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        {/* Search */}
        <div style={{ position: 'relative', flex: '1 1 260px' }}>
          <input
            type="text"
            placeholder="Search celestial events, constellations, optics..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input"
            style={{ width: '100%', paddingLeft: '2.4rem' }}
          />
          <Search size={16} color="#64748b" style={{ position: 'absolute', left: '0.85rem', top: '0.85rem' }} />
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
          {types.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedType(t)}
              style={{
                fontSize: '0.78rem',
                padding: '0.4rem 0.75rem',
                borderRadius: 'var(--radius-full)',
                background: selectedType === t ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                border: `1px solid ${selectedType === t ? 'rgba(56, 189, 248, 0.5)' : 'var(--border-subtle)'}`,
                color: selectedType === t ? '#38bdf8' : 'var(--text-muted)',
                fontWeight: selectedType === t ? 600 : 500
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Events Grid */}
      {filteredEvents.length === 0 ? (
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
          <Telescope size={40} color="#64748b" />
          <h3 style={{ fontSize: '1.2rem', color: '#ffffff' }}>No matching sky events found</h3>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', maxWidth: '420px' }}>
            {search || selectedType !== 'All'
              ? 'Try adjusting your search criteria or filter tags.'
              : 'Add your first astronomical sky event to begin tracking observation schedules.'}
          </p>
          <button onClick={user ? onOpenCreate : () => openAuth('login')} className="btn-primary" style={{ marginTop: '0.5rem' }}>
            <PlusCircle size={15} />
            <span>Log Sky Event</span>
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.25rem' }}>
          {filteredEvents.map((evt) => (
            <EventCard
              key={evt.id}
              event={evt}
              onDelete={onDelete}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}
