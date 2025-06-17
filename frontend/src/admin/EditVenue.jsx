import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './admin style/edit-venue.css';

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
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      Authorization: token ? `Bearer ${token}` : ''
    };
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [districtRes, venueRes] = await Promise.all([
          axios.get('http://localhost:5000/api/admin/districts', {
            headers: getAuthHeaders()
          }),
          axios.get(`http://localhost:5000/api/admin/venues/${id}`, {
            headers: getAuthHeaders()
          })
        ]);

        setDistricts(districtRes.data.districts);

        const venue = venueRes.data.venue;
        setFormData({
          name: venue.name || '',
          district_id: venue.district_id || '',
          address: venue.address || '',
          capacity: venue.capacity || '',
          price_per_seat: venue.price_per_seat || '',
          phone_number: venue.phone_number || '',
          description: venue.description || '',
          owner_id: venue.owner_id || '',
          status: venue.status || ''
        });
        setExistingImages(venue.images || []);
      } catch (err) {
        setError('To’yxona ma’lumotlarini olishda xatolik yuz berdi');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
    setSuccessMessage('');
  };

  const handleFileChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  const handleImageDelete = (imgUrl) => {
    setExistingImages(prev => prev.filter(img => img !== imgUrl));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });

      existingImages.forEach(img => {
        data.append('existingImages[]', img);
      });

      images.forEach(img => {
        data.append('images', img);
      });

      await axios.put(`http://localhost:5000/api/admin/venues/${id}`, data, {
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'multipart/form-data'
        }
      });

      setSuccessMessage('To’yxona muvaffaqiyatli yangilandi');
      setTimeout(() => navigate('/admin-panel/venues'), 1500);
    } catch (err) {
      setError('Yangilashda xatolik yuz berdi');
    }
  };

  if (loading) return <p>Yuklanmoqda...</p>;

  return (
    <div className="edit-venue-container">
      <h2>To’yxonani tahrirlash</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}

      <form onSubmit={handleSubmit}>
        <input className="form-input" type="text" name="name" placeholder="To’yxona nomi" value={formData.name} onChange={handleChange} required />

        <select className="form-input" name="district_id" value={formData.district_id} onChange={handleChange} required>
          <option value="">Tumanni tanlang</option>
          {districts.map(d => (
            <option key={d.district_id} value={d.district_id}>{d.name}</option>
          ))}
        </select>

        <input className="form-input" type="text" name="address" placeholder="Manzil" value={formData.address} onChange={handleChange} required />
        <input className="form-input" type="number" name="capacity" placeholder="Sig‘im" value={formData.capacity} onChange={handleChange} required />
        <input className="form-input" type="number" name="price_per_seat" placeholder="Narx (1 o‘rindiq)" value={formData.price_per_seat} onChange={handleChange} required />
        <input className="form-input" type="text" name="phone_number" placeholder="Telefon raqam" value={formData.phone_number} onChange={handleChange} required />
        <textarea className="form-input" name="description" placeholder="Tavsif" value={formData.description} onChange={handleChange} />

        <select className="form-input" name="status" value={formData.status} onChange={handleChange} required>
          <option value="pending">Tasdiqlanmagan</option>
          <option value="approved">Tasdiqlangan</option>
        </select>

        <label>
          📁 Yangi rasm(lar) yuklash:
          <input type="file" name="images" accept="image/*" multiple onChange={handleFileChange} />
        </label>

        {existingImages.length > 0 && (
          <div className="image-preview-gallery">
            <p>Joriy rasmlar:</p>
            <div className="image-grid">
              {existingImages.map((img, idx) => (
                <div key={idx} className="image-item">
                  <img src={`http://localhost:5000/${img}`} alt={`Venue ${idx + 1}`} className="preview-image" />
                  <button type="button" aria-label="Rasmni o‘chirish" onClick={() => handleImageDelete(img)}>❌</button>
                </div>
              ))}
            </div>
          </div>
        )}

        <button className="form-button" type="submit">Saqlash</button>
      </form>
    </div>
  );
}
