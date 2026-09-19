import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './owner-dashboard.css';

export default function OwnerDashboard() {
  const [stats, setStats] = useState({
    totalVenues: 0,
    upcomingBookings: 0,
    todayBookings: 0,
    cancelledBookings: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');

    const fetchStats = async () => {
      try {
        const res = await axios.get('/api/owner/stats', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setStats(res.data);
      } catch (error) {
        console.error('Statistikani olishda xatolik:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div className="owner-dashboard">Loading...</div>;
  }

  return (
    <div className="owner-dashboard">
      <div className="stats-cards">
        <div className="card">Venues: {stats.totalVenues}</div>
        <div className="card">Kelgusi bronlar: {stats.upcomingBookings}</div>
        <div className="card">Bugungi bronlar: {stats.todayBookings}</div>
        <div className="card">Cancelledlar: {stats.cancelledBookings}</div>
      </div>
    </div>
  );
}
