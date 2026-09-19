import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ownerVenueForm.css'

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
        const res = await axios.get('/api/admin/districts'); // kerakli endpoint
        setDistricts(res.data.districts || []);
      } catch (err) {
        console.error('Error fetching districts:', err);
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
        const res = await axios.get(`/api/owner/venues/${venueId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFormData(res.data.venue);
      } catch (err) {
        setError('Error fetching data');
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
        data.append('images', images[i]);  // backendda multer 'photos' maydonini qabul qilishi kerak
      }

      if (venueId) {
        // Tahrirlash (PUT)
        await axios.put(`/api/owner/venues/${venueId}`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          }
        });
        setSuccess('Venue updated successfully');
      } else {
        // Yangi qo‘shish (POST)
        await axios.post('/api/owner/venues', data, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          }
        });
        setSuccess('Venue added successfully');

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
      setError('An error occurred');
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="owner-venue-form-container">
      <h2>{venueId ? 'Edit Venue' : 'Add New Venue'}</h2>
      {error && <p className="error-text">{error}</p>}
      {success && <p className="success-text">{success}</p>}

      <form onSubmit={handleSubmit} className="owner-venue-form">
        <input
          name="name"
          placeholder="Venue Name"
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
          <option value="">Select District</option>
          {districts.map(d => (
            <option key={d.district_id} value={d.district_id}>
              {d.name}
            </option>
          ))}
        </select>

        <input
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
          required
        />
        <input
          name="capacity"
          type="number"
          placeholder="Capacity"
          value={formData.capacity}
          onChange={handleChange}
          min="1"
          required
        />
        <input
          name="price_per_seat"
          type="number"
          placeholder="Price per Seat"
          value={formData.price_per_seat}
          onChange={handleChange}
          min="0"
          required
        />
        <input
          name="phone_number"
          placeholder="Phone Number"
          value={formData.phone_number}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Additional Description"
          value={formData.description}
          onChange={handleChange}
          rows="4"
        />

        <label htmlFor="file-upload" className="image-upload-wrapper">
          <span className="image-upload-label">📁 Choose image(s) or click here</span>
          <input
            id="file-upload"
            type="file"
            name='images'
            multiple
            accept="image/*"
            onChange={handleFileChange}
          />
          {images.length > 0 && (
            <div className="image-preview-count">{images.length} images selected</div>
          )}
        </label>


        <button type="submit">
          {venueId ? 'Update Venue' : 'Add Venue'}
        </button>
      </form>
    </div>
  );

}
