import React, { useState, useEffect } from 'react';
import axios from 'axios';
import VenueCalendar from './VenueCalendar';  // Kalendarga oid komponent

export default function VenueList() {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filter va sort uchun state
  const [filters, setFilters] = useState({
    sortBy: '',
    order: 'asc',
    search: '',
    status: '',
    district: '',
  });

  // Rayonlar (districts) ro‘yxati, backenddan olinadi
  const [districts, setDistricts] = useState([]);

  // Tanlangan to’yxona IDsi (kalendar uchun)
  const [selectedVenueId, setSelectedVenueId] = useState(null);

  // Rayonlarni olish
  useEffect(() => {
    axios.get('http://localhost:5000/api/admin/districts')
      .then(res => setDistricts(res.data.districts))
      .catch(() => setDistricts([]));
  }, []);

  // To’yxonalarni olish (filters o‘zgarganda yoki birinchi renderda)
  useEffect(() => {
    fetchVenues();
  }, [filters]);

  const fetchVenues = () => {
    setLoading(true);
    setError('');

    // Query params tayyorlash
    const params = {};
    if (filters.sortBy) params.sortBy = filters.sortBy;
    if (filters.order) params.order = filters.order;
    if (filters.search) params.search = filters.search;
    if (filters.status) params.status = filters.status;
    if (filters.district) params.district = filters.district;

    axios.get('http://localhost:5000/api/admin/venues', { params })
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
    axios.patch(`http://localhost:5000/api/admin/venues/${id}/approve`)
      .then(() => {
        fetchVenues();
      })
      .catch(() => alert('Tasdiqlashda xatolik yuz berdi'));
  };

  const handleDelete = (id) => {
    if (window.confirm('To’yxonani o‘chirmoqchimisiz?')) {
      axios.delete(`http://localhost:5000/api/admin/venues/${id}`)
        .then(() => {
          fetchVenues();
          // Agar o'chirilgan to'yxona tanlangan bo'lsa kalendarni yopamiz
          if (selectedVenueId === id) {
            setSelectedVenueId(null);
          }
        })
        .catch(() => alert('O‘chirishda xatolik yuz berdi'));
    }
  };

  return (
    <div>
      <h2>To’yxonalar Ro’yxati</h2>

      {/* Filtrlar */}
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          name="search"
          placeholder="Qidiruv..."
          value={filters.search}
          onChange={handleFilterChange}
          style={{ marginRight: '10px' }}
        />

        <select name="status" value={filters.status} onChange={handleFilterChange} style={{ marginRight: '10px' }}>
          <option value="">Barchasi</option>
          <option value="approved">Tasdiqlangan</option>
          <option value="pending">Tasdiqlanmagan</option>
        </select>

        <select name="district" value={filters.district} onChange={handleFilterChange} style={{ marginRight: '10px' }}>
          <option value="">Rayon tanlash</option>
          {districts.map(d => (
            <option key={d.district_id} value={d.name}>{d.name}</option>
          ))}
        </select>

        <select name="sortBy" value={filters.sortBy} onChange={handleFilterChange} style={{ marginRight: '10px' }}>
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

      {/* Ro'yxat */}
      {loading ? (
        <p>Yuklanmoqda...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : venues.length === 0 ? (
        <p>Hech qanday to’yxona topilmadi</p>
      ) : (
        <>
          <table border="1" cellPadding="8" cellSpacing="0" style={{ width: '100%', cursor: 'pointer' }}>
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
                  <td>{v.status}</td>
                  <td>{v.owner_name}</td>
                  <td onClick={e => e.stopPropagation()}>
                    {v.status !== 'approved' && (
                      <button onClick={() => handleApprove(v.hall_id)}>Tasdiqlash</button>
                    )}
                    <button onClick={() => handleDelete(v.hall_id)} style={{ marginLeft: '10px' }}>
                      O‘chirish
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Kalendarni tanlangan to’yxona uchun ko‘rsatish */}
          {selectedVenueId && (
            <div style={{ marginTop: 30 }}>
              <VenueCalendar venueId={selectedVenueId} />
              <button onClick={() => setSelectedVenueId(null)} style={{ marginTop: 10 }}>
                Kalendarni yopish
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
