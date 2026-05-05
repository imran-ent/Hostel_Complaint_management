import React from 'react';
import { useComplaints } from '../context/ComplaintContext';
import { Bell, X } from 'lucide-react';

export const NotificationToast = () => {
  const { notifications, dismissNotification } = useComplaints();

  if (notifications.length === 0) return null;

  return (
    <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 1000, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {notifications.map(notif => (
        <div key={notif.id} className="glass animate-fade-in" style={{ 
          padding: '1rem 1.5rem', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '1rem',
          borderLeft: '4px solid var(--success)',
          background: 'rgba(16, 185, 129, 0.1)',
          maxWidth: '350px'
        }}>
          <div style={{ background: 'var(--success)', padding: '0.5rem', borderRadius: '50%' }}>
            <Bell size={20} color="white" />
          </div>
          <div style={{ flex: 1 }}>
            <h4 style={{ fontSize: '0.9rem', marginBottom: '0.25rem' }}>Update</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{notif.message}</p>
          </div>
          <button 
            onClick={() => dismissNotification(notif.id)}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>
      ))}
    </div>
  );
};
