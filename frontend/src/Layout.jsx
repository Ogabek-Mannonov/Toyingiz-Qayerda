import React, { useState } from 'react';
import { useLocation, Routes, Route } from 'react-router-dom';
import SidebarMenu from './components/SidebarMenu';  
import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signin';
import OwnerPanel from './owner/OwnerPanel';  // OwnerPanel importi
import OwnerVenueList from './owner/OwnerVenueList';
import OwnerBookingList from './owner/OwnerBookingList';
import OwnerVenueForm from './owner/OwnerAddVenue';  // Qo‘shish/tahrirlash formasi
import AdminPanel from './admin/AdminPanel';
import UserVenueList from './user/UserVenueList';
import UserBookingForm from './user/UserBookingForm'; 

function Layout() {
  const location = useLocation();

  // Sidebar ochiq/yopiq holati
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Yashirish kerak bo‘lgan pathlar (header va sidebar uchun)
  const hideHeaderPaths = [
    '/login', 
    '/signup', 
    '/owner-panel',  // Owner panel
    '/admin-panel'
  ];

  const hideSidebarPaths = [
    '/login',
    '/signup',
    '/owner-panel',  // Owner panel
    '/admin-panel',
  ];

  // Header va Sidebar ko‘rsatishni boshqarish
  const isHeaderHidden = hideHeaderPaths.some(path => location.pathname.startsWith(path));
  const isSidebarHidden = hideSidebarPaths.some(path => location.pathname.startsWith(path));

  // Sidebar toggle funksiyasi
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Sidebar yopish funksiyasi (overlay bosilganda yoki content bosilganda)
  const closeSidebar = () => {
    if (sidebarOpen) setSidebarOpen(false);
  };

  return (
    <>
      {/* Header faqat kerakli joyda ko‘rsatiladi va toggleSidebar ni props qilib beradi */}
      {!isHeaderHidden && <Header toggleSidebar={toggleSidebar} />}

      {/* Sidebar faqat kerakli joyda ishlaydi */}
      {!isSidebarHidden && (
        <>
          <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
            <SidebarMenu closeSidebar={closeSidebar} />
          </div>

          {/* Overlay faqat sidebar ochilganda paydo bo‘ladi */}
          {sidebarOpen && <div className="overlay" onClick={closeSidebar}></div>}
        </>
      )}

      {/* Asosiy content - sidebardan mustaqil, to‘liq ekran kengligi */}
      <div className="content" onClick={closeSidebar} style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* OwnerPanel ichidagi nested routelar */}
          <Route path="/owner-panel" element={<OwnerPanel />}>
            <Route index element={<OwnerVenueList />} />                    {/* /owner-panel */}
            <Route path="venues" element={<OwnerVenueList />} />            {/* /owner-panel/venues */}
            <Route path="add-venue" element={<OwnerVenueForm />} />         {/* /owner-panel/add-venue */}
            <Route path="edit-venue/:id" element={<OwnerVenueForm />} />    {/* /owner-panel/edit-venue/:id */}
            <Route path="bookings" element={<OwnerBookingList />} />        {/* /owner-panel/bookings */}
          </Route>

          <Route path="/admin-panel/*" element={<AdminPanel />} />
          <Route path="/user/venues" element={<UserVenueList />} /> 
          <Route path="/user/venues/:id" element={<UserBookingForm />} /> 
        </Routes>
      </div>
    </>
  );
}

export default Layout;
