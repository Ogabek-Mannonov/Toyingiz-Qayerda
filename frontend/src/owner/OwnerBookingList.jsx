import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function OwnerBookingList() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchBookings = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/owner/bookings', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookings(res.data.bookings);
    } catch (err) {
      setError('Bronlarni olishda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (bookingId) => {
    if (!window.confirm('Bronni bekor qilmoqchimisiz?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.patch(`http://localhost:5000/api/owner/bookings/${bookingId}/cancel`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchBookings();
    } catch (err) {
      alert('Bronni bekor qilishda xatolik yuz berdi');
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <div style={{ marginTop: '40px' }}>
      <h2>Sizning Bronlaringiz</h2>
      {loading && <p>Yuklanmoqda...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && bookings.length === 0 && <p>Bron topilmadi</p>}

      <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
        {bookings.map(b => (
          <li key={b.booking_id} style={{ marginBottom: '15px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
            <strong>{b.venue_name}</strong><br />
            Sana: {new Date(b.booking_date).toLocaleDateString()}<br />
            Holat: <em>{b.status}</em>
            {b.status !== 'cancelled' && (
              <button
                onClick={() => cancelBooking(b.booking_id)}
                style={{ marginLeft: '15px', padding: '5px 10px', cursor: 'pointer' }}
              >
                Bekor qilish
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
