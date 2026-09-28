import React, { useState, useEffect } from 'react';
import { Telescope, Compass, Radio, BookOpen, Clock, User, LogOut, LogIn, Sparkles, Orbit } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ activeTab, setActiveTab }) {
  const { user, logout, openAuth } = useAuth();
  const [time, setTime] = useState({
    utc: '',
    ist: ''
  });

  useEffect(() => {
    const updateClocks = () => {
      const now = new Date();
      setTime({
        utc: now.toISOString().substring(11, 19) + ' UTC',
        ist: now.toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour12: false }) + ' IST'
      });
    };
    updateClocks();
    const interval = setInterval(updateClocks, 1000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: Orbit },
    { id: 'events', label: 'Sky Events', icon: Telescope },
    { id: 'discoveries', label: 'Discoveries', icon: Radio },
    { id: 'reports', label: 'Daily Reports', icon: BookOpen },
  ];

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 500,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        background: 'rgba(7, 9, 19, 0.85)',
        borderBottom: '1px solid var(--border-subtle)',
      }}
    >
      <div className="orbit-container">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '70px',
            gap: '1rem'
          }}
        >
          {/* Logo & Status */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.2), rgba(168, 85, 247, 0.2))',
                border: '1px solid rgba(56, 189, 248, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 15px rgba(56, 189, 248, 0.25)',
              }}
            >
              <Telescope size={22} color="#38bdf8" />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    letterSpacing: '-0.02em',
                    background: 'linear-gradient(90deg, #ffffff 40%, #38bdf8 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Orbit Notes
                </span>
                <span className="pill pill-cyan" style={{ fontSize: '0.65rem', padding: '0.15rem 0.45rem' }}>
                  OBSERVATORY
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.72rem', color: '#94a3b8' }}>
                <span className="pulse-dot"></span>
                <span>Sub-arcsecond Telemetry Active</span>
              </div>
            </div>
          </div>

          {/* Time & Telemetry (Hidden on small mobile) */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              background: 'rgba(15, 23, 42, 0.6)',
              padding: '0.4rem 0.9rem',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.78rem',
              fontFamily: 'var(--font-mono)'
            }}
            className="timecode-display"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#38bdf8' }}>
              <Clock size={13} />
              <span>{time.utc || '00:00:00 UTC'}</span>
            </div>
            <div style={{ width: '1px', height: '14px', background: 'var(--border-subtle)' }} />
            <div style={{ color: '#fbbf24' }}>
              <span>{time.ist || '00:00:00 IST'}</span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    padding: '0.55rem 0.9rem',
                    borderRadius: 'var(--radius-md)',
                    background: isActive ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
                    border: `1px solid ${isActive ? 'rgba(56, 189, 248, 0.4)' : 'transparent'}`,
                    color: isActive ? '#38bdf8' : 'var(--text-muted)',
                    fontWeight: isActive ? 600 : 500,
                    fontSize: '0.85rem',
                    boxShadow: isActive ? '0 0 15px rgba(56, 189, 248, 0.15)' : 'none',
                  }}
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Auth Status & Account */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: 'rgba(255, 255, 255, 0.04)',
                    padding: '0.4rem 0.75rem',
                    borderRadius: 'var(--radius-full)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <div
                    style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #0284c7, #a855f7)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: '#ffffff'
                    }}
                  >
                    {user.displayName?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'A'}
                  </div>
                  <span style={{ fontSize: '0.825rem', fontWeight: 500, color: '#e2e8f0' }}>
                    {user.displayName || user.email}
                  </span>
                </div>

                <button
                  onClick={logout}
                  title="Sign out of observatory"
                  className="btn-ghost"
                  style={{ padding: '0.45rem', borderRadius: 'var(--radius-sm)' }}
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => openAuth('login')}
                className="btn-primary"
                style={{ fontSize: '0.825rem', padding: '0.5rem 1rem' }}
              >
                <LogIn size={15} />
                <span>Astronomer Access</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
