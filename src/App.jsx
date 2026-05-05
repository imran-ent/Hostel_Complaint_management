import React from 'react';
import { useComplaints } from './context/ComplaintContext';
import { PortalSelector } from './components/PortalSelector';
import { StudentPortal } from './components/StudentPortal';
import { AdminPortal } from './components/AdminPortal';

function AppContent() {
  const { currentUser } = useComplaints();

  if (!currentUser) {
    return <PortalSelector />;
  }

  if (currentUser.role === 'admin') {
    return <AdminPortal />;
  }

  return <StudentPortal />;
}

function App() {
  return <AppContent />;
}

export default App;
