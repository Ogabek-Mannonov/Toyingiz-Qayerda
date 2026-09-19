import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
// Global theme is already imported in AdminPanel.jsx

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
          axios.get('/api/admin/districts', {
            headers: getAuthHeaders()
          }),
          axios.get(`/api/admin/venues/${id}`, {
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
        setError('Error fetching venue details');
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

      await axios.put(`/api/admin/venues/${id}`, data, {
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'multipart/form-data'
        }
      });

      setSuccessMessage('Venue updated successfully');
      setTimeout(() => navigate('/admin-panel/venues'), 1500);
    } catch (err) {
      setError('Error updating venue');
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="admin-page-container">
      <h1 className="admin-page-title">Edit Venue</h1>
      {error && <p className="error-message">{error}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}

      <form className="admin-card" onSubmit={handleSubmit}>
        <input className="admin-input" type="text" name="name" placeholder="Venue Name" value={formData.name} onChange={handleChange} required />

        <select className="admin-input" name="district_id" value={formData.district_id} onChange={handleChange} required>
          <option value="">Select District</option>
          {districts.map(d => (
            <option key={d.district_id} value={d.district_id}>{d.name}</option>
          ))}
        </select>

        <input className="admin-input" type="text" name="address" placeholder="Address" value={formData.address} onChange={handleChange} required />
        <input className="admin-input" type="number" name="capacity" placeholder="Capacity" value={formData.capacity} onChange={handleChange} required />
        <input className="admin-input" type="number" name="price_per_seat" placeholder="Price (per seat)" value={formData.price_per_seat} onChange={handleChange} required />
        <input className="admin-input" type="text" name="phone_number" placeholder="Phone Number" value={formData.phone_number} onChange={handleChange} required />
        <textarea className="admin-input" name="description" placeholder="Description" value={formData.description} onChange={handleChange} rows={4} />

        <select className="admin-input" name="status" value={formData.status} onChange={handleChange} required>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
        </select>

        <label htmlFor="edit-file-upload" className="admin-btn admin-btn-primary" style={{ display: 'inline-block', marginBottom: '20px', cursor: 'pointer' }}>
          <span className="upload-icon">📁</span> Upload new image(s)
        </label>
        <input id="edit-file-upload" type="file" name="images" accept="image/*" multiple onChange={handleFileChange} style={{ display: 'none' }} />

        {existingImages.length > 0 && (
          <div className="image-preview-gallery" style={{ marginBottom: '20px' }}>
            <p style={{ marginBottom: '10px', color: 'var(--admin-text-main)', fontWeight: 'bold' }}>Current images:</p>
            <div className="image-grid" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {existingImages.map((img, idx) => (
                <div key={idx} className="image-item" style={{ position: 'relative' }}>
                  <img src={`/${img}`} alt={`Venue ${idx + 1}`} className="preview-image" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' }} />
                  <button type="button" aria-label="Delete image" onClick={() => handleImageDelete(img)} style={{ position: 'absolute', top: '-5px', right: '-5px', background: 'red', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer' }}>❌</button>
                </div>
              ))}
            </div>
          </div>
        )}

        <button className="admin-btn admin-btn-success" style={{ width: '100%', fontSize: '16px', padding: '12px' }} type="submit">Save Changes</button>
      </form>
    </div>
  );
}
