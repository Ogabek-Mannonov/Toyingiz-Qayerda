import React, { useEffect, useState } from 'react';
import axios from 'axios';
import OwnerAddVenue from './OwnerAddVenue';

export default function OwnerVenueList() {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // To'yxonalarni olish funksiyasi
  const fetchVenues = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/owner/venues', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setVenues(res.data.venues);
    } catch (err) {
      setError('To’yxonalarni olishda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  // Komponent yuklanganda to'yxonalarni yuklash
  useEffect(() => {
    fetchVenues();
  }, []);

  return (
    <div style={{ marginTop: '20px' }}>
      <h2>Sizning To'yxonalar</h2>

      {/* Yangi to'yxona qo'shish formasi */}
      <OwnerAddVenue onVenueAdded={fetchVenues} />

      {loading && <p>Yuklanmoqda...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && venues.length === 0 && <p>To'yxona topilmadi</p>}

      <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
        {venues.map(v => (
          <li key={v.hall_id} style={{ marginBottom: '15px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
            <strong style={{ fontSize: '1.2rem' }}>{v.name}</strong><br />
            <span>Manzil: {v.address}</span><br />
            <span>Status: <em>{v.status}</em></span>
          </li>
        ))}
      </ul>
    </div>
  );
}
