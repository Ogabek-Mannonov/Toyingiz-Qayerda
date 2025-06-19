import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "../index.css";

export default function UserVenueList() {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filterDistrict, setFilterDistrict] = useState('');
  const [districts, setDistricts] = useState([]);

  const navigate = useNavigate();

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

      // JSON string sifatida kelgan bo'lsa, uni parse qilish
      const venuesWithParsedPhotos = res.data.venues.map(v => ({
        ...v,
        photos: typeof v.photos === 'string' ? JSON.parse(v.photos) : v.photos
      }));

      setVenues(venuesWithParsedPhotos);
    } catch (err) {
      setError('To’yxonalarni olishda xatolik yuz berdi');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleVenueClick = (hallId) => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate(`/user/venues/${hallId}`);
    } else {
      navigate('/login');
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
          {venues.map((v) => {
            console.log(v.photos[0]); 

            return (
              <div
                key={v.hall_id}
                className="venue-card"
                onClick={() => handleVenueClick(v.hall_id)}
                style={{ cursor: 'pointer' }}
              >
                <img
                  src={
                    v.photos && v.photos.length > 0
                      ? `http://localhost:5000${v.photos[0]}`
                      : '/uploads/no-image.png'
                  }
                  alt={v.name}
                />
                <div className="venue-info">
                  <h3>{v.name}</h3>
                  <p>Sig'im: {v.capacity}</p>
                  <p>Telefon: {v.phone_number}</p>
                  <p>Narx: {v.price_per_seat} so'm / o'rindiq</p>
                  <p>Manzil: {v.address}</p>
                </div>
              </div>
            );
          })}

        </div>
      )}
    </div>
  );
}
