import React, { useState } from 'react';
import { BookOpen, PlusCircle, Sparkles, Calendar, Search } from 'lucide-react';
import ReportCard from '../components/ReportCard';
import { useAuth } from '../context/AuthContext';

export default function ReportsTab({
  reports,
  onOpenCreate,
  onGenerateTodayReport,
  onDelete,
  onSelect
}) {
  const { user, openAuth } = useAuth();
  const [search, setSearch] = useState('');

  const filteredReports = reports.filter((r) => {
    return (
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.summary.toLowerCase().includes(search.toLowerCase()) ||
      r.report_date.includes(search)
    );
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', paddingBottom: '3rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <BookOpen size={26} color="#34d399" />
            <span>Dated Observatory Daily Reports</span>
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
            Daily scientific logs recording atmospheric seeing conditions, instrument telemetry, and astronomical syntheses
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={user ? onGenerateTodayReport : () => openAuth('login')}
            className="btn-secondary"
          >
            <Sparkles size={16} color="#34d399" />
            <span>Auto-Dispatch Today</span>
          </button>

          <button
            onClick={user ? onOpenCreate : () => openAuth('login')}
            className="btn-primary"
          >
            <PlusCircle size={16} />
            <span>File Daily Report</span>
          </button>
        </div>
      </div>

      {/* Search Filter */}
      <div
        className="glass-panel"
        style={{
          padding: '0.85rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}
      >
        <div style={{ position: 'relative', flex: 1 }}>
          <input
            type="text"
            placeholder="Search report titles, summaries, dates (YYYY-MM-DD), or seeing conditions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input"
            style={{ width: '100%', paddingLeft: '2.4rem' }}
          />
          <Search size={16} color="#64748b" style={{ position: 'absolute', left: '0.85rem', top: '0.85rem' }} />
        </div>
      </div>

      {/* Reports Grid */}
      {filteredReports.length === 0 ? (
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
          <BookOpen size={40} color="#64748b" />
          <h3 style={{ fontSize: '1.2rem', color: '#ffffff' }}>No observatory reports found</h3>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', maxWidth: '420px' }}>
            Generate an automated report from today's RSS feed items and sky events, or file a manual field observation log.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button onClick={user ? onGenerateTodayReport : () => openAuth('login')} className="btn-secondary">
              <Sparkles size={15} color="#34d399" />
              <span>Auto-Dispatch Today</span>
            </button>
            <button onClick={user ? onOpenCreate : () => openAuth('login')} className="btn-primary">
              <PlusCircle size={15} />
              <span>File Daily Report</span>
            </button>
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '1.5rem' }}>
          {filteredReports.map((report) => (
            <ReportCard
              key={report.id}
              report={report}
              onDelete={onDelete}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}
