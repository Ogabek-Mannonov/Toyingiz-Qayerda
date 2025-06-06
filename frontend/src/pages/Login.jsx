import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import '../index.css'


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

      localStorage.setItem('token', token);
      localStorage.setItem('userRole', user.role);
      localStorage.setItem('username', user.username);

      if (user.role === 'owner') {
        navigate('/owner-panel');
      } else if (user.role === 'admin') {
        navigate('/admin-panel');
      } else {
        navigate('/');
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError("Server bilan bog'lanishda xatolik yuz berdi");
      }
    }
  };

  const goToHome = () => {
    navigate('/');
  };

  return (
    <div className="form-container">
      <h2>Kirish</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
          autoComplete="username"
        />
        <input
          type="password"
          name="password"
          placeholder="Parol"
          value={formData.password}
          onChange={handleChange}
          required
          autoComplete="current-password"
        />
        <button type="submit">Kirish</button>
      </form>

      <button onClick={goToHome} className="home-btn">
        Asosiy sahifaga o'tish
      </button>

      <p className="switch-auth">
        Hisobingiz yo'qmi? <Link to="/signup">Ro'yxatdan o'tish</Link>
      </p>
    </div>
  );
}
