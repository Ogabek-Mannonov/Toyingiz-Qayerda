import React, { useState, useEffect } from 'react';
import { useLocation, Routes, Route, useNavigate } from 'react-router-dom';

import SidebarMenu from './components/SidebarMenu';  
import Header from './components/Header';
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

  // Username holati Layout darajasida
  const [username, setUsername] = useState(localStorage.getItem('username') || '');

  const hideHeaderPaths = ['/login', '/signup', '/admin-panel', '/owner-panel'];
  const hideSidebarPaths = ['/login', '/signup', '/admin-panel', '/owner-panel'];

  const isHeaderHidden = hideHeaderPaths.some(path => location.pathname.startsWith(path));
  const isSidebarHidden = hideSidebarPaths.some(path => location.pathname.startsWith(path));

  // Logout funksiyasi - localStoragedan ma'lumotlarni o'chirib, username ni ham tozalaydi
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

  // Agar login qilganda username localStorage ga yozilsa, Layout uni avtomatik oladi
  // Buni yanada real va dinamik qilish uchun boshqa mexanizmlar kerak (context yoki event bus)

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
      </div>
    </>
  );
}

export default Layout;
