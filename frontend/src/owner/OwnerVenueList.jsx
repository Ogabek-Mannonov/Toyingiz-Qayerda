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
      const res = await axios.get('/api/owner/venues', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setVenues(res.data.venues);
    } catch (err) {
      setError("Error fetching venues");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (venueId) => {
    const confirm = window.confirm("Are you sure you want to delete this venue?");
    if (!confirm) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/owner/venues/${venueId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchVenues();
    } catch (err) {
      alert("Error deleting venue");
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
      <div className="list-header">
        <h2 className="venue-title">My Venues</h2>
      </div>

      {loading && <p className="loading-text">Loading...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && venues.length === 0 && <p className="empty-text">No venues found.</p>}

      {!loading && venues.length > 0 && (
        <div className="table-wrapper">
          <table className="venue-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Address</th>
              <th>Capacity</th>
              <th>Price (per seat)</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {venues.map(v => (
              <tr key={v.hall_id}>
                <td>{v.name}</td>
                <td>{v.address}</td>
                <td>{v.capacity}</td>
                <td>${v.price_per_seat}</td>
                <td>{v.phone_number}</td>
                <td>{v.status}</td>
                <td>
                  <button onClick={() => handleEdit(v.hall_id)} className="edit-btn">Edit</button>
                  <button onClick={() => handleDelete(v.hall_id)} className="delete-btn">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      )}
    </div>
  );
}
