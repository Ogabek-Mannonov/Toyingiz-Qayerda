import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../index.css'


const SidebarMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const navigate = useNavigate();

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
    // Faqat kerakli localStorage itemlarini o'chirish
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('userRole');

    setShowLogoutConfirm(false);
    setIsOpen(false);

    // Header va boshqa joylarni yangilash uchun maxsus event yuboriladi
    window.dispatchEvent(new Event('usernameChange'));

    navigate('/'); // Logoutdan keyin asosiy sahifaga yo'naltirish
  };

  return (
    <>
      <button onClick={toggleSidebar} className="hamburger-btn">
        &#9776;
      </button>

      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <button onClick={toggleSidebar} className="close-btn">&times;</button>
        <ul>
          <li>
            <Link to="/" onClick={toggleSidebar}>Bosh sahifa</Link>
          </li>
          <li>
            <Link to="/user/venues" onClick={toggleSidebar}>To'yxonalar</Link>
          </li>
          <li>
            <Link to="/profile" onClick={toggleSidebar}>Profil</Link>
          </li>
        </ul>
            <button onClick={openLogoutConfirm} className="logout-btn">Chiqish</button>
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
