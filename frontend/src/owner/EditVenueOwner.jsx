// src/pages/owner/EditVenue.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './edit-venueOwner.css';

export default function EditVenue() {
  const { venueId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    capacity: '',
    price: '',
    description: ''
  });

  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchVenue = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/owner/venues', {
          headers: { Authorization: `Bearer ${token}` }
        });

        const venue = res.data.venues.find(v => v.hall_id.toString() === venueId);
        if (venue) {
          setFormData({
            name: venue.name || '',
            address: venue.address || '',
            capacity: venue.capacity || '',
            price: venue.price || '',
            description: venue.description || ''
          });
        }
      } catch (err) {
        setError("Ma'lumotlarni yuklashda xatolik yuz berdi");
      } finally {
        setLoading(false);
      }
    };

    fetchVenue();
  }, [venueId]);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = e => {
    setPhotos(e.target.files);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      const form = new FormData();
      Object.entries(formData).forEach(([key, value]) => form.append(key, value));
      for (let i = 0; i < photos.length; i++) {
        form.append('photos', photos[i]);
      }

      await axios.put(`http://localhost:5000/api/owner/venues/${venueId}`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      setSuccess("To'yxona muvaffaqiyatli yangilandi!");
      setTimeout(() => navigate('/owner-panel/venues'), 1500);
    } catch (err) {
      setError("Yangilashda xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-owner-container">
      <h2 className="edit-owner-title">To’yxonani Tahrirlash</h2>

      {loading && <p className="edit-owner-loading">Yuklanmoqda...</p>}
      {error && <p className="edit-owner-error">{error}</p>}
      {success && <p className="edit-owner-success">{success}</p>}

      <form onSubmit={handleSubmit} className="edit-owner-form" encType="multipart/form-data">
        <label className="edit-owner-label">Nomi:</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} required />

        <label className="edit-owner-label">Manzil:</label>
        <input type="text" name="address" value={formData.address} onChange={handleChange} required />

        <label className="edit-owner-label">Sig'imi:</label>
        <input type="number" name="capacity" value={formData.capacity} onChange={handleChange} required />

        <label className="edit-owner-label">Narxi:</label>
        <input type="number" name="price" value={formData.price} onChange={handleChange} required />

        <label className="edit-owner-label">Tavsifi:</label>
        <textarea name="description" value={formData.description} onChange={handleChange} />

        <label className="edit-owner-label">Yangi rasmlar (ixtiyoriy):</label>
        <input type="file" multiple accept="image/*" onChange={handleFileChange} />

        <button type="submit" className="edit-owner-button" disabled={loading}>Yangilash</button>
      </form>
    </div>
  );
}
