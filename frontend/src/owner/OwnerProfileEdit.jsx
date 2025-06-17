import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './owner-profile-edit.css';

export default function OwnerProfileEdit() {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    username: '',
    phone_number: '',
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/owner/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFormData(response.data);
      } catch (err) {
        setError('Profil ma’lumotlarini olishda xatolik yuz berdi');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:5000/api/owner/profile', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess('Profil muvaffaqiyatli yangilandi');
      localStorage.setItem('username', formData.username);
      window.dispatchEvent(new Event('usernameChanged'));
    } catch (err) {
      setError('Profilni yangilashda xatolik yuz berdi');
    }
  };

  if (loading) return <p className="loading-text">Yuklanmoqda...</p>;

  return (
    <div className="owner-profile-container">
      <div className="owner-profile-edit-container">
        <h2 className="form-title">Profilni tahrirlash</h2>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}

        <form onSubmit={handleSubmit} className="profile-form">
          <label className="form-label">
            Ism:
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              required
              className="form-input"
            />
          </label>

          <label className="form-label">
            Familiya:
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              required
              className="form-input"
            />
          </label>

          <label className="form-label">
            Username:
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="form-input"
            />
          </label>

          <label className="form-label">
            Telefon raqam:
            <input
              type="text"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              className="form-input"
            />
          </label>

          <button type="submit" className="save-button">Saqlash</button>
        </form>
      </div>
    </div>
  );
}
