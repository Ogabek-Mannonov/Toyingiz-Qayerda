import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import "./user.css"

export default function UserVenueList() {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchVenues();
  }, []);

  const fetchVenues = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await axios.get('http://localhost:5000/api/user/venues');
      if (response.data && response.data.venues) {
        setVenues(response.data.venues);
      } else {
        setError('To’yxonalar topilmadi');
      }
    } catch (err) {
      setError('To’yxonalarni olishda xatolik yuz berdi');
      console.error('Axios error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='toyxonalar-get'>
      <h2>Tasdiqlangan To’yxonalar</h2>

      {loading ? (
        <p>Yuklanmoqda...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : venues.length === 0 ? (
        <p>To’yxona topilmadi</p>
      ) : (
        <ul>
          {venues.map((v) => (
            <li key={v.hall_id}>
              <Link to={`/user/venues/${v.hall_id}`}>
                <strong>{v.name}</strong> — {v.district_name} — {v.address} — {v.price_per_seat} so‘m / o‘rindiq
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
