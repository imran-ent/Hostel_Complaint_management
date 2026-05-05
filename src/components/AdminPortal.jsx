import React, { useState } from 'react';
import { useComplaints } from '../context/ComplaintContext';
import { ComplaintCard } from './ComplaintCard';
import { LogOut, Filter } from 'lucide-react';

export const AdminPortal = () => {
  const { complaints, logout } = useComplaints();
  const [filterMode, setFilterMode] = useState('all'); // 'all', 'pending', 'solved'
  const [sortBy, setSortBy] = useState('upvotes'); // 'upvotes', 'recent'

  // Filter & Sort
  let displayedComplaints = [...complaints];
  
  if (filterMode !== 'all') {
    displayedComplaints = displayedComplaints.filter(c => c.status === filterMode);
  }

  displayedComplaints.sort((a, b) => {
    if (sortBy === 'upvotes') {
      return b.upvotes - a.upvotes;
    } else {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
  });

  return (
    <div className="container">
      <header className="header animate-fade-in">
        <div>
          <h1 className="text-gradient" style={{ fontSize: '2rem' }}>Administration</h1>
          <p style={{ color: 'var(--text-muted)' }}>Manage and resolve hostel complaints</p>
        </div>
        <button className="btn btn-secondary" onClick={logout}>
          <LogOut size={18} /> Logout
        </button>
      </header>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '1rem', background: 'var(--surface-color)', padding: '0.25rem', borderRadius: '8px' }}>
          <button 
            className="btn" 
            onClick={() => setFilterMode('all')}
            style={{ padding: '0.5rem 1rem', background: filterMode === 'all' ? 'rgba(255,255,255,0.1)' : 'transparent' }}
          >
            All
          </button>
          <button 
            className="btn" 
            onClick={() => setFilterMode('pending')}
            style={{ padding: '0.5rem 1rem', background: filterMode === 'pending' ? 'rgba(255,255,255,0.1)' : 'transparent' }}
          >
            Pending
          </button>
          <button 
            className="btn" 
            onClick={() => setFilterMode('solved')}
            style={{ padding: '0.5rem 1rem', background: filterMode === 'solved' ? 'rgba(255,255,255,0.1)' : 'transparent' }}
          >
            Solved
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Filter size={16} /> Sort by:
          </span>
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="form-select"
            style={{ width: 'auto', padding: '0.5rem 1rem' }}
          >
            <option value="upvotes">Most Upvoted</option>
            <option value="recent">Most Recent</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gap: '1rem' }}>
        {displayedComplaints.length === 0 ? (
          <div className="glass" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <p>No complaints match your criteria.</p>
          </div>
        ) : (
          displayedComplaints.map(complaint => (
            <ComplaintCard key={complaint.id} complaint={complaint} isAdmin={true} />
          ))
        )}
      </div>
    </div>
  );
};
