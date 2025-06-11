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

  const hideHeaderPaths = ['/login', '/signup', '/admin-panel', '/owner-panel'];
  const hideSidebarPaths = ['/login', '/signup', '/admin-panel', '/owner-panel'];

  const isHeaderHidden = hideHeaderPaths.some(path => location.pathname.startsWith(path));
  const isSidebarHidden = hideSidebarPaths.some(path => location.pathname.startsWith(path));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('username');
    setUsername('');
    navigate('/login');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    if (sidebarOpen) setSidebarOpen(false);
  };

  // Footer faqat foydalanuvchi ko‘radigan sahifalarda ko‘rinadi
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
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route
            path="/profile"
            element={
              <PrivateRoute roles={['user', 'owner', 'admin']}>
                <Profile />
              </PrivateRoute>
            }
          />

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

          <Route
            path="/admin-panel/*"
            element={
              <PrivateRoute roles={['admin']}>
                <AdminPanel />
              </PrivateRoute>
            }
          />

          <Route
            path="/user/venues"
            element={
              <PrivateRoute roles={['user']}>
                <UserVenueList />
              </PrivateRoute>
            }
          />
          <Route
            path="/user/venues/:id"
            element={
              <PrivateRoute roles={['user']}>
                <UserBookingForm />
              </PrivateRoute>
            }
          />
        </Routes>

        {showFooter && <Footer />} {/* Faqat user uchun ko‘rsatiladi */}
      </div>
    </>
  );
}

export default Layout;
