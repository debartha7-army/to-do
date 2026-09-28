import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import Starfield from './components/Starfield';
import Toast from './components/Toast';
import AuthModal from './components/AuthModal';
import CreateEventModal from './components/CreateEventModal';
import CreateDiscoveryModal from './components/CreateDiscoveryModal';
import CreateReportModal from './components/CreateReportModal';
import ItemDetailModal from './components/ItemDetailModal';
import SocialHubModal from './components/SocialHubModal';

import DashboardTab from './tabs/DashboardTab';
import EventsTab from './tabs/EventsTab';
import DiscoveriesTab from './tabs/DiscoveriesTab';
import ReportsTab from './tabs/ReportsTab';

import { api } from './services/api';
import { useAuth } from './context/AuthContext';

export default function App() {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [events, setEvents] = useState([]);
  const [discoveries, setDiscoveries] = useState([]);
  const [reports, setReports] = useState([]);

  const [loading, setLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [toasts, setToasts] = useState([]);

  // Modal states
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);
  const [isCreateDiscoveryOpen, setIsCreateDiscoveryOpen] = useState(false);
  const [isCreateReportOpen, setIsCreateReportOpen] = useState(false);
  const [isSocialHubOpen, setIsSocialHubOpen] = useState(false);


  // Selected item modal
  const [selectedDetail, setSelectedDetail] = useState(null); // { item, kind }

  const addToast = useCallback((title, message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const dismissToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Load all data
  const loadData = useCallback(async () => {
    try {
      const [eventsRes, discoveriesRes, reportsRes] = await Promise.all([
        api.getEvents().catch(() => ({ events: [] })),
        api.getDiscoveries().catch(() => ({ discoveries: [] })),
        api.getReports().catch(() => ({ reports: [] }))
      ]);

      if (eventsRes.events) setEvents(eventsRes.events);
      if (discoveriesRes.discoveries) setDiscoveries(discoveriesRes.discoveries);
      if (reportsRes.reports) setReports(reportsRes.reports);
    } catch (err) {
      console.error('[App] Failed to load data:', err);
      addToast('Data Fetch Error', 'Unable to reach observatory API.', 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    loadData();
  }, [loadData, user]);

  // Sync Official Feeds handler
  const handleSyncFeeds = async () => {
    setIsSyncing(true);
    addToast('Contacting Telemetry Feeds', 'Syncing official NASA/JPL and ESA RSS channels...', 'info');

    try {
      const res = await api.syncFeeds();
      const count = res.stats?.newDiscoveriesCount || 0;
      addToast(
        'Feed Synchronization Complete',
        `Retrieved latest publications. Added ${count} new space-science record${count === 1 ? '' : 's'}.${res.stats?.autoReportGenerated ? ' Daily report auto-generated.' : ''}`,
        'success'
      );
      await loadData();
    } catch (err) {
      addToast('Sync Interrupted', err.message, 'error');
    } finally {
      setIsSyncing(false);
    }
  };

  // Auto-generate today's report
  const handleGenerateTodayReport = async () => {
    try {
      const res = await api.generateTodayReport();
      addToast('Daily Report Generated', 'Today\'s discoveries and events synthesized into dispatch.', 'success');
      setReports((prev) => [res.report, ...prev]);
      setActiveTab('reports');
    } catch (err) {
      addToast('Failed to Generate Report', err.message, 'error');
    }
  };

  // Delete item handler using unified DELETE /api/:kind/:id
  const handleDeleteItem = async (kind, id) => {
    try {
      await api.deleteItem(kind, id);
      addToast('Record Removed', `Record was deleted from ${kind} logbook.`, 'info');

      if (kind === 'events') {
        setEvents((prev) => prev.filter((e) => e.id !== id));
      } else if (kind === 'discoveries') {
        setDiscoveries((prev) => prev.filter((d) => d.id !== id));
      } else if (kind === 'reports') {
        setReports((prev) => prev.filter((r) => r.id !== id));
      }
    } catch (err) {
      addToast('Deletion Failed', err.message, 'error');
    }
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Starfield />

      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="orbit-container" style={{ position: 'relative', zIndex: 1, marginTop: '2rem', flex: 1 }}>
        {loading ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '50vh',
              gap: '1rem',
              color: 'var(--text-muted)'
            }}
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                border: '3px solid rgba(56, 189, 248, 0.2)',
                borderTopColor: '#38bdf8',
                borderRadius: '50%',
                animation: 'radarSpin 1s linear infinite'
              }}
            />
            <span style={{ fontSize: '0.9rem', letterSpacing: '0.05em' }}>
              CALIBRATING OBSERVATORY SENSORS...
            </span>
          </div>
        ) : (
          <>
            {activeTab === 'dashboard' && (
              <DashboardTab
                events={events}
                discoveries={discoveries}
                reports={reports}
                onSyncFeeds={handleSyncFeeds}
                isSyncing={isSyncing}
                onOpenCreateEvent={() => setIsCreateEventOpen(true)}
                onOpenCreateDiscovery={() => setIsCreateDiscoveryOpen(true)}
                onOpenCreateReport={() => setIsCreateReportOpen(true)}
                onGenerateTodayReport={handleGenerateTodayReport}
                onDeleteEvent={(id) => handleDeleteItem('events', id)}
                onDeleteDiscovery={(id) => handleDeleteItem('discoveries', id)}
                onDeleteReport={(id) => handleDeleteItem('reports', id)}
                onSelectEvent={(e) => setSelectedDetail({ item: e, kind: 'event' })}
                onSelectDiscovery={(d) => setSelectedDetail({ item: d, kind: 'discovery' })}
                onSelectReport={(r) => setSelectedDetail({ item: r, kind: 'report' })}
                setActiveTab={setActiveTab}
              />
            )}

            {activeTab === 'events' && (
              <EventsTab
                events={events}
                onOpenCreate={() => setIsCreateEventOpen(true)}
                onDelete={(id) => handleDeleteItem('events', id)}
                onSelect={(e) => setSelectedDetail({ item: e, kind: 'event' })}
              />
            )}

            {activeTab === 'discoveries' && (
              <DiscoveriesTab
                discoveries={discoveries}
                onSyncFeeds={handleSyncFeeds}
                isSyncing={isSyncing}
                onOpenCreate={() => setIsCreateDiscoveryOpen(true)}
                onOpenSocialHub={() => setIsSocialHubOpen(true)}
                onDelete={(id) => handleDeleteItem('discoveries', id)}
                onSelect={(d) => setSelectedDetail({ item: d, kind: 'discovery' })}
              />
            )}

            {activeTab === 'reports' && (
              <ReportsTab
                reports={reports}
                onOpenCreate={() => setIsCreateReportOpen(true)}
                onGenerateTodayReport={handleGenerateTodayReport}
                onDelete={(id) => handleDeleteItem('reports', id)}
                onSelect={(r) => setSelectedDetail({ item: r, kind: 'report' })}
              />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer
        style={{
          borderTop: '1px solid var(--border-subtle)',
          padding: '1.5rem 0',
          position: 'relative',
          zIndex: 1,
          marginTop: 'auto',
          background: 'rgba(7, 9, 19, 0.7)'
        }}
      >
        <div className="orbit-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', fontSize: '0.8rem', color: '#64748b' }}>
          <div>
            Orbit Notes — Personal Astronomy & Discovery Observatory
          </div>
          <div>
            Connected to Supabase Postgres • Scheduled NASA/JPL, ESA, YouTube & Reddit Feeds 08:00 IST
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AuthModal onToast={addToast} />

      <CreateEventModal
        isOpen={isCreateEventOpen}
        onClose={() => setIsCreateEventOpen(false)}
        onCreated={(newEvent) => setEvents((prev) => [newEvent, ...prev])}
        onToast={addToast}
      />

      <CreateDiscoveryModal
        isOpen={isCreateDiscoveryOpen}
        onClose={() => setIsCreateDiscoveryOpen(false)}
        onCreated={(newDisc) => setDiscoveries((prev) => [newDisc, ...prev])}
        onToast={addToast}
      />

      <CreateReportModal
        isOpen={isCreateReportOpen}
        onClose={() => setIsCreateReportOpen(false)}
        onCreated={(newRep) => setReports((prev) => [newRep, ...prev])}
        onToast={addToast}
      />

      <SocialHubModal
        isOpen={isSocialHubOpen}
        onClose={() => setIsSocialHubOpen(false)}
        onSynced={(updated) => setDiscoveries(updated)}
        onToast={addToast}
      />

      <ItemDetailModal
        item={selectedDetail?.item}
        kind={selectedDetail?.kind}
        onClose={() => setSelectedDetail(null)}
      />

      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}

