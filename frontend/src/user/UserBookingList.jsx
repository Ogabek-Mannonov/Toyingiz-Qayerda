import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './user-booking.css';

function UserBookingList() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError("Avval tizimga kiring.");
        setLoading(false);
        return;
      }

      const res = await axios.get('http://localhost:5000/api/user/bookings', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data && Array.isArray(res.data.bookings)) {
        setBookings(res.data.bookings);
      } else {
        setBookings([]);
      }
    } catch (error) {
      setError('Bronlarni yuklashda xatolik yuz berdi.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId) => {
    const confirmCancel = window.confirm('Ushbu bronni bekor qilmoqchimisiz?');
    if (!confirmCancel) return;

    try {
      const token = localStorage.getItem('token');

      await axios.patch(`/api/user/bookings/${bookingId}/cancel`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert('Bron bekor qilindi');
      fetchBookings();
    } catch (error) {
      alert('Bronni bekor qilishda xatolik yuz berdi.');
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  if (loading) return <p className="loading">Yuklanmoqda...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className='user-booking'>
      <h2 className='title'>Mening bronlarim</h2>
      {bookings.length === 0 ? (
        <p className='empty'>Hozircha bronlar yo‘q.</p>
      ) : (
        <div className="booking-list">
          {bookings.map((booking) => (
            <div className="booking-card" key={booking.booking_id}>
              <h3>{booking.venue_name}</h3>
              <p>Sana: {new Date(booking.booking_date).toLocaleDateString()}</p>
              <p>Mehmonlar soni: {booking.number_of_guests}</p>
              <p>Status: <strong className={`status ${booking.status}`}>{booking.status}</strong></p>
              {booking.status !== 'cancelled' && (
                <button className="cancel-btn" onClick={() => handleCancel(booking.booking_id)}>
                  Bekor qilish
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default UserBookingList;
