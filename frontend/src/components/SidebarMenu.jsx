import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import '../style/sidebar.css';

const SidebarMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const openLogoutConfirm = () => {
    setShowLogoutConfirm(true);
  };

  const closeLogoutConfirm = () => {
    setShowLogoutConfirm(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('userRole');

    setShowLogoutConfirm(false);
    setIsOpen(false);
    window.dispatchEvent(new Event('usernameChange'));
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <button onClick={toggleSidebar} className="hamburger-btn">&#9776;</button>

      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <button onClick={toggleSidebar} className="close-btn">&times;</button>
        </div>

        <div className="sidebar-body">
          <ul>
            <li className={isActive('/') ? 'active' : ''}>
              <Link to="/" onClick={toggleSidebar}>Bosh sahifa</Link>
            </li>
            <li className={isActive('/user/venues') ? 'active' : ''}>
              <Link to="/user/venues" onClick={toggleSidebar}>To'yxonalar</Link>
            </li>
            <li className={isActive('/user/bookings') ? 'active' : ''}>
              <Link to="/user/bookings" onClick={toggleSidebar}>Mening bronlarim</Link>
            </li>
            <li className={isActive('/profile') ? 'active' : ''}>
              <Link to="/profile" onClick={toggleSidebar}>Profil</Link>
            </li>
          </ul>
        </div>

        <div className="sidebar-footer">
          <Link to="/support" onClick={toggleSidebar} className="support-link">Support xizmat</Link>
          <button onClick={openLogoutConfirm} className="logout-btn">Chiqish</button>
        </div>
      </div>

      {isOpen && <div className="overlay" onClick={toggleSidebar}></div>}

      {showLogoutConfirm && (
        <>
          <div className="modal-overlay" onClick={closeLogoutConfirm}></div>
          <div className="modal">
            <h3>Chiqishni tasdiqlaysizmi?</h3>
            <p>Siz tizimdan chiqmoqchisiz.</p>
            <div className="modal-buttons">
              <button className="btn btn-cancel" onClick={closeLogoutConfirm}>Bekor qilish</button>
              <button className="btn btn-confirm" onClick={handleLogout}>Ha, chiqish</button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default SidebarMenu;
