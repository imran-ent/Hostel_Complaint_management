import React, { useState } from 'react';
import { useComplaints } from '../context/ComplaintContext';
import { ComplaintCard } from './ComplaintCard';
import { ComplaintForm } from './ComplaintForm';
import { PlusCircle, LogOut } from 'lucide-react';
import { NotificationToast } from './NotificationToast';

export const StudentPortal = () => {
  const { complaints, logout } = useComplaints();
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState('all');

  const filteredComplaints = complaints.filter(c => {
    if (filter === 'all') return true;
    if (filter === 'my') return c.studentId === 'student-local';
    return true;
  });

  return (
    <div className="container">
      <header className="header animate-fade-in">
        <div>
          <h1 className="text-gradient" style={{ fontSize: '2rem' }}>Student Portal</h1>
          <p style={{ color: 'var(--text-muted)' }}>Report and track hostel issues</p>
        </div>
        <button className="btn btn-secondary" onClick={logout}>
          <LogOut size={18} /> Logout
        </button>
      </header>

      {!showForm ? (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', gap: '1rem', background: 'var(--surface-color)', padding: '0.25rem', borderRadius: '8px' }}>
            <button 
              className="btn" 
              onClick={() => setFilter('all')}
              style={{ padding: '0.5rem 1rem', background: filter === 'all' ? 'rgba(255,255,255,0.1)' : 'transparent' }}
            >
              All Complaints
            </button>
            <button 
              className="btn" 
              onClick={() => setFilter('my')}
              style={{ padding: '0.5rem 1rem', background: filter === 'my' ? 'rgba(255,255,255,0.1)' : 'transparent' }}
            >
              My Complaints
            </button>
          </div>

          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            <PlusCircle size={18} /> New Complaint
          </button>
        </div>
      ) : (
        <ComplaintForm onCancel={() => setShowForm(false)} />
      )}

      <div style={{ display: 'grid', gap: '1rem' }}>
        {filteredComplaints.length === 0 ? (
          <div className="glass" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <p>No complaints found.</p>
          </div>
        ) : (
          filteredComplaints.map(complaint => (
            <ComplaintCard key={complaint.id} complaint={complaint} isAdmin={false} />
          ))
        )}
      </div>

      <NotificationToast />
    </div>
  );
};
