import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import VenueCalendar from './VenueCalendar';
// Global theme is already imported in AdminPanel.jsx



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
    axios.get('/api/admin/districts', {
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

    axios.get('/api/admin/venues', {
      params,
      headers: getAuthHeaders()
    })
      .then(res => {
        setVenues(res.data.venues);
        setLoading(false);
      })
      .catch(() => {
        setError('Error fetching venues');
        setLoading(false);
      });
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleApprove = (id) => {
    axios.patch(`/api/admin/venues/${id}/approve`, null, {
      headers: getAuthHeaders()
    })
      .then(() => fetchVenues())
      .catch(() => alert('Error approving venue'));
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this venue?')) {
      axios.delete(`/api/admin/venues/${id}`, {
        headers: getAuthHeaders()
      })
        .then(() => {
          fetchVenues();
          if (selectedVenueId === id) setSelectedVenueId(null);
        })
        .catch(() => alert('Error deleting venue'));
    }
  };

  return (
    <div className="admin-page-container">
      <h1 className="admin-page-title">Venues List</h1>

      <div className="admin-card" style={{ display: 'flex', gap: '15px', marginBottom: '20px', padding: '15px' }}>
        <input
          type="text"
          className="admin-input"
          style={{ marginBottom: '0', flex: 1 }}
          name="search"
          placeholder="Search..."
          value={filters.search}
          onChange={handleFilterChange}
        />

        <select className="admin-input" style={{ marginBottom: '0' }} name="status" value={filters.status} onChange={handleFilterChange}>
          <option value="">All</option>
          <option value="approved">Approved</option>
          <option value="pending">Pending</option>
        </select>

        <select className="admin-input" style={{ marginBottom: '0' }} name="district" value={filters.district} onChange={handleFilterChange}>
          <option value="">Select District</option>
          {districts.map(d => (
            <option key={d.district_id} value={d.name}>{d.name}</option>
          ))}
        </select>

        <select className="admin-input" style={{ marginBottom: '0' }} name="sortBy" value={filters.sortBy} onChange={handleFilterChange}>
          <option value="">Sort By</option>
          <option value="price_per_seat">Price</option>
          <option value="capacity">Capacity</option>
          <option value="district">District</option>
          <option value="status">Status</option>
        </select>

        <select className="admin-input" style={{ marginBottom: '0' }} name="order" value={filters.order} onChange={handleFilterChange}>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : venues.length === 0 ? (
        <p>No venues found</p>
      ) : (
        <div className="admin-card admin-table-container">
          <table className="admin-table" style={{ cursor: 'pointer' }}>
            <thead>
              <tr>
                <th>Name</th>
                <th>District</th>
                <th>Address</th>
                <th>Capacity</th>
                <th>Price (per seat)</th>
                <th>Status</th>
                <th>Owner</th>
                <th>Actions</th>
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
                  <td>
                    <span className={`status-badge status-${v.status}`}>
                      {v.status === 'approved' ? 'Approved' : 'Pending'}
                    </span>
                  </td>
                  <td>{v.owner_name}</td>
                  <td onClick={e => e.stopPropagation()}>
                    {v.status !== 'approved' && (
                      <button className="admin-btn admin-btn-success" onClick={() => handleApprove(v.hall_id)}>Approve</button>
                    )}
                    <button className="admin-btn admin-btn-danger" onClick={() => handleDelete(v.hall_id)} style={{ marginLeft: '10px' }}>Delete</button>
                    <button
                      className="admin-btn admin-btn-primary"
                      onClick={e => {
                        e.stopPropagation();
                        navigate(`/admin-panel/venues/edit/${v.hall_id}`);
                      }}
                      style={{ marginLeft: '10px' }}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {selectedVenueId && (
            <div className="venue-calendar-wrapper" style={{ marginTop: '20px' }}>
              <VenueCalendar venueId={selectedVenueId} />
              <button className="admin-btn admin-btn-danger" onClick={() => setSelectedVenueId(null)} style={{ marginTop: '10px' }}>
                Close Calendar
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
