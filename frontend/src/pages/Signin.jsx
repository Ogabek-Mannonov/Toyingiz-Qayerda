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
      await axios.post('/api/auth/signup', formData);

      localStorage.setItem('username', formData.username);

      // ✅ Navigate bilan success xabar yuborish
      navigate('/login', {
        state: { successMessage: "Registration successful!" }
      });
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError("Server connection error");
      }
    }
  };

  return (
    <div className="login-container">
      <div className="form-container">
        <h2>Sign Up</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input name="first_name" placeholder="First Name" value={formData.first_name} onChange={handleChange} required />
          <input name="last_name" placeholder="Last Name" value={formData.last_name} onChange={handleChange} required />
          <input name="phone_number" placeholder="Phone Number" value={formData.phone_number} onChange={handleChange} required />
          <input name="username" placeholder="Username" value={formData.username} onChange={handleChange} required />
          <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required className='password' />
          <button type="submit">Sign Up</button>
        </form>
        <p className="switch-auth">
          Already have an account? <Link to="/login">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
