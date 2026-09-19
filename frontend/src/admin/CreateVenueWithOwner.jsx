import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
// Global theme is already imported in AdminPanel.jsx
import './admin style/map.css'; // faqat map uchun qo‘shildi

export default function CreateVenueWithOwner() {
  const [formData, setFormData] = useState({
    name: '',
    district_name: '',
    address: '',
    capacity: '',
    price_per_seat: '',
    phone_number: '',
    description: '',
    owner_first_name: '',
    owner_last_name: '',
    owner_username: '',
    owner_password: '',
    owner_phone_number: '',
    latitude: '',   // yangi
    longitude: '',  // yangi
    images: []
  });

  const [fileNames, setFileNames] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Iltimos, tizimga kiring!');
      return;
    }

    axios.get('/api/admin/districts', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(res => setDistricts(res.data.districts))
    .catch(() => setError('Rayonlarni olishda xatolik yuz berdi'));
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
    setSuccessMessage('');
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData({
      ...formData,
      images: files
    });
    setFileNames(files.map(f => f.name));
    setError('');
    setSuccessMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Iltimos, tizimga kiring!');
      return;
    }

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === 'images') {
        formData.images.forEach((file) => {
          data.append('images', file);
        });
      } else {
        data.append(key, formData[key]);
      }
    });

    try {
      await axios.post('/api/admin/venues-with-owner', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        },
      });

      setSuccessMessage("To’yxona va egasi muvaffaqiyatli yaratildi!");
      setFormData({
        name: '',
        district_name: '',
        address: '',
        capacity: '',
        price_per_seat: '',
        phone_number: '',
        description: '',
        owner_first_name: '',
        owner_last_name: '',
        owner_username: '',
        owner_password: '',
        owner_phone_number: '',
        latitude: '',
        longitude: '',
        images: []
      });
      setFileNames([]);
    } catch (error) {
      setError(error.response?.data?.error || error.response?.data?.message || 'Server bilan bog‘lanishda xatolik yuz berdi');
      setSuccessMessage('');
    }
  };

  // Leaflet map ichida marker qo‘yish komponenti
  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        setFormData({
          ...formData,
          latitude: e.latlng.lat,
          longitude: e.latlng.lng,
        });
      },
    });

    return formData.latitude && formData.longitude ? (
      <Marker position={[formData.latitude, formData.longitude]} />
    ) : null;
  };

  return (
    <div className="admin-page-container">
      <h1 className="admin-page-title">Add Venue & Owner</h1>

      {error && <div className="error-message">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}

      <form className="admin-card" onSubmit={handleSubmit}>
        <h3 style={{ marginBottom: '20px', color: 'var(--admin-primary)' }}>Venue Details</h3>
        <div>
          <input className="admin-input" type="text" name="name" placeholder="Venue Name" value={formData.name} onChange={handleChange} required />
          <select className="admin-input" name="district_name" value={formData.district_name} onChange={handleChange} required>
            <option value="">Select District</option>
            {districts.map(d => (
              <option key={d.district_id} value={d.name}>{d.name}</option>
            ))}
          </select>
        </div>

        <div>
          <input className="admin-input" type="text" name="address" placeholder="Address" value={formData.address} onChange={handleChange} required />
          <input className="admin-input" type="number" name="capacity" placeholder="Capacity" value={formData.capacity} onChange={handleChange} required />
        </div>

        <div>
          <input className="admin-input" type="number" name="price_per_seat" placeholder="Price per Seat" value={formData.price_per_seat} onChange={handleChange} required />
          <input className="admin-input" type="text" name="phone_number" placeholder="Phone Number" value={formData.phone_number} onChange={handleChange} required />
        </div>

        <textarea className="admin-input" name="description" placeholder="Description" value={formData.description} onChange={handleChange} rows={4} />

        {/* 🌍 Map qo‘shilgan qism */}
        <h3 style={{ marginBottom: '20px', marginTop: '10px', color: 'var(--admin-primary)' }}>Location</h3>
        <div className="map-container" style={{ marginBottom: '20px' }}>
          <MapContainer center={[41.2995, 69.2401]} zoom={12} className="map">
            <TileLayer
              attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LocationMarker />
          </MapContainer>
          <div className="coords">
            <input
              className="admin-input"
              style={{ marginBottom: '0' }}
              type="text"
              name="latitude"
              value={formData.latitude}
              placeholder="Latitude"
              readOnly
            />
            <input
              className="admin-input"
              style={{ marginBottom: '0' }}
              type="text"
              name="longitude"
              value={formData.longitude}
              placeholder="Longitude"
              readOnly
            />
          </div>
        </div>

        <label htmlFor="file-upload" className="admin-btn admin-btn-primary" style={{ display: 'inline-block', marginBottom: '20px', cursor: 'pointer' }}>
          <span className="upload-icon">📁</span> Select Images
        </label>
        <input
          id="file-upload"
          type="file"
          name="images"
          accept="image/*"
          onChange={handleFileChange}
          multiple
          className="hidden-file"
        />
        {fileNames.length > 0 && (
          <ul className="file-name-list">
            {fileNames.map((name, idx) => (
              <li key={idx}>{name}</li>
            ))}
          </ul>
        )}

        <h3 style={{ marginBottom: '20px', marginTop: '10px', color: 'var(--admin-primary)' }}>Venue Owner Details</h3>

        <div>
          <input className="admin-input" type="text" name="owner_first_name" placeholder="First Name" value={formData.owner_first_name} onChange={handleChange} required />
          <input className="admin-input" type="text" name="owner_last_name" placeholder="Last Name" value={formData.owner_last_name} onChange={handleChange} required />
        </div>

        <div>
          <input className="admin-input" type="text" name="owner_username" placeholder="Username" value={formData.owner_username} onChange={handleChange} required />
          <input className="admin-input" type="password" name="owner_password" placeholder="Password" value={formData.owner_password} onChange={handleChange} required />
        </div>

        <input className="admin-input" type="text" name="owner_phone_number" placeholder="Phone Number" value={formData.owner_phone_number} onChange={handleChange} required />

        <button className="admin-btn admin-btn-success" style={{ width: '100%', fontSize: '16px', padding: '12px' }} type="submit">Submit</button>
      </form>
    </div>
  );
}
