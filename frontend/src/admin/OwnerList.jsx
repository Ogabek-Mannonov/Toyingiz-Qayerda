import React, { useEffect, useState } from 'react';
import axios from 'axios';
// Global theme is already imported in AdminPanel.jsx

export default function OwnerList() {
  const [owners, setOwners] = useState([]);
  const [filteredOwners, setFilteredOwners] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('first_name');
  const [currentPage, setCurrentPage] = useState(1);
  const [ownersPerPage] = useState(5);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOwners();
  }, []);

  useEffect(() => {
    filterAndSortOwners();
  }, [owners, searchTerm, sortBy]);

  const fetchOwners = () => {
    setLoading(true);
    setError('');

    const token = localStorage.getItem('token');

    axios.get('/api/admin/owners', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => {
        setOwners(res.data.owners);
        setLoading(false);
      })
      .catch(err => {
        console.error('Egalarning ro‘yxatini olishda xatolik:', err);
        setError('Error fetching owners');
        setLoading(false);
      });
  };

  const filterAndSortOwners = () => {
    let filtered = owners.filter(o =>
      o.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    filtered.sort((a, b) =>
      a[sortBy].localeCompare(b[sortBy])
    );

    setFilteredOwners(filtered);
    setCurrentPage(1); // qidiruv yoki sortda 1-sahifaga qaytish
  };

  // Sahifalash
  const indexOfLastOwner = currentPage * ownersPerPage;
  const indexOfFirstOwner = indexOfLastOwner - ownersPerPage;
  const currentOwners = filteredOwners.slice(indexOfFirstOwner, indexOfLastOwner);
  const totalPages = Math.ceil(filteredOwners.length / ownersPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="admin-page-container">
      <h1 className="admin-page-title">Venue Owners</h1>

      {/* Search... Sort */}
      <div className="admin-card" style={{ display: 'flex', gap: '15px', marginBottom: '20px', padding: '15px' }}>
        <input
          type="text"
          className="admin-input"
          style={{ marginBottom: '0', flex: 1 }}
          placeholder="Search...sm, familiya, username)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select className="admin-input" style={{ marginBottom: '0', width: '250px' }} value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="first_name">By First Name</option>
          <option value="last_name">By Last Name</option>
        </select>
      </div>

      {loading ? (
        <p className="owner-message loading">Loading...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : currentOwners.length === 0 ? (
        <p className="owner-message">Nothing found</p>
      ) : (
        <div className="admin-card admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Username</th>
                <th>Phone Number</th>
                <th>Date Added</th>
              </tr>
            </thead>
            <tbody>
              {currentOwners.map(o => (
                <tr key={o.user_id}>
                  <td>{o.first_name}</td>
                  <td>{o.last_name}</td>
                  <td>{o.username}</td>
                  <td>{o.phone_number}</td>
                  <td>{new Date(o.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => handlePageChange(i + 1)}
                className={`admin-btn ${currentPage === i + 1 ? 'admin-btn-primary' : ''}`}
                style={{ background: currentPage !== i + 1 ? '#eee' : undefined, color: currentPage !== i + 1 ? '#333' : undefined }}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
