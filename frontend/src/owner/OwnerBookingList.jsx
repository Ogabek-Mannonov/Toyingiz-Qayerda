import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ownerVenueList.css'; // Reuse table styles

export default function OwnerBookingList() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchBookings = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/owner/bookings', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookings(res.data.bookings);
    } catch (err) {
      setError('Error fetching bookings');
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.patch(`/api/owner/bookings/${bookingId}/cancel`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchBookings();
    } catch (err) {
      alert('Error cancelling booking');
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <div className="venue-list-container">
      <div className="list-header">
        <h2 className="venue-title">My Bookings</h2>
      </div>

      {loading && <p className="loading-text">Loading...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && bookings.length === 0 && <p className="empty-text">No bookings found.</p>}

      {!loading && bookings.length > 0 && (
        <div className="table-wrapper">
          <table className="venue-table">
            <thead>
              <tr>
                <th>Venue Name</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(b => (
                <tr key={b.booking_id}>
                  <td>{b.venue_name}</td>
                  <td>{new Date(b.booking_date).toLocaleDateString()}</td>
                  <td>
                    <span className={`status-badge ${b.status}`}>
                      {b.status}
                    </span>
                  </td>
                  <td>
                    {b.status !== 'cancelled' && (
                      <button
                        onClick={() => cancelBooking(b.booking_id)}
                        className="delete-btn"
                      >
                        Cancel
                      </button>
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
