import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../index.css'


export default function ProfileEdit() {
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
        const response = await axios.get('http://localhost:5000/api/user/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Backenddan user ma'lumotlari shunday keladi deb taxmin qilamiz:
        // { first_name, last_name, username, phone_number }
        setFormData(response.data);
      } catch (err) {
        setError('Profil ma’lumotlarini olishda xatolik yuz berdi');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = e => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
    setSuccess('');
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');

      await axios.put('http://localhost:5000/api/user/profile', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSuccess('Profil muvaffaqiyatli yangilandi');

      // localStorage dagi username ni yangilash
      localStorage.setItem('username', formData.username);

      // Custom event chaqirish (Header yangilanishi uchun)
      window.dispatchEvent(new Event('usernameChanged'));

    } catch (err) {
      setError('Profilni yangilashda xatolik yuz berdi');
    }
  };

  if (loading) return <p>Yuklanmoqda...</p>;

  return (
    <div>
      <h2>Profilni tahrirlash</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}

      <form onSubmit={handleSubmit}>
        <label>
          Ism:
          <input
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            required
          />
        </label>
        <br />

        <label>
          Familiya:
          <input
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            required
          />
        </label>
        <br />

        <label>
          Username:
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </label>
        <br />

        <label>
          Telefon raqam:
          <input
            type="text"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
          />
        </label>
        <br />

        <button type="submit">Saqlash</button>
      </form>
    </div>
  );
}
