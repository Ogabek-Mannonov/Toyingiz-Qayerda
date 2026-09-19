import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './admin style/adminPanel.css'; // Faqat yagona Global Theme chaqiriladi
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
          <NavLink to="/admin-panel/venues" className={({ isActive }) => isActive ? 'active' : ''}>Venues</NavLink>
        </div>
        <div className='nav-box'>
          <NavLink to="/admin-panel/createvenueowner" className={({ isActive }) => isActive ? 'active' : ''}>Add Venue & Owner</NavLink>
        </div>
        <div className='nav-box'>
          <NavLink to="/admin-panel/owners" className={({ isActive }) => isActive ? 'active' : ''}>Owners</NavLink>
        </div>
        <div className='nav-box'>
          <NavLink to="/admin-panel/bookings" className={({ isActive }) => isActive ? 'active' : ''}>Bookings</NavLink>
        </div>

        <div className='nav-box logout' onClick={() => setShowModal(true)} style={{ cursor: 'pointer' }}>
          Logout
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <p>Are you sure you want to log out??</p>
            <div className="modal-buttons">
              <button className="admin-btn admin-btn-danger" onClick={handleLogout}>Yes, log out</button>
              <button className="admin-btn admin-btn-success" onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
