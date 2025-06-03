import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function OwnerList() {
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOwners();
  }, []);

  const fetchOwners = () => {
    setLoading(true);
    setError('');

    const token = localStorage.getItem('token'); // Tokenni localStorage'dan olish

    axios.get('http://localhost:5000/api/admin/owners', {
      headers: {
        Authorization: `Bearer ${token}`, // Authorization headerga token qo'shish
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

  return (
    <div>
      <h2>To’yxona Egalari</h2>

      {loading ? (
        <p>Yuklanmoqda...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : owners.length === 0 ? (
        <p>Hali hech qanday egalar qo‘shilmagan</p>
      ) : (
        <table border="1" cellPadding="8" cellSpacing="0" style={{ width: '100%' }}>
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
            {owners.map(o => (
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
      )}
    </div>
  );
}
