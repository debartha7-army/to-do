import React, { useState } from 'react';
import { X, Lock, Mail, User, Telescope, Sparkles, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthModal({ onToast }) {
  const { isAuthModalOpen, closeAuth, authMode, setAuthMode, login, signup } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (authMode === 'login') {
        await login(email, password);
        onToast && onToast('Astronomer Authenticated', 'Welcome back to your observatory logs.', 'success');
      } else {
        await signup(email, password, displayName);
        onToast && onToast('Observatory Station Registered', 'Account initialized with bcrypt protection.', 'success');
      }
      setEmail('');
      setPassword('');
      setDisplayName('');
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setEmail('astronomer@observatory.org');
    setPassword('Cosmic2026!Orbit');
    setDisplayName('Dr. Carl Kepler');
  };

  return (
    <div className="modal-overlay" onClick={closeAuth}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '460px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'rgba(56, 189, 248, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#38bdf8'
              }}
            >
              <Telescope size={18} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem' }}>
                {authMode === 'login' ? 'Astronomer Login' : 'Join Observatory'}
              </h2>
              <p style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                {authMode === 'login'
                  ? 'Access your protected astronomical logs and reports'
                  : 'Start your personal astronomy and space discovery catalog'}
              </p>
            </div>
          </div>

          <button onClick={closeAuth} className="btn-ghost" style={{ padding: '0.4rem' }}>
            <X size={18} />
          </button>
        </div>

        {error && (
          <div
            style={{
              background: 'rgba(244, 63, 94, 0.12)',
              border: '1px solid rgba(244, 63, 94, 0.3)',
              borderRadius: 'var(--radius-sm)',
              padding: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: '#fda4af',
              fontSize: '0.825rem',
              marginBottom: '1.25rem'
            }}
          >
            <AlertCircle size={16} color="#f43f5e" style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {authMode === 'signup' && (
            <div className="form-group">
              <label className="form-label">
                <span>Astronomer Name / Call Sign</span>
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Elena Vance"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="form-input"
                  style={{ width: '100%', paddingLeft: '2.4rem' }}
                />
                <User size={15} color="#64748b" style={{ position: 'absolute', left: '0.85rem', top: '0.85rem' }} />
              </div>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">
              <span>Email Address</span>
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                required
                placeholder="astronomer@observatory.org"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                style={{ width: '100%', paddingLeft: '2.4rem' }}
              />
              <Mail size={15} color="#64748b" style={{ position: 'absolute', left: '0.85rem', top: '0.85rem' }} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              <span>Password (12 rounds bcrypt protected)</span>
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                required
                minLength={6}
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                style={{ width: '100%', paddingLeft: '2.4rem' }}
              />
              <Lock size={15} color="#64748b" style={{ position: 'absolute', left: '0.85rem', top: '0.85rem' }} />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem', padding: '0.75rem' }}
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : authMode === 'login' ? (
              <span>Sign In to Observatory</span>
            ) : (
              <span>Register Observatory Account</span>
            )}
          </button>
        </form>

        <div style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-subtle)', textAlign: 'center' }}>
          {authMode === 'login' ? (
            <p style={{ fontSize: '0.825rem', color: '#94a3b8' }}>
              Don't have an observatory account?{' '}
              <button
                type="button"
                onClick={() => { setError(''); setAuthMode('signup'); }}
                style={{ color: '#38bdf8', background: 'transparent', fontWeight: 600 }}
              >
                Create one now
              </button>
            </p>
          ) : (
            <p style={{ fontSize: '0.825rem', color: '#94a3b8' }}>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => { setError(''); setAuthMode('login'); }}
                style={{ color: '#38bdf8', background: 'transparent', fontWeight: 600 }}
              >
                Sign in here
              </button>
            </p>
          )}

          {/* Quick Demo Pre-fill */}
          <button
            type="button"
            onClick={handleDemoLogin}
            className="btn-ghost"
            style={{ fontSize: '0.75rem', marginTop: '0.75rem', color: '#fbbf24' }}
          >
            <Sparkles size={12} /> Fill sample credentials
          </button>
        </div>
      </div>
    </div>
  );
}
