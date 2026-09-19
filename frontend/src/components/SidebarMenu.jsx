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
              <Link to="/" onClick={toggleSidebar}>Home</Link>
            </li>
            <li className={isActive('/user/venues') ? 'active' : ''}>
              <Link to="/user/venues" onClick={toggleSidebar}>Venues</Link>
            </li>
            <li className={isActive('/user/bookings') ? 'active' : ''}>
              <Link to="/user/bookings" onClick={toggleSidebar}>My Bookings</Link>
            </li>
            <li className={isActive('/profile') ? 'active' : ''}>
              <Link to="/profile" onClick={toggleSidebar}>Profile</Link>
            </li>
          </ul>
        </div>

        <div className="sidebar-footer">
          <Link to="/support" onClick={toggleSidebar} className="support-link">Support Service</Link>
          <button onClick={openLogoutConfirm} className="logout-btn">Logout</button>
        </div>
      </div>

      {isOpen && <div className="overlay" onClick={toggleSidebar}></div>}

      {showLogoutConfirm && (
        <>
          <div className="modal-overlay" onClick={closeLogoutConfirm}></div>
          <div className="modal">
            <h3>Are you sure?</h3>
            <p>You will be logged out of your account.</p>
            <div className="modal-buttons">
              <button className="btn btn-cancel" onClick={closeLogoutConfirm}>Cancel</button>
              <button className="btn btn-confirm" onClick={handleLogout}>Yes, log out</button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default SidebarMenu;
