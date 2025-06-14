import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './bookingList.css';

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
    axios.get('http://localhost:5000/api/admin/venues', {
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

    axios.get('http://localhost:5000/api/admin/bookings', {
      params,
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        setBookings(res.data.bookings);
        setLoading(false);
      })
      .catch(() => {
        setError('Bronlarni olishda xatolik yuz berdi');
        setLoading(false);
      });
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleCancelBooking = (id) => {
    if (window.confirm('Bronni bekor qilmoqchimisiz?')) {
      const token = localStorage.getItem('token');

      axios.patch(`http://localhost:5000/api/admin/bookings/${id}/cancel`, null, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(() => {
          fetchBookings();
          alert('Bron muvaffaqiyatli bekor qilindi');
        })
        .catch(() => alert('Bronni bekor qilishda xatolik yuz berdi'));
    }
  };

  return (
    <div className="booking-list-container">
      <h2>Bronlar Ro’yxati</h2>

      <div className="booking-filters">
        <select name="status" value={filters.status} onChange={handleFilterChange}>
          <option value="">Barchasi</option>
          <option value="upcoming">Yaqinlashayotgan</option>
          <option value="cancelled">Bekor qilingan</option>
          <option value="completed">O‘tilgan</option>
        </select>

        <select name="venue" value={filters.venue} onChange={handleFilterChange}>
          <option value="">To’yxona tanlash</option>
          {venues.map(v => (
            <option key={v.hall_id} value={v.name}>{v.name}</option>
          ))}
        </select>

        <select name="sortBy" value={filters.sortBy} onChange={handleFilterChange}>
          <option value="booking_date">Sana bo‘yicha</option>
          <option value="venue">To’yxona bo‘yicha</option>
          <option value="status">Status bo‘yicha</option>
        </select>

        <select name="order" value={filters.order} onChange={handleFilterChange}>
          <option value="asc">O‘sish</option>
          <option value="desc">Kamayish</option>
        </select>
      </div>

      {loading ? (
        <p className="booking-message loading">Yuklanmoqda...</p>
      ) : error ? (
        <p className="booking-message error">{error}</p>
      ) : bookings.length === 0 ? (
        <p className="booking-message">Bronlar topilmadi</p>
      ) : (
        <table className="booking-table">
          <thead>
            <tr>
              <th>Bron ID</th>
              <th>To’yxona nomi</th>
              <th>Sana</th>
              <th>Odamlar soni</th>
              <th>Mijoz ismi</th>
              <th>Mijoz raqami</th>
              <th>Status</th>
              <th>Amallar</th>
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
                <td>{b.status}</td>
                <td>
                  {b.status !== 'cancelled' && (
                    <button onClick={() => handleCancelBooking(b.booking_id)}>Bekor qilish</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
