import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function SidebarOwner() {
  const [isOpen, setIsOpen] = useState(true);
  const [username, setUsername] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Sahifa ochilganda localStoragedan username o'qish
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) setUsername(storedUsername);
  }, []);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    // Kerak bo‘lsa boshqa user ma’lumotlarni ham o‘chirish

    // Logoutdan keyin login sahifasiga yo'naltirish
    navigate('/login');
  };

  const links = [
    { to: '/owner-panel', label: 'Bosh sahifa' },
    { to: '/owner-panel/venues', label: "To'yxonalar ro'yxati" },
    { to: '/owner-panel/add-venue', label: "To'yxona qo'shish" },
    { to: '/owner-panel/bookings', label: "Bronlarni ko'rish" },
    { to: '/profile', label: 'Profil' },
  ];

  return (
    <>
      <button onClick={toggleSidebar} className="hamburger-btn" style={{ margin: '10px' }}>
        {isOpen ? '❌' : '☰'}
      </button>

      <nav
        className={`sidebar ${isOpen ? 'open' : 'closed'}`}
        style={{
          width: isOpen ? '250px' : '60px',
          transition: 'width 0.3s ease',
          backgroundColor: '#333',
          height: '100vh',
          color: 'white',
          paddingTop: '20px',
          position: 'fixed',
          top: 0,
          left: 0,
          overflowX: 'hidden',
          boxShadow: '2px 0 5px rgba(0,0,0,0.7)',
          zIndex: 1000,
        }}
      >
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {links.map(({ to, label }) => (
            <li
              key={to}
              style={{
                padding: '12px 20px',
                backgroundColor: location.pathname === to ? '#555' : 'transparent',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              <Link
                to={to}
                style={{
                  color: 'white',
                  textDecoration: 'none',
                  display: 'block',
                }}
              >
                {label}
              </Link>
            </li>
          ))}

          <li
            style={{
              padding: '12px 20px',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
            onClick={handleLogout}
          >
            <span style={{ color: 'white', display: 'block' }}>
              {username ? `Chiqish (${username})` : 'Chiqish'}
            </span>
          </li>
        </ul>
      </nav>
    </>
  );
}
