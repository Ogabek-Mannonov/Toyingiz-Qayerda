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

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);
  }, []);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!token) {
      // Token yo'q bo'lsa, login sahifasiga yo'naltirish
      navigate('/login');
      return;
    }

    setError('');
    setSuccess('');

    try {
      const response = await axios.post(
        'http://localhost:5000/api/user/bookings',
        { ...formData, hall_id: hallId },
        {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        }
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

  return (
    <div className='get-bron'>
      <h3>Bron qilish</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Sana:
          <input
            type="date"
            name="booking_date"
            value={formData.booking_date}
            onChange={handleChange}
            required
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
