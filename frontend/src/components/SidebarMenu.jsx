import React, { useState } from 'react';
import { Link } from 'react-router-dom';  // Link ni import qildik

const SidebarMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button onClick={toggleSidebar} className="hamburger-btn">
        &#9776;
      </button>

      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <button onClick={toggleSidebar} className="close-btn">&times;</button>
        <ul>
          <li><Link to="/" onClick={toggleSidebar}>Bosh sahifa</Link></li>
          <li><Link to="/user/venues" onClick={toggleSidebar}>To'yxonalar</Link></li> {/* Yangi link qo'shildi */}
          <li><Link to="/profile" onClick={toggleSidebar}>Profil</Link></li>
          <li><Link to="/logout" onClick={toggleSidebar}>Chiqish</Link></li>
        </ul>
      </div>

      {isOpen && <div className="overlay" onClick={toggleSidebar}></div>}
    </>
  );
};

export default SidebarMenu;
