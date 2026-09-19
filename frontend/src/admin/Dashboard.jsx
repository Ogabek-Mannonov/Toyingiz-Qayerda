import React, { useEffect, useState } from 'react';
import axios from 'axios';
// Global theme is already imported in AdminPanel.jsx

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalVenues: 0,
    approvedVenues: 0,
    pendingVenues: 0,
    ownersCount: 0,
    upcomingBookings: 0,
    pastBookings: 0,
  });

  useEffect(() => {
    axios.get('/api/admin/dashboard-stats', {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      }
    })
      .then(res => {
        setStats(res.data);
      })
      .catch(err => {
        console.error('Error fetching statistics:', err);
      });
  }, []);

  return (
    <div className="admin-page-container">
      <h1 className="admin-page-title">Dashboard</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
        <div className="admin-card">
          <h3 style={{ fontSize: '16px', color: 'var(--admin-text-muted)', marginBottom: '10px' }}>Total Venues</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--admin-primary)' }}>{stats.totalVenues}</p>
        </div>
        <div className="admin-card">
          <h3 style={{ fontSize: '16px', color: 'var(--admin-text-muted)', marginBottom: '10px' }}>Approved Venues</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--admin-success)' }}>{stats.approvedVenues}</p>
        </div>
        <div className="admin-card">
          <h3 style={{ fontSize: '16px', color: 'var(--admin-text-muted)', marginBottom: '10px' }}>Pending Venues</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#ff9800' }}>{stats.pendingVenues}</p>
        </div>
        <div className="admin-card">
          <h3 style={{ fontSize: '16px', color: 'var(--admin-text-muted)', marginBottom: '10px' }}>Venue Owners</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--admin-text-main)' }}>{stats.ownersCount}</p>
        </div>
        <div className="admin-card">
          <h3 style={{ fontSize: '16px', color: 'var(--admin-text-muted)', marginBottom: '10px' }}>Upcoming Bookings</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--admin-primary)' }}>{stats.upcomingBookings}</p>
        </div>
        <div className="admin-card">
          <h3 style={{ fontSize: '16px', color: 'var(--admin-text-muted)', marginBottom: '10px' }}>Past Bookings</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--admin-text-muted)' }}>{stats.pastBookings}</p>
        </div>
      </div>
    </div>
  );
} 
