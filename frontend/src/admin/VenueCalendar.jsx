import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function VenueCalendar({ venueId }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDateInfo, setSelectedDateInfo] = useState(null);

  useEffect(() => {
    if (!venueId) return;

    const fetchBookings = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://localhost:5000/api/admin/venues/${venueId}/bookings-calendar`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const formattedBookings = res.data.bookings.map(b => ({
          ...b,
          booking_date: b.booking_date.split('T')[0],
        }));

        setBookings(formattedBookings);
      } catch (e) {
        setError('Bronlar kalendarini olishda xatolik yuz berdi');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [venueId]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const days = [];
  for (let i = -15; i <= 30; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    d.setHours(0, 0, 0, 0);
    days.push(d);
  }

  const getStatusForDate = (date) => {
    const dateStr = date.toISOString().slice(0, 10);
    const booking = bookings.find(b => b.booking_date === dateStr);
    if (date < today) return 'past';
    if (booking) return booking.status === 'cancelled' ? 'cancelled' : 'booked';
    return 'available';
  };

  const handleDayClick = (date) => {
    const dateStr = date.toISOString().slice(0, 10);
    const booking = bookings.find(b => b.booking_date === dateStr);
    if (booking) {
      setSelectedDateInfo({
        date: dateStr,
        clientName: booking.client_name,
        phone: booking.client_phone_number,
        guests: booking.number_of_guests,
        status: booking.status,
      });
    } else {
      setSelectedDateInfo(null);
    }
  };

  if (loading) return <p>Yuklanmoqda...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h3>To'yxona bron kalendari</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', maxWidth: 600 }}>
        {days.map(day => {
          const status = getStatusForDate(day);
          const dateStr = day.toISOString().slice(0, 10);
          const booking = bookings.find(b => b.booking_date === dateStr);

          const bgColor =
            status === 'past' ? '#d3d3d3' :
              status === 'booked' ? '#ff6961' :
                status === 'cancelled' ? '#fddde6' :
                  '#77dd77';

          // Title text
          const title = booking
            ? `Mijoz: ${booking.client_name || 'Noma’lum'}\nTelefon: ${booking.client_phone_number || 'Noma’lum'}\nStatus: ${booking.status}`
            : day.toLocaleDateString();

          return (
            <div
              key={day.toISOString()}
              onClick={() => handleDayClick(day)}
              style={{
                width: 40,
                height: 40,
                margin: 3,
                textAlign: 'center',
                lineHeight: '40px',
                backgroundColor: bgColor,
                cursor: status === 'booked' ? 'pointer' : 'default',
                borderRadius: 5,
                userSelect: 'none',
              }}
              title={title}
            >
              {day.getDate()}
            </div>
          );
        })}

      </div>

      {selectedDateInfo && (
        <div style={{ marginTop: 20, padding: 10, border: '1px solid #ccc' }}>
          <h4>Bron Tafsilotlari ({selectedDateInfo.date})</h4>
          <p><strong>Mijoz ismi:</strong> {selectedDateInfo.clientName || 'Noma’lum'}</p>
          <p><strong>Telefon:</strong> {selectedDateInfo.phone || 'Noma’lum'}</p>
          <p><strong>O‘rindiqlar soni:</strong> {selectedDateInfo.guests}</p>
          <p><strong>Status:</strong> {selectedDateInfo.status}</p>
        </div>
      )}
    </div>
  );
}
