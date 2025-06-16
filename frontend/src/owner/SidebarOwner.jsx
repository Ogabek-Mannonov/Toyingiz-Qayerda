import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  FaHome,
  FaList,
  FaPlus,
  FaCalendarCheck,
  FaUser,
  FaSignOutAlt,
} from 'react-icons/fa';
import './sidebarowner.css';

export default function SidebarOwner() {
  const [username, setUsername] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) setUsername(storedUsername);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/login');
  };

  const links = [
    { to: '/owner-panel', label: 'Bosh sahifa', icon: <FaHome /> },
    { to: '/owner-panel/venues', label: "To'yxonalar ro'yxati", icon: <FaList /> },
    { to: '/owner-panel/add-venue', label: "To'yxona qo'shish", icon: <FaPlus /> },
    { to: '/owner-panel/bookings', label: "Bronlarni ko'rish", icon: <FaCalendarCheck /> },
    { to: '/profile', label: 'Profil', icon: <FaUser /> },
  ];

  return (
    <nav className="sidebar-owner">
      <div className="sidebar-title">
        <h2>Owner Panel</h2>
      </div>

      <ul>
        {links.map(({ to, label, icon }) => (
          <li
            key={to}
            className={location.pathname === to ? 'active' : ''}
          >
            <Link to={to}>
              {icon}
              <span>{label}</span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="logout-btnn" onClick={handleLogout}>
        <FaSignOutAlt />
        <span>Chiqish ({username || 'Foydalanuvchi'})</span>
      </div>
    </nav>
  );
}
