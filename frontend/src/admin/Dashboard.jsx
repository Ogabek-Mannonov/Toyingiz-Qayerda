import React, { useEffect, useState } from 'react';
import axios from 'axios';

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
    axios.get('/api/admin/dashboard-stats')
      .then(res => {
        setStats(res.data);
      })
      .catch(err => {
        console.error('Statistika olishda xatolik:', err);
      });
  }, []);

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Dashboard</h1>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Umumiy to'yxonalar</h3>
          <p>{stats.totalVenues}</p>
        </div>
        <div className="stat-card">
          <h3>Tasdiqlangan to'yxonalar</h3>
          <p>{stats.approvedVenues}</p>
        </div>
        <div className="stat-card">
          <h3>Tasdiqlanmagan to'yxonalar</h3>
          <p>{stats.pendingVenues}</p>
        </div>
        <div className="stat-card">
          <h3>To'yxona egalari</h3>
          <p>{stats.ownersCount}</p>
        </div>
        <div className="stat-card">
          <h3>Yaqinlashayotgan bronlar</h3>
          <p>{stats.upcomingBookings}</p>
        </div>
        <div className="stat-card">
          <h3>O'tgan bronlar</h3>
          <p>{stats.pastBookings}</p>
        </div>
      </div>
    </div>
  );
}
