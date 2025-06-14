import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import VenueCalendar from './VenueCalendar';
import './venue-list.css';


export default function VenueList() {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    sortBy: '',
    order: 'asc',
    search: '',
    status: '',
    district: '',
  });

  const [districts, setDistricts] = useState([]);
  const [selectedVenueId, setSelectedVenueId] = useState(null);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return { Authorization: token ? `Bearer ${token}` : '' };
  };

  useEffect(() => {
    axios.get('http://localhost:5000/api/admin/districts', {
      headers: getAuthHeaders()
    })
      .then(res => setDistricts(res.data.districts))
      .catch(() => setDistricts([]));
  }, []);

  useEffect(() => {
    fetchVenues();
  }, [filters]);

  const fetchVenues = () => {
    setLoading(true);
    setError('');
    const params = {};
    if (filters.sortBy) params.sortBy = filters.sortBy;
    if (filters.order) params.order = filters.order;
    if (filters.search) params.search = filters.search;
    if (filters.status) params.status = filters.status;
    if (filters.district) params.district = filters.district;

    axios.get('http://localhost:5000/api/admin/venues', {
      params,
      headers: getAuthHeaders()
    })
      .then(res => {
        setVenues(res.data.venues);
        setLoading(false);
      })
      .catch(() => {
        setError('To’yxonalarni olishda xatolik yuz berdi');
        setLoading(false);
      });
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleApprove = (id) => {
    axios.patch(`http://localhost:5000/api/admin/venues/${id}/approve`, null, {
      headers: getAuthHeaders()
    })
      .then(() => fetchVenues())
      .catch(() => alert('Tasdiqlashda xatolik yuz berdi'));
  };

  const handleDelete = (id) => {
    if (window.confirm('To’yxonani o‘chirmoqchimisiz?')) {
      axios.delete(`http://localhost:5000/api/admin/venues/${id}`, {
        headers: getAuthHeaders()
      })
        .then(() => {
          fetchVenues();
          if (selectedVenueId === id) setSelectedVenueId(null);
        })
        .catch(() => alert('O‘chirishda xatolik yuz berdi'));
    }
  };

  return (
    <div>
      <h2>To’yxonalar Ro’yxati</h2>

      <div className="filter-container">
        <input
          type="text"
          name="search"
          placeholder="Qidiruv..."
          value={filters.search}
          onChange={handleFilterChange}
        />

        <select name="status" value={filters.status} onChange={handleFilterChange}>
          <option value="">Barchasi</option>
          <option value="approved">Tasdiqlangan</option>
          <option value="pending">Tasdiqlanmagan</option>
        </select>

        <select name="district" value={filters.district} onChange={handleFilterChange}>
          <option value="">Rayon tanlash</option>
          {districts.map(d => (
            <option key={d.district_id} value={d.name}>{d.name}</option>
          ))}
        </select>

        <select name="sortBy" value={filters.sortBy} onChange={handleFilterChange}>
          <option value="">Saralash</option>
          <option value="price_per_seat">Narx</option>
          <option value="capacity">Sig‘im</option>
          <option value="district">Rayon</option>
          <option value="status">Status</option>
        </select>

        <select name="order" value={filters.order} onChange={handleFilterChange}>
          <option value="asc">O‘sish</option>
          <option value="desc">Kamayish</option>
        </select>
      </div>

      {loading ? (
        <p>Yuklanmoqda...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : venues.length === 0 ? (
        <p>Hech qanday to’yxona topilmadi</p>
      ) : (
        <>
          <table className="admin-table" border="1" cellPadding="8" cellSpacing="0" style={{ cursor: 'pointer' }}>
            <thead>
              <tr>
                <th>Nomi</th>
                <th>Rayon</th>
                <th>Manzil</th>
                <th>Sig‘im</th>
                <th>Narx (1 o‘rindiq)</th>
                <th>Status</th>
                <th>Egasi</th>
                <th>Amallar</th>
              </tr>
            </thead>
            <tbody>
              {venues.map(v => (
                <tr key={v.hall_id} onClick={() => setSelectedVenueId(v.hall_id)}>
                  <td>{v.name}</td>
                  <td>{v.district_name}</td>
                  <td>{v.address}</td>
                  <td>{v.capacity}</td>
                  <td>{v.price_per_seat}</td>
                  <td style={{ color: v.status === 'approved' ? 'green' : 'red', fontWeight: 'bold' }}>
                    {v.status === 'approved' ? 'Tasdiqlangan' : 'Tasdiqlanmagan'}
                  </td>
                  <td>{v.owner_name}</td>
                  <td onClick={e => e.stopPropagation()}>
                    {v.status !== 'approved' && (
                      <button className="admin-btn approve" onClick={() => handleApprove(v.hall_id)}>Tasdiqlash</button>
                    )}
                    <button className="admin-btn delete" onClick={() => handleDelete(v.hall_id)} style={{ marginLeft: '10px' }}>O‘chirish</button>
                    <button
                      className="admin-btn edit"
                      onClick={e => {
                        e.stopPropagation();
                        navigate(`/admin-panel/venues/edit/${v.hall_id}`);
                      }}
                      style={{ marginLeft: '10px' }}
                    >
                      Tahrirlash
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {selectedVenueId && (
            <div className="venue-calendar-wrapper">
              <VenueCalendar venueId={selectedVenueId} />
              <button className="close-calendar-btn" onClick={() => setSelectedVenueId(null)}>
                Kalendarni yopish
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
