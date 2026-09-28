import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ toasts, onDismiss }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '1.5rem',
        right: '1.5rem',
        zIndex: 2000,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.65rem',
        maxWidth: '420px',
        width: 'calc(100% - 3rem)',
        pointerEvents: 'none'
      }}
    >
      {toasts.map((toast) => {
        const isError = toast.type === 'error';
        const isSuccess = toast.type === 'success';

        return (
          <div
            key={toast.id}
            style={{
              pointerEvents: 'auto',
              background: '#0e1628',
              border: `1px solid ${isError ? 'rgba(244, 63, 94, 0.4)' : isSuccess ? 'rgba(52, 211, 153, 0.4)' : 'rgba(56, 189, 248, 0.4)'}`,
              boxShadow: `0 10px 25px -5px rgba(0, 0, 0, 0.7), 0 0 15px ${isError ? 'rgba(244, 63, 94, 0.2)' : isSuccess ? 'rgba(52, 211, 153, 0.2)' : 'rgba(56, 189, 248, 0.2)'}`,
              borderRadius: '12px',
              padding: '0.85rem 1rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.75rem',
              animation: 'fadeIn 0.25s ease-out'
            }}
          >
            {isError ? (
              <AlertCircle size={20} color="#f43f5e" style={{ flexShrink: 0, marginTop: '2px' }} />
            ) : isSuccess ? (
              <CheckCircle2 size={20} color="#34d399" style={{ flexShrink: 0, marginTop: '2px' }} />
            ) : (
              <Info size={20} color="#38bdf8" style={{ flexShrink: 0, marginTop: '2px' }} />
            )}

            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#ffffff' }}>
                {toast.title || (isError ? 'Observatory Alert' : 'System Notification')}
              </div>
              {toast.message && (
                <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.15rem' }}>
                  {toast.message}
                </div>
              )}
            </div>

            <button
              onClick={() => onDismiss(toast.id)}
              style={{
                background: 'transparent',
                color: '#64748b',
                cursor: 'pointer',
                padding: '2px'
              }}
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
