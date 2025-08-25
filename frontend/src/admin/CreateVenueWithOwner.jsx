import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './admin style/createVenueWithOwner.css';
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

    axios.get('http://localhost:5000/api/admin/districts', {
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
      await axios.post('http://localhost:5000/api/admin/venues-with-owner', data, {
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
    <div className='create-cont'>
      <h2>To'yxona va To'yxona egasini qo'shish</h2>

      {error && <div className="error-message">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}

      <form className="admin-form" onSubmit={handleSubmit}>
        <h3>To'yxona Ma'lumotlari</h3>
        <div>
          <input type="text" name="name" placeholder="To'yxona Nomi" value={formData.name} onChange={handleChange} required />
          <select name="district_name" value={formData.district_name} onChange={handleChange} required>
            <option value="">Tumanni tanlang</option>
            {districts.map(d => (
              <option key={d.district_id} value={d.name}>{d.name}</option>
            ))}
          </select>
        </div>

        <div>
          <input type="text" name="address" placeholder="Manzil" value={formData.address} onChange={handleChange} required />
          <input type="number" name="capacity" placeholder="Joylar Soni" value={formData.capacity} onChange={handleChange} required />
        </div>

        <div>
          <input type="number" name="price_per_seat" placeholder="Bir O'rindiq Narxi" value={formData.price_per_seat} onChange={handleChange} required />
          <input type="text" name="phone_number" placeholder="Telefon raqam" value={formData.phone_number} onChange={handleChange} required />
        </div>

        <textarea name="description" placeholder="Tavsif" value={formData.description} onChange={handleChange} rows={4} />

        {/* 🌍 Map qo‘shilgan qism */}
        <h3>Lokatsiya</h3>
        <div className="map-container">
          <MapContainer center={[41.2995, 69.2401]} zoom={12} className="map">
            <TileLayer
              attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LocationMarker />
          </MapContainer>
          <div className="coords">
            <input
              type="text"
              name="latitude"
              value={formData.latitude}
              placeholder="Kenglik (lat)"
              readOnly
            />
            <input
              type="text"
              name="longitude"
              value={formData.longitude}
              placeholder="Uzunlik (lng)"
              readOnly
            />
          </div>
        </div>

        <label htmlFor="file-upload" className="custom-file-upload">
          <span className="upload-icon">📁</span> Rasmlar tanlang
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

        <h3>To'yxona Egasi Haqida Ma'lumot</h3>

        <div>
          <input type="text" name="owner_first_name" placeholder="Ism" value={formData.owner_first_name} onChange={handleChange} required />
          <input type="text" name="owner_last_name" placeholder="Familiya" value={formData.owner_last_name} onChange={handleChange} required />
        </div>

        <div>
          <input type="text" name="owner_username" placeholder="Username" value={formData.owner_username} onChange={handleChange} required />
          <input type="password" name="owner_password" placeholder="Password" value={formData.owner_password} onChange={handleChange} required />
        </div>

        <input type="text" name="owner_phone_number" placeholder="Telefon raqam" value={formData.owner_phone_number} onChange={handleChange} required />

        <button type="submit">Yuborish</button>
      </form>
    </div>
  );
}
