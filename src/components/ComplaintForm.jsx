import React, { useState } from 'react';
import { useComplaints } from '../context/ComplaintContext';
import { Send } from 'lucide-react';

export const ComplaintForm = ({ onCancel }) => {
  const { addComplaint } = useComplaints();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Maintenance');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    addComplaint({ title, description, category });
    
    // Reset form
    setTitle('');
    setDescription('');
    if(onCancel) onCancel();
  };

  return (
    <form onSubmit={handleSubmit} className="glass animate-fade-in" style={{ padding: '2rem', marginBottom: '2rem' }}>
      <h2 style={{ marginBottom: '1.5rem' }}>Submit a New Complaint</h2>
      
      <div className="form-group">
        <label className="form-label">Category</label>
        <select 
          value={category} 
          onChange={(e) => setCategory(e.target.value)}
          className="form-select"
        >
          <option value="Maintenance">Maintenance</option>
          <option value="Cleaning">Cleaning</option>
          <option value="Internet">Internet / Wi-Fi</option>
          <option value="Noise">Noise Disturbance</option>
          <option value="Security">Security</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">Title</label>
        <input 
          type="text" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)}
          className="form-input"
          placeholder="Brief description of the issue"
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label">Details</label>
        <textarea 
          value={description} 
          onChange={(e) => setDescription(e.target.value)}
          className="form-textarea"
          rows={4}
          placeholder="Provide more context..."
          required
        />
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <button type="submit" className="btn btn-primary" disabled={!title.trim() || !description.trim()}>
          <Send size={18} /> Submit
        </button>
        {onCancel && (
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};
