import React, { useState } from 'react';

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
          <li>Bosh sahifa</li>
          <li>To'yxonalar</li>
          <li>Profil</li>
          <li>Chiqish</li>
        </ul>
      </div>

      {isOpen && <div className="overlay" onClick={toggleSidebar}></div>}
    </>
  );
};

export default SidebarMenu;
