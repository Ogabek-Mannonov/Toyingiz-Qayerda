import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function SidebarOwner() {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();

  const toggleSidebar = () => setIsOpen(!isOpen);

  // Owner paneliga tegishli linklar
  const links = [
    { to: '/owner-panel', label: 'Bosh sahifa' },
    { to: '/owner-panel/venues', label: 'To\'yxonalar ro\'yxati' },
    { to: '/owner-panel/add-venue', label: 'To\'yxona qo\'shish' },
    { to: '/owner-panel/bookings', label: 'Bronlarni ko\'rish' },
    { to: '/profile', label: 'Profil' },
    { to: '/logout', label: 'Chiqish' },
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
        </ul>
      </nav>
    </>
  );
}
