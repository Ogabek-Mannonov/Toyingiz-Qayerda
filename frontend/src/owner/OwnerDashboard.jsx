import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaBuilding, FaCalendarAlt, FaCalendarCheck, FaCalendarTimes } from 'react-icons/fa';
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
        console.error('Error fetching statistics:', error);
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
      <div className="dashboard-header">
        <h2>Dashboard Overview</h2>
        <p>Welcome back! Here's what's happening with your venues today.</p>
      </div>

      <div className="stats-cards">
        <div className="card">
          <div className="card-icon venue-icon">
            <FaBuilding />
          </div>
          <div className="card-content">
            <h4>Total Venues</h4>
            <p>{stats.totalVenues}</p>
          </div>
        </div>

        <div className="card">
          <div className="card-icon upcoming-icon">
            <FaCalendarAlt />
          </div>
          <div className="card-content">
            <h4>Upcoming Bookings</h4>
            <p>{stats.upcomingBookings}</p>
          </div>
        </div>

        <div className="card">
          <div className="card-icon today-icon">
            <FaCalendarCheck />
          </div>
          <div className="card-content">
            <h4>Today's Bookings</h4>
            <p>{stats.todayBookings}</p>
          </div>
        </div>

        <div className="card">
          <div className="card-icon cancelled-icon">
            <FaCalendarTimes />
          </div>
          <div className="card-content">
            <h4>Cancelled Bookings</h4>
            <p>{stats.cancelledBookings}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
