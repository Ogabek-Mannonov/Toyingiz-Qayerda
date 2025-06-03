import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

export default function EditVenue() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    district_id: '',
    address: '',
    capacity: '',
    price_per_seat: '',
    phone_number: '',
    description: '',
    owner_id: '',
    status: ''
  });

  const [districts, setDistricts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Token va header yaratish
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      Authorization: token ? `Bearer ${token}` : ''
    };
  };

  useEffect(() => {
    // Rayonlarni olish
    axios.get('http://localhost:5000/api/admin/districts', {
      headers: getAuthHeaders()
    })
      .then(res => setDistricts(res.data.districts))
      .catch(() => setDistricts([]));

    // To'yxona ma'lumotlarini olish
    axios.get(`http://localhost:5000/api/admin/venues/${id}`, {
      headers: getAuthHeaders()
    })
      .then(res => {
        setFormData({
          name: res.data.venue.name || '',
          district_id: res.data.venue.district_id || '',
          address: res.data.venue.address || '',
          capacity: res.data.venue.capacity || '',
          price_per_seat: res.data.venue.price_per_seat || '',
          phone_number: res.data.venue.phone_number || '',
          description: res.data.venue.description || '',
          owner_id: res.data.venue.owner_id || '',
          status: res.data.venue.status || ''
        });
        setLoading(false);
      })
      .catch(() => {
        setError('To’yxona ma’lumotlarini olishda xatolik yuz berdi');
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
    setSuccessMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    try {
      await axios.put(`http://localhost:5000/api/admin/venues/${id}`, formData, {
        headers: getAuthHeaders()
      });
      setSuccessMessage('To’yxona muvaffaqiyatli yangilandi');
      setTimeout(() => navigate('/admin-panel/venues'), 1500);
    } catch {
      setError('Yangilashda xatolik yuz berdi');
    }
  };

  if (loading) return <p>Yuklanmoqda...</p>;

  return (
    <div>
      <h2>To’yxonani tahrirlash</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="To’yxona nomi"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <select
          name="district_id"
          value={formData.district_id}
          onChange={handleChange}
          required
        >
          <option value="">Tumanni tanlang</option>
          {districts.map(d => (
            <option key={d.district_id} value={d.district_id}>{d.name}</option>
          ))}
        </select>

        <input
          type="text"
          name="address"
          placeholder="Manzil"
          value={formData.address}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="capacity"
          placeholder="Sig‘im"
          value={formData.capacity}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="price_per_seat"
          placeholder="Narx (1 o‘rindiq)"
          value={formData.price_per_seat}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="phone_number"
          placeholder="Telefon raqam"
          value={formData.phone_number}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Tavsif"
          value={formData.description}
          onChange={handleChange}
        />

        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          required
        >
          <option value="pending">Tasdiqlanmagan</option>
          <option value="approved">Tasdiqlangan</option>
        </select>

        {/* Owner id ni yashirin input sifatida yuborish */}
        <input
          type="hidden"
          name="owner_id"
          value={formData.owner_id}
        />

        <button type="submit">Saqlash</button>
      </form>
    </div>
  );
}
