import React, { useEffect, useState } from 'react';
import axios from 'axios';
// Global theme is already imported in AdminPanel.jsx
export default function BookingList() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [filters, setFilters] = useState({
    sortBy: 'booking_date',
    order: 'asc',
    status: '',
    venue: '',
  });

  const [venues, setVenues] = useState([]);

  useEffect(() => {
    fetchVenues();
    fetchBookings();
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [filters]);

  const fetchVenues = () => {
    const token = localStorage.getItem('token');
    axios.get('/api/admin/venues', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => setVenues(res.data.venues))
      .catch(() => setVenues([]));
  };

  const fetchBookings = () => {
    setLoading(true);
    setError('');

    const params = {};
    if (filters.sortBy) params.sortBy = filters.sortBy;
    if (filters.order) params.order = filters.order;
    if (filters.status) params.status = filters.status;
    if (filters.venue) params.venue = filters.venue;

    const token = localStorage.getItem('token');

    axios.get('/api/admin/bookings', {
      params,
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        setBookings(res.data.bookings);
        setLoading(false);
      })
      .catch(() => {
        setError('Error fetching bookings');
        setLoading(false);
      });
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleCancelBooking = (id) => {
    if (window.confirm('Are you sure you want to cancel this booking??')) {
      const token = localStorage.getItem('token');

      axios.patch(`/api/admin/bookings/${id}/cancel`, null, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(() => {
          fetchBookings();
          alert('Booking successfully cancelled');
        })
        .catch(() => alert('Error cancelling booking'));
    }
  };

  return (
    <div className="admin-page-container">
      <h1 className="admin-page-title">Bookings List</h1>

      <div className="admin-card" style={{ display: 'flex', gap: '15px', marginBottom: '20px', padding: '15px' }}>
        <select className="admin-input" style={{ marginBottom: '0' }} name="status" value={filters.status} onChange={handleFilterChange}>
          <option value="">All</option>
          <option value="upcoming">Upcoming</option>
          <option value="cancelled">Cancelled</option>
          <option value="completed">Completed</option>
        </select>

        <select className="admin-input" style={{ marginBottom: '0' }} name="venue" value={filters.venue} onChange={handleFilterChange}>
          <option value="">Select Venue</option>
          {venues.map(v => (
            <option key={v.hall_id} value={v.name}>{v.name}</option>
          ))}
        </select>

        <select className="admin-input" style={{ marginBottom: '0' }} name="sortBy" value={filters.sortBy} onChange={handleFilterChange}>
          <option value="booking_date">By Date</option>
          <option value="venue">By Venue</option>
          <option value="status">By Status</option>
        </select>

        <select className="admin-input" style={{ marginBottom: '0' }} name="order" value={filters.order} onChange={handleFilterChange}>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>

      {loading ? (
        <p className="owner-message loading">Loading...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : bookings.length === 0 ? (
        <p className="owner-message">Bookings topilmadi</p>
      ) : (
        <div className="admin-card admin-table-container">
          <table className="admin-table">
            <thead>
            <tr>
              <th>Bron ID</th>
              <th>Venue Name</th>
              <th>Date</th>
              <th>Number of Guests</th>
              <th>Client Name</th>
              <th>Client Phone</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(b => (
              <tr key={b.booking_id}>
                <td>{b.booking_id}</td>
                <td>{b.venue_name}</td>
                <td>{new Date(b.booking_date).toLocaleDateString()}</td>
                <td>{b.number_of_guests}</td>
                <td>{b.client_name || b.user_name}</td>
                <td>{b.client_phone_number}</td>
                <td>
                  <span className={`status-badge status-${b.status}`}>
                    {b.status === 'upcoming' ? 'Pending' : b.status === 'completed' ? 'Completed' : 'Cancelled'}
                  </span>
                </td>
                <td>
                  {b.status !== 'cancelled' && (
                    <button className="admin-btn admin-btn-danger" onClick={() => handleCancelBooking(b.booking_id)}>Cancel</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      )}
    </div>
  );
}
