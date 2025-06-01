import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import "../index.css";

export default function UserVenueList() {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filterDistrict, setFilterDistrict] = useState('');
  const [districts, setDistricts] = useState([]);

  useEffect(() => {
    fetchDistricts();
  }, []);

  useEffect(() => {
    fetchVenues();
  }, [search, filterDistrict]);

  const fetchDistricts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/districts');
      setDistricts(res.data.districts);
    } catch (err) {
      console.error('Rayonlarni olishda xatolik', err);
      setDistricts([]);
    }
  };

  const fetchVenues = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (search) params.search = search;
      if (filterDistrict) params.district = filterDistrict;

      const res = await axios.get('http://localhost:5000/api/user/venues', { params });
      setVenues(res.data.venues);
    } catch (err) {
      setError('To’yxonalarni olishda xatolik yuz berdi');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='toyxonalar-get'>
      <h2>Tasdiqlangan To’yxonalar</h2>

      <div style={{ marginBottom: '15px' }}>
        <input 
          type="text" 
          placeholder="Qidiruv..." 
          value={search} 
          onChange={e => setSearch(e.target.value)} 
        />

        <select value={filterDistrict} onChange={e => setFilterDistrict(e.target.value)}>
          <option value="">Barcha rayonlar</option>
          {districts.map(d => (
            <option key={d.district_id} value={d.name}>{d.name}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <p>Yuklanmoqda...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : venues.length === 0 ? (
        <p>To’yxona topilmadi</p>
      ) : (
        <div className="venue-cards">
          {venues.map((v) => (
            <Link key={v.hall_id} to={`/user/venues/${v.hall_id}`} className="venue-card">
              <img 
                src={v.photos.length > 0 ? `http://localhost:5000${v.photos[0]}` : 'https://via.placeholder.com/300x200?text=No+Image'} 
                alt={v.name} 
              />
              <div className="venue-info">
                <h3>{v.name}</h3>
                <p>Sig‘im: {v.capacity}</p>
                <p>Telefon: {v.phone_number}</p>
                <p>Narx: {v.price_per_seat} so‘m / o‘rindiq</p>
                <p>Manzil: {v.address}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
