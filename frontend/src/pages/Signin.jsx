import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import '../style/login.css';

export default function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone_number: '',
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
      await axios.post('http://localhost:5000/api/auth/signup', formData);

      localStorage.setItem('username', formData.username);

      // ✅ Navigate bilan success xabar yuborish
      navigate('/login', {
        state: { successMessage: "Ro'yxatdan o'tish muvaffaqiyatli bo'ldi!" }
      });
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError("Server bilan bog'lanishda xatolik yuz berdi");
      }
    }
  };

  return (
    <div className="login-container">
      <div className="form-container">
        <h2>Ro'yxatdan o'tish</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input name="first_name" placeholder="Ism" value={formData.first_name} onChange={handleChange} required />
          <input name="last_name" placeholder="Familiya" value={formData.last_name} onChange={handleChange} required />
          <input name="phone_number" placeholder="Telefon raqam" value={formData.phone_number} onChange={handleChange} required />
          <input name="username" placeholder="Username" value={formData.username} onChange={handleChange} required />
          <input type="password" name="password" placeholder="Parol" value={formData.password} onChange={handleChange} required className='password' />
          <button type="submit">Ro'yxatdan o'tish</button>
        </form>
        <p className="switch-auth">
          Hisobingiz bormi? <Link to="/login">Kirish</Link>
        </p>
      </div>
    </div>
  );
}
