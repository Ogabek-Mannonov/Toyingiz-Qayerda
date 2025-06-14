import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ownerList.css';

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

    axios.get('http://localhost:5000/api/admin/owners', {
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
        setError('Egalarning ro‘yxatini olishda xatolik yuz berdi');
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
    <div className="owner-list-container">
      <h2>To’yxona Egalari</h2>

      {/* Qidiruv va Sort */}
      <div className="owner-filters">
        <input
          type="text"
          placeholder="Qidiruv (ism, familiya, username)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="first_name">Ism bo‘yicha</option>
          <option value="last_name">Familiya bo‘yicha</option>
        </select>
      </div>

      {loading ? (
        <p className="owner-message loading">Yuklanmoqda...</p>
      ) : error ? (
        <p className="owner-message error">{error}</p>
      ) : currentOwners.length === 0 ? (
        <p className="owner-message">Hech narsa topilmadi</p>
      ) : (
        <>
          <table className="owner-table">
            <thead>
              <tr>
                <th>Ism</th>
                <th>Familiya</th>
                <th>Username</th>
                <th>Telefon raqam</th>
                <th>Qo‘shilgan sana</th>
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
          <div className="pagination">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => handlePageChange(i + 1)}
                className={currentPage === i + 1 ? 'active' : ''}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
