import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ComplaintContext = createContext();

export const useComplaints = () => {
  return useContext(ComplaintContext);
};

export const ComplaintProvider = ({ children }) => {
  const [complaints, setComplaints] = useState([]);
  const [currentUser, setCurrentUser] = useState(null); // { role: 'admin' | 'student', id: string }
  const [notifications, setNotifications] = useState([]);

  // Fetch complaints from our new Node.js + Oracle backend
  const fetchComplaints = useCallback(async () => {
    try {
      const res = await fetch('/api/complaints');
      if (res.ok) {
        const data = await res.json();
        setComplaints(data);
      }
    } catch (err) {
      console.error('Error fetching complaints:', err);
    }
  }, []);

  // Poll for notifications if logged in as student
  const fetchNotifications = useCallback(async () => {
    if (currentUser?.role === 'student' && currentUser?.id) {
      try {
        const res = await fetch(`/api/notifications/${currentUser.id}`);
        if (res.ok) {
          const data = await res.json();
          setNotifications(data);
        }
      } catch (err) {
        console.error('Error fetching notifications:', err);
      }
    }
  }, [currentUser]);

  // Initial load
  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  // Set up polling for notifications
  useEffect(() => {
    let interval;
    if (currentUser?.role === 'student') {
      fetchNotifications(); // Initial fetch
      interval = setInterval(fetchNotifications, 5000); // Check every 5 seconds
    }
    return () => clearInterval(interval);
  }, [currentUser, fetchNotifications]);

  const addComplaint = async (newComplaint) => {
    const complaint = {
      ...newComplaint,
      id: Date.now().toString(),
      upvotes: 0,
      status: 'pending',
      createdAt: new Date().toISOString(),
      studentId: currentUser.id,
      votedBy: []
    };

    // Optimistically update UI
    setComplaints(prev => [complaint, ...prev]);

    // Send to backend
    try {
      await fetch('/api/complaints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: complaint.id,
          title: complaint.title,
          description: complaint.description,
          category: complaint.category,
          studentId: complaint.studentId,
          status: complaint.status,
          upvotes: complaint.upvotes,
          createdAt: complaint.createdAt
        })
      });
    } catch (err) {
      console.error('Error adding complaint:', err);
    }
  };

  const toggleUpvote = async (complaintId) => {
    if (currentUser?.role !== 'student') return;

    let isUpvoting = true;

    // Optimistically update UI
    setComplaints(prev => prev.map(c => {
      if (c.id === complaintId) {
        const hasVoted = c.votedBy.includes(currentUser.id);
        isUpvoting = !hasVoted;
        if (hasVoted) {
          return { ...c, upvotes: c.upvotes - 1, votedBy: c.votedBy.filter(id => id !== currentUser.id) };
        } else {
          return { ...c, upvotes: c.upvotes + 1, votedBy: [...c.votedBy, currentUser.id] };
        }
      }
      return c;
    }));

    // Send to backend
    try {
      await fetch(`/api/complaints/${complaintId}/upvote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId: currentUser.id, isUpvoting })
      });
    } catch (err) {
      console.error('Error toggling upvote:', err);
    }
  };

  const markSolved = async (complaintId) => {
    if (currentUser?.role !== 'admin') return;

    // Optimistically update UI
    setComplaints(prev => prev.map(c => c.id === complaintId ? { ...c, status: 'solved' } : c));
      
    // Send to backend
    try {
      await fetch(`/api/complaints/${complaintId}/solve`, { method: 'PATCH' });
    } catch (err) {
      console.error('Error marking solved:', err);
    }
  };

  const dismissNotification = async (id) => {
    // Optimistically remove from UI
    setNotifications(prev => prev.filter(n => n.id !== id));
    
    // Delete from backend
    try {
      await fetch(`/api/notifications/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.error('Error dismissing notification:', err);
    }
  };

  const login = (role) => {
    setCurrentUser({
      role,
      id: role === 'student' ? 'student-local' : 'admin-local'
    });
  };

  const logout = () => {
    setCurrentUser(null);
    setNotifications([]);
  };

  return (
    <ComplaintContext.Provider value={{
      complaints,
      currentUser,
      notifications,
      login,
      logout,
      addComplaint,
      toggleUpvote,
      markSolved,
      dismissNotification
    }}>
      {children}
    </ComplaintContext.Provider>
  );
};
