import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function OwnerVenueForm({ venueId, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    district_id: '',
    address: '',
    capacity: '',
    price_per_seat: '',
    phone_number: '',
    description: '',
  });
  const [districts, setDistricts] = useState([]);  // rayonlar ro'yxati
  const [images, setImages] = useState([]);         // rasm fayllari
  const [loading, setLoading] = useState(!!venueId);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Rayonlar ro'yxatini olish (select uchun)
  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/admin/districts'); // kerakli endpoint
        setDistricts(res.data.districts || []);
      } catch (err) {
        console.error('Rayonlarni olishda xatolik:', err);
      }
    };

    fetchDistricts();
  }, []);

  // Agar tahrirlash rejimida bo'lsa, ma'lumotlarni yuklab olish
  useEffect(() => {
    if (!venueId) return;

    const fetchVenue = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://localhost:5000/api/owner/venues/${venueId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFormData(res.data.venue);
      } catch (err) {
        setError('Ma’lumotlarni olishda xatolik yuz berdi');
      } finally {
        setLoading(false);
      }
    };

    fetchVenue();
  }, [venueId]);

  // Input o'zgarganda formData yangilash
  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  // Fayl tanlashda images ga saqlash
  const handleFileChange = e => {
    setImages(e.target.files);
    setError('');
    setSuccess('');
  };

  // Form yuborilishi
  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');

      const data = new FormData();

      // Form ma’lumotlarini FormData ga qo‘shamiz
      Object.keys(formData).forEach(key => {
        data.append(key, formData[key]);
      });

      // Rasm fayllarini ham FormData ga qo‘shamiz (multiple)
      for (let i = 0; i < images.length; i++) {
        data.append('photos', images[i]);  // backendda multer 'photos' maydonini qabul qilishi kerak
      }

      if (venueId) {
        // Tahrirlash (PUT)
        await axios.put(`http://localhost:5000/api/owner/venues/${venueId}`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          }
        });
        setSuccess('To’yxona ma’lumotlari yangilandi');
      } else {
        // Yangi qo‘shish (POST)
        await axios.post('http://localhost:5000/api/owner/venues', data, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          }
        });
        setSuccess('To’yxona muvaffaqiyatli qo‘shildi');

        // Formni tozalash
        setFormData({
          name: '',
          district_id: '',
          address: '',
          capacity: '',
          price_per_seat: '',
          phone_number: '',
          description: '',
        });
        setImages([]);
      }

      if (onSuccess) onSuccess();

    } catch (err) {
      setError('Amal bajarishda xatolik yuz berdi');
    }
  };

  if (loading) return <p>Yuklanmoqda...</p>;

  return (
    <div style={{ marginTop: '20px', maxWidth: '500px' }}>
      <h2>{venueId ? 'To’yxonani Tahrirlash' : 'Yangi To’yxona Qo‘shish'}</h2>
      {error && <p style={{color: 'red'}}>{error}</p>}
      {success && <p style={{color: 'green'}}>{success}</p>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <input
          name="name"
          placeholder="To’yxona nomi"
          value={formData.name}
          onChange={handleChange}
          required
        />

        {/* Rayonlarni select orqali tanlash */}
        <select
          name="district_id"
          value={formData.district_id}
          onChange={handleChange}
          required
        >
          <option value="">Rayonni tanlang</option>
          {districts.map(d => (
            <option key={d.district_id} value={d.district_id}>
              {d.name}
            </option>
          ))}
        </select>

        <input
          name="address"
          placeholder="Manzil"
          value={formData.address}
          onChange={handleChange}
          required
        />
        <input
          name="capacity"
          type="number"
          placeholder="Sig‘imi"
          value={formData.capacity}
          onChange={handleChange}
          min="1"
          required
        />
        <input
          name="price_per_seat"
          type="number"
          placeholder="O‘rindiq narxi"
          value={formData.price_per_seat}
          onChange={handleChange}
          min="0"
          required
        />
        <input
          name="phone_number"
          placeholder="Telefon raqam"
          value={formData.phone_number}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Qo‘shimcha ma’lumot"
          value={formData.description}
          onChange={handleChange}
          rows="4"
        />

        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
        />

        <button type="submit" style={{ marginTop: '10px' }}>
          {venueId ? 'Yangilash' : 'Qo‘shish'}
        </button>
      </form>
    </div>
  );
}
