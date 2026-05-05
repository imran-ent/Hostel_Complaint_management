import React from 'react';
import { useComplaints } from '../context/ComplaintContext';
import { User, ShieldCheck } from 'lucide-react';

export const PortalSelector = () => {
  const { login } = useComplaints();

  return (
    <div className="container flex-center" style={{ minHeight: '100vh', flexDirection: 'column' }}>
      <div className="glass" style={{ padding: '3rem', textAlign: 'center', maxWidth: '500px', width: '100%' }}>
        <h1 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>HostelCare</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '3rem' }}>
          Select your portal to continue to the Complaint Management System
        </p>

        <div style={{ display: 'grid', gap: '1.5rem' }}>
          <button 
            className="btn glass animate-fade-in" 
            style={{ padding: '1.5rem', justifyContent: 'flex-start', border: '1px solid var(--primary)', animationDelay: '0.1s' }}
            onClick={() => login('student')}
          >
            <div style={{ background: 'rgba(59, 130, 246, 0.2)', padding: '1rem', borderRadius: '12px' }}>
              <User size={32} color="var(--primary)" />
            </div>
            <div style={{ textAlign: 'left', marginLeft: '1rem' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.25rem' }}>Student Portal</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Report issues and vote on peer complaints</p>
            </div>
          </button>

          <button 
            className="btn glass animate-fade-in" 
            style={{ padding: '1.5rem', justifyContent: 'flex-start', border: '1px solid var(--secondary)', animationDelay: '0.2s' }}
            onClick={() => login('admin')}
          >
            <div style={{ background: 'rgba(236, 72, 153, 0.2)', padding: '1rem', borderRadius: '12px' }}>
              <ShieldCheck size={32} color="var(--secondary)" />
            </div>
            <div style={{ textAlign: 'left', marginLeft: '1rem' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.25rem' }}>Admin Portal</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Manage and resolve hostel complaints</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
