import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    first_name: '',
    last_name: '',
    phone_number: '',
  });
  const [error, setError] = useState('');

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');

    try {
      // Bu yerda to'g'ri endpoint - signup
      const response = await axios.post('http://localhost:5000/api/auth/signup', formData);
      navigate('/login');
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError("Server bilan bog'lanishda xatolik yuz berdi");
      }
    }
  };

  return (
    <div>
      <h2>Ro'yxatdan o'tish</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          name="first_name"
          placeholder="Ism"
          value={formData.first_name}
          onChange={handleChange}
          required
        />
        <input
          name="last_name"
          placeholder="Familiya"
          value={formData.last_name}
          onChange={handleChange}
          required
        />
        <input
          name="phone_number"
          placeholder="Telefon raqam"
          value={formData.phone_number}
          onChange={handleChange}
          required
        />
        <input
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Parol"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Ro'yxatdan o'tish</button>
      </form>
    </div>
  );
}
