import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ownerVenueList.css';

export default function OwnerVenueList() {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

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
      setError("To’yxonalarni olishda xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (venueId) => {
    const confirm = window.confirm("To'yxonani o'chirishni istaysizmi?");
    if (!confirm) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/owner/venues/${venueId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchVenues();
    } catch (err) {
      alert("To'yxonani o'chirishda xatolik yuz berdi");
    }
  };

  useEffect(() => {
    fetchVenues();
  }, []);

  const handleEdit = (venueId) => {
    navigate(`/owner-panel/edit-venue/${venueId}`);
  };

  return (
    <div className="venue-list-container">
      <h2 className="venue-title">Sizning To'yxonalar</h2>

      {loading && <p>Yuklanmoqda...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && venues.length === 0 && <p>To'yxona topilmadi</p>}

      {!loading && venues.length > 0 && (
        <table className="venue-table">
          <thead>
            <tr>
              <th>Nomi</th>
              <th>Manzili</th>
              <th>Sig'imi</th>
              <th>Narxi</th>
              <th>Telefon</th>
              <th>Status</th>
              <th>Amallar</th>
            </tr>
          </thead>
          <tbody>
            {venues.map(v => (
              <tr key={v.hall_id}>
                <td>{v.name}</td>
                <td>{v.address}</td>
                <td>{v.capacity}</td>
                <td>{v.price_per_seat} so'm</td>
                <td>{v.phone_number}</td>
                <td>{v.status}</td>
                <td>
                  <button onClick={() => handleEdit(v.hall_id)} className="edit-btn">Tahrirlash</button>
                  <button onClick={() => handleDelete(v.hall_id)} className="delete-btn">O'chirish</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
