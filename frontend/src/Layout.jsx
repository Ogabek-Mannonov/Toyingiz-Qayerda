import React, { useState } from 'react';
import { useLocation, Routes, Route, useNavigate } from 'react-router-dom';

import SidebarMenu from './components/SidebarMenu';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signin';
import OwnerPanel from './owner/OwnerPanel';
import OwnerVenueList from './owner/OwnerVenueList';
import OwnerBookingList from './owner/OwnerBookingList';
import OwnerVenueForm from './owner/OwnerAddVenue';
import AdminPanel from './admin/AdminPanel';
import UserVenueList from './user/UserVenueList';
import UserBookingForm from './user/UserBookingForm';
import Profile from './components/Profile';
import PrivateRoute from './components/PrivateRoute';

function Layout() {
  const location = useLocation();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [username, setUsername] = useState(localStorage.getItem('username') || '');

  // Header va Sidebar yashiriladigan pathlar
  const hideHeaderPaths = ['/login', '/signup', '/admin-panel', '/owner-panel'];
  const hideSidebarPaths = ['/login', '/signup', '/admin-panel', '/owner-panel'];

  const isHeaderHidden = hideHeaderPaths.some(path => location.pathname.startsWith(path));
  const isSidebarHidden = hideSidebarPaths.some(path => location.pathname.startsWith(path));

  // Logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('username');
    setUsername('');
    navigate('/login');
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => sidebarOpen && setSidebarOpen(false);

  // Footer faqat foydalanuvchi sahifalari va bosh sahifada ko‘rinadi
  const showFooter =
    location.pathname.startsWith('/user') ||
    location.pathname === '/' ||
    location.pathname === '/profile';

  return (
    <>
      {!isHeaderHidden && <Header toggleSidebar={toggleSidebar} username={username} />}

      {!isSidebarHidden && (
        <>
          <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
            <SidebarMenu closeSidebar={closeSidebar} onLogout={handleLogout} />
          </div>
          {sidebarOpen && <div className="overlay" onClick={closeSidebar}></div>}
        </>
      )}

      <div className="content" onClick={closeSidebar} style={{ flex: 1 }}>
        <Routes>
          {/* 🔓 Ochiq sahifalar */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* 🔒 Profile (faqat login bo‘lganlar uchun) */}
          <Route
            path="/profile"
            element={
              <PrivateRoute roles={['user', 'owner', 'admin']}>
                <Profile />
              </PrivateRoute>
            }
          />

          {/* 🔒 Owner sahifalari */}
          <Route
            path="/owner-panel/*"
            element={
              <PrivateRoute roles={['owner']}>
                <OwnerPanel />
              </PrivateRoute>
            }
          >
            <Route index element={<OwnerVenueList />} />
            <Route path="venues" element={<OwnerVenueList />} />
            <Route path="add-venue" element={<OwnerVenueForm />} />
            <Route path="edit-venue/:id" element={<OwnerVenueForm />} />
            <Route path="bookings" element={<OwnerBookingList />} />
          </Route>

          {/* 🔒 Admin panel */}
          <Route
            path="/admin-panel/*"
            element={
              <PrivateRoute roles={['admin']}>
                <AdminPanel />
              </PrivateRoute>
            }
          />

          {/* 🔓 User sahifalari (ochiq kirish) */}
          <Route path="/user/venues" element={<UserVenueList />} />
          <Route path="/user/venues/:id" element={<UserBookingForm />} />
        </Routes>

        {/* Footer faqat user, home, yoki profile sahifalarda */}
        {showFooter && <Footer />}
      </div>
    </>
  );
}

export default Layout;
