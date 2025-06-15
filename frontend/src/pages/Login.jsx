import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import '../style/login.css';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (location.state && location.state.successMessage) {
      setSuccessMessage(location.state.successMessage);

      // URLdagi state ni tozalash (refreshda yana ko‘rinmasligi uchun)
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

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
    <div className="login-container">
      <div className="form-container">
        <h2>Kirish</h2>

        {successMessage && <p className="success-message">{successMessage}</p>}
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
    </div>
  );
}
