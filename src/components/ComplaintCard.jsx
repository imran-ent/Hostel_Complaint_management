import React from 'react';
import { useComplaints } from '../context/ComplaintContext';
import { ThumbsUp, CheckCircle, Clock } from 'lucide-react';

export const ComplaintCard = ({ complaint, isAdmin }) => {
  const { toggleUpvote, markSolved, currentUser } = useComplaints();
  
  const hasVoted = complaint.votedBy.includes(currentUser?.id);
  const isSolved = complaint.status === 'solved';

  return (
    <div className="glass animate-fade-in" style={{ padding: '1.5rem', marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: '600', textTransform: 'uppercase' }}>
            {complaint.category}
          </span>
          <h3 style={{ fontSize: '1.25rem', marginTop: '0.25rem' }}>{complaint.title}</h3>
        </div>
        <span className={`badge ${isSolved ? 'badge-solved' : 'badge-pending'}`}>
          {isSolved ? 'Solved' : 'Pending'}
        </span>
      </div>

      <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.5' }}>
        {complaint.description}
      </p>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem', paddingTop: '1rem', borderTop: '1px solid var(--surface-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          <Clock size={16} />
          {new Date(complaint.createdAt).toLocaleDateString()}
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          {!isAdmin && (
            <button 
              className="btn" 
              onClick={() => toggleUpvote(complaint.id)}
              style={{ 
                background: hasVoted ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                color: hasVoted ? 'var(--primary)' : 'var(--text-muted)',
                border: '1px solid',
                borderColor: hasVoted ? 'var(--primary)' : 'var(--surface-border)',
                padding: '0.5rem 1rem'
              }}
            >
              <ThumbsUp size={16} fill={hasVoted ? "currentColor" : "none"} />
              {complaint.upvotes}
            </button>
          )}

          {isAdmin && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                <ThumbsUp size={16} /> {complaint.upvotes}
              </span>
              {!isSolved && (
                <button 
                  className="btn btn-primary" 
                  onClick={() => markSolved(complaint.id)}
                  style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                >
                  <CheckCircle size={16} /> Mark Solved
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
