import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

export default function AdminSidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // LocalStorage tozalash
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    // Boshqa user ma’lumotlari ham bo’lsa, kerak bo’lsa ularni ham o’chiring
    // localStorage.removeItem('username');  // agar username ham saqlansa

    // Login sahifasiga yo'naltirish
    navigate('/login');
  };

  return (
    <div className='admin-sidebar'>
      <div className="title">
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
          <NavLink to="/admin-panel/createvenueowner" className={({ isActive }) => isActive ? 'active' : ''}>To'yxona Va To'yxona Egalarini Qo'shish</NavLink>
        </div>
        <div className='nav-box'>
          <NavLink to="/admin-panel/owners" className={({ isActive }) => isActive ? 'active' : ''}>Egalari</NavLink>
        </div>
        <div className='nav-box'>
          <NavLink to="/admin-panel/bookings" className={({ isActive }) => isActive ? 'active' : ''}>Bronlar</NavLink>
        </div>

        {/* Logout tugmasi */}
        <div className='nav-box' style={{ cursor: 'pointer', color: '#ff4d4d', fontWeight: 'bold' }} onClick={handleLogout}>
          Chiqish
        </div>
      </div>
    </div>
  )
}
