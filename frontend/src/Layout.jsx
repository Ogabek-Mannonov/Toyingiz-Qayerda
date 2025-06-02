import React, { useState } from 'react';
import { useLocation, Routes, Route } from 'react-router-dom';

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
import PrivateRoute from './components/PrivateRoute';

function Layout() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Header va sidebar (hamburger) ni yashirish kerak bo‘lgan pathlar ro‘yxati
  const hideHeaderPaths = ['/login', '/signup', '/admin-panel', '/owner-panel'];
  const hideSidebarPaths = ['/login', '/signup', '/admin-panel', '/owner-panel'];

  // location.pathname bilan boshlangan joylarni tekshiramiz
  const isHeaderHidden = hideHeaderPaths.some(path => location.pathname.startsWith(path));
  const isSidebarHidden = hideSidebarPaths.some(path => location.pathname.startsWith(path));

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    if (sidebarOpen) setSidebarOpen(false);
  };

  return (
    <>
      {/* Agar header ko‘rsatish kerak bo‘lsa, Header va hamburger-ni chiqaramiz */}
      {!isHeaderHidden && <Header toggleSidebar={toggleSidebar} />}

      {!isSidebarHidden && (
        <>
          <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
            <SidebarMenu closeSidebar={closeSidebar} />
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
