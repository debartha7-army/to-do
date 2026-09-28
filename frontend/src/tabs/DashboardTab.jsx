import React from 'react';
import { Telescope, Radio, BookOpen, RefreshCw, PlusCircle, Sparkles, Orbit, Calendar, ArrowRight, ShieldCheck } from 'lucide-react';
import StatWidget from '../components/StatWidget';
import EventCard from '../components/EventCard';
import DiscoveryCard from '../components/DiscoveryCard';
import ReportCard from '../components/ReportCard';
import { useAuth } from '../context/AuthContext';

export default function DashboardTab({
  events,
  discoveries,
  reports,
  onSyncFeeds,
  isSyncing,
  onOpenCreateEvent,
  onOpenCreateDiscovery,
  onOpenCreateReport,
  onGenerateTodayReport,
  onDeleteEvent,
  onDeleteDiscovery,
  onDeleteReport,
  onSelectEvent,
  onSelectDiscovery,
  onSelectReport,
  setActiveTab
}) {
  const { user, openAuth } = useAuth();

  // Find next upcoming event
  const upcomingEvents = events
    .filter(e => new Date(e.event_date) >= new Date())
    .sort((a, b) => new Date(a.event_date) - new Date(b.event_date));
  const nextEvent = upcomingEvents[0] || events[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '3rem' }}>
      {/* Hero Observatory Banner */}
      <div
        className="glass-panel"
        style={{
          padding: '2.25rem',
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.85) 0%, rgba(30, 27, 75, 0.4) 100%)',
          border: '1px solid rgba(56, 189, 248, 0.25)',
          boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.7), 0 0 30px rgba(56, 189, 248, 0.1)'
        }}
      >
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '780px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.75rem' }}>
            <span className="pill pill-cyan">
              <Orbit size={13} /> Personal Observatory
            </span>
            <span className="pill pill-gold">
              Auto-Sync 08:00 AM IST Active
            </span>
          </div>

          <h1
            style={{
              fontSize: '2.4rem',
              lineHeight: 1.2,
              marginBottom: '0.85rem',
              background: 'linear-gradient(135deg, #ffffff 30%, #38bdf8 80%, #c084fc 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Orbit Notes — Celestial Observatory Log
          </h1>

          <p style={{ fontSize: '1rem', color: '#94a3b8', lineHeight: 1.6, marginBottom: '1.75rem' }}>
            Track transient sky phenomena, catalog space-science discoveries from official NASA/JPL & ESA feeds, and preserve dated daily observatory dispatches.
          </p>

          {/* Action Row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
            <button
              onClick={onSyncFeeds}
              disabled={isSyncing}
              className={`btn-glow-sync ${isSyncing ? 'spinning' : ''}`}
            >
              <RefreshCw size={17} />
              <span>{isSyncing ? 'Synchronizing Feeds...' : 'Sync Official Feeds'}</span>
            </button>

            {user ? (
              <>
                <button onClick={onOpenCreateEvent} className="btn-primary">
                  <PlusCircle size={16} />
                  <span>Log Sky Event</span>
                </button>
                <button onClick={onOpenCreateDiscovery} className="btn-secondary">
                  <Radio size={16} color="#c084fc" />
                  <span>Add Discovery</span>
                </button>
                <button onClick={onGenerateTodayReport} className="btn-secondary">
                  <Sparkles size={16} color="#34d399" />
                  <span>Auto-Dispatch Today</span>
                </button>
              </>
            ) : (
              <button onClick={() => openAuth('signup')} className="btn-primary">
                <ShieldCheck size={16} />
                <span>Create Free Observatory Profile</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Stats Telemetry Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
        <StatWidget
          title="Scheduled Sky Events"
          value={events.length}
          subtitle={`${upcomingEvents.length} upcoming observations`}
          icon={Telescope}
          color="cyan"
        />
        <StatWidget
          title="Space Science Discoveries"
          value={discoveries.length}
          subtitle="Official NASA/ESA & Custom"
          icon={Radio}
          color="purple"
        />
        <StatWidget
          title="Observatory Reports"
          value={reports.length}
          subtitle="Archived daily research logs"
          icon={BookOpen}
          color="emerald"
        />
        <StatWidget
          title="Daily Feed Automation"
          value="08:00 AM"
          subtitle="IST (India Standard Time)"
          icon={Calendar}
          color="gold"
        />
      </div>

      {/* Spotlight: Next Sky Event Countdown & Latest Daily Report */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
        {nextEvent && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Telescope size={18} color="#38bdf8" />
                <span>Next Celestial Observation Target</span>
              </h3>
              <button
                onClick={() => setActiveTab('events')}
                className="btn-ghost"
                style={{ fontSize: '0.8rem', color: '#38bdf8' }}
              >
                <span>View All ({events.length})</span>
                <ArrowRight size={13} />
              </button>
            </div>
            <EventCard
              event={nextEvent}
              onDelete={onDeleteEvent}
              onSelect={() => onSelectEvent(nextEvent)}
            />
          </div>
        )}

        {reports[0] && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <BookOpen size={18} color="#34d399" />
                <span>Latest Observatory Dispatch</span>
              </h3>
              <button
                onClick={() => setActiveTab('reports')}
                className="btn-ghost"
                style={{ fontSize: '0.8rem', color: '#34d399' }}
              >
                <span>View All ({reports.length})</span>
                <ArrowRight size={13} />
              </button>
            </div>
            <ReportCard
              report={reports[0]}
              onDelete={onDeleteReport}
              onSelect={() => onSelectReport(reports[0])}
            />
          </div>
        )}
      </div>

      {/* Recent Discoveries Feed */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Radio size={20} color="#c084fc" />
              <span>Latest Space-Science Feeds</span>
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
              Dispatches from official NASA, JPL, and ESA astrophysics RSS channels
            </p>
          </div>

          <button
            onClick={() => setActiveTab('discoveries')}
            className="btn-secondary"
            style={{ fontSize: '0.825rem' }}
          >
            <span>Explore Discovery Library</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.25rem' }}>
          {discoveries.slice(0, 3).map((disc) => (
            <DiscoveryCard
              key={disc.id}
              discovery={disc}
              onDelete={onDeleteDiscovery}
              onSelect={() => onSelectDiscovery(disc)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
