import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './user.css'

export default function UserBookingForm({ hallId }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    booking_date: '',
    number_of_guests: '',
    client_name: '',
    client_phone_number: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Bron qilish uchun tizimga kirishingiz kerak');
      // Masalan, avtomatik login sahifasiga yo‘naltirish:
      setTimeout(() => navigate('/login'), 2000);
      return;
    }

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
      setError(
        err.response?.data?.message || 'Bron qilishda xatolik yuz berdi'
      );
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
