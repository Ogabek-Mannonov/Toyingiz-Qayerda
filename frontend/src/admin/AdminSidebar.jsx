import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './admin style/adminSidebar.css'

export default function AdminSidebar() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  return (
    <div className='admin-sidebar'>
      <div className="admin-sidebar-title">
        <h2>Admin Panel</h2>
      </div>

      <div className="nav-parent">
        <div className='nav-box'>
          <NavLink to="/admin-panel" end className={({ isActive }) => isActive ? 'active' : ''}>Dashboard</NavLink>
        </div>
        <div className='nav-box'>
          <NavLink to="/admin-panel/venues" className={({ isActive }) => isActive ? 'active' : ''}>To'yxonalar</NavLink>
        </div>
        <div className='nav-box'>
          <NavLink to="/admin-panel/createvenueowner" className={({ isActive }) => isActive ? 'active' : ''}>To'yxona Va Egalar Qo'shish</NavLink>
        </div>
        <div className='nav-box'>
          <NavLink to="/admin-panel/owners" className={({ isActive }) => isActive ? 'active' : ''}>Egalari</NavLink>
        </div>
        <div className='nav-box'>
          <NavLink to="/admin-panel/bookings" className={({ isActive }) => isActive ? 'active' : ''}>Bronlar</NavLink>
        </div>

        <div className='nav-box logout' onClick={() => setShowModal(true)} style={{ cursor: 'pointer' }}>
          Chiqish
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <p>Rostdan ham chiqmoqchimisiz?</p>
            <div className="modal-buttons">
              <button className="confirmm-btn" onClick={handleLogout}>Ha, chiqaman</button>
              <button className="cancell-btn" onClick={() => setShowModal(false)}>Bekor qilish</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
