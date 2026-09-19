import React from 'react';
import SidebarOwner from './SidebarOwner';
import { Outlet } from 'react-router-dom';

export default function OwnerPanel() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <SidebarOwner />
      <main style={{ marginLeft: '250px', width: '100%', minHeight: '100vh' }}>
        <Outlet />
      </main>
    </div>
  );
}
