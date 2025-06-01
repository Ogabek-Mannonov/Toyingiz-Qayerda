import React from 'react';
import SidebarOwner from './SidebarOwner';
import { Outlet } from 'react-router-dom';

export default function OwnerPanel() {
  return (
    <div style={{ display: 'flex' }}>
      <SidebarOwner />
      <main style={{ marginLeft: '250px', padding: '20px', width: '100%' }}>
        <h1>Owner Panel</h1>
        <Outlet />
      </main>
    </div>
  );
}
