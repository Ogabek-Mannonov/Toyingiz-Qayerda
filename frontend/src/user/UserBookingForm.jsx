import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import '../index.css';

export default function UserBookingForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const hallId = id;

  const [formData, setFormData] = useState({
    booking_date: '',
    number_of_guests: '',
    client_name: '',
    client_phone_number: '',
  });

  const [bookedDates, setBookedDates] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);

    const fetchBookedDates = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/user/venues/${hallId}/booked-dates`,
          {
            headers: { Authorization: `Bearer ${storedToken}` },
          }
        );
        const dates = res.data.bookings.map(b => b.booking_date.split('T')[0]);
        setBookedDates(dates);
      } catch (err) {
        console.error(err);
        setError('Band qilingan sanalarni olishda xatolik yuz berdi');
      }
    };

    if (storedToken) {
      fetchBookedDates();
    } else {
      setError('Token topilmadi. Iltimos, qayta login qiling.');
    }
  }, [hallId]);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!token) {
      navigate('/login');
      return;
    }

    if (bookedDates.includes(formData.booking_date)) {
      setError('Tanlangan sana allaqachon band qilingan.');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:5000/api/user/bookings',
        { ...formData, hall_id: hallId },
        { headers: { Authorization: 'Bearer ' + token } }
      );

      setSuccess('Bron muvaffaqiyatli yaratildi!');
      setFormData({
        booking_date: '',
        number_of_guests: '',
        client_name: '',
        client_phone_number: '',
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Bron qilishda xatolik yuz berdi');
    }
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const days = [];
  for (let i = 0; i <= 30; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    d.setHours(0, 0, 0, 0);
    days.push(d);
  }

  const getStatusForDate = (date) => {
    const dateStr = date.toISOString().slice(0, 10);
    if (date < today) return 'past';
    if (bookedDates.includes(dateStr)) return 'booked';
    return 'available';
  };

  return (
    <div className='get-bron'>
      <h3>Bron qilish</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}

      <div>
        <p><strong>Band qilingan sanalar:</strong></p>
        <div style={{ display: 'flex', flexWrap: 'wrap', maxWidth: 500 }}>
          {days.map(day => {
            const status = getStatusForDate(day);
            const bgColor =
              status === 'past' ? '#ccc' :
              status === 'booked' ? '#ff6961' :
              '#77dd77';
            return (
              <div
                key={day.toISOString()}
                title={day.toISOString().slice(0, 10)}
                style={{
                  width: 40,
                  height: 40,
                  margin: 3,
                  textAlign: 'center',
                  lineHeight: '40px',
                  backgroundColor: bgColor,
                  borderRadius: 5,
                  cursor: 'default',
                  userSelect: 'none',
                }}
              >
                {day.getDate()}
              </div>
            );
          })}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <label>
          Sana:
          <input
            type="date"
            name="booking_date"
            value={formData.booking_date}
            onChange={handleChange}
            required
            min={new Date().toISOString().split('T')[0]} // o'tgan kunlarga yo‘l qo‘ymaslik
          />
        </label>
        <br />
        <label>
          Odamlar soni:
          <input
            type="number"
            name="number_of_guests"
            value={formData.number_of_guests}
            onChange={handleChange}
            required
            min="1"
          />
        </label>
        <br />
        <label>
          Ism:
          <input
            type="text"
            name="client_name"
            value={formData.client_name}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          Telefon raqam:
          <input
            type="text"
            name="client_phone_number"
            value={formData.client_phone_number}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <button type="submit">Bron qilish</button>
      </form>
    </div>
  );
}
