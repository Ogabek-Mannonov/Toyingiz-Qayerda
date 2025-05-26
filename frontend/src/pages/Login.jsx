import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const [error, setError] = useState('');

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', formData);

      const { token, user } = response.data;

      // Token va rolni localStorage ga saqlash
      localStorage.setItem('token', token);
      localStorage.setItem('userRole', user.role);

      // Rolga qarab yo'naltirish
      if (user.role === 'owner') {
        navigate('/owner-panel');
      } else if (user.role === 'admin') {
        navigate('/admin-panel');
      } else {
        navigate('/user-panel');
      }
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
      <h2>Kirish</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
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
        <button type="submit">Kirish</button>
      </form>
    </div>
  );
}
