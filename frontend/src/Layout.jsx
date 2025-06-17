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
import OwnerDashboard from './owner/OwnerDashboard';

import AdminPanel from './admin/AdminPanel';

import UserVenueList from './user/UserVenueList';
import UserBookingForm from './user/UserBookingForm';
import UserBookingList from './user/UserBookingList';
import VenueDetails from './user/VenueDetails';

import Profile from './components/Profile';
import PrivateRoute from './components/PrivateRoute';
import EditVenue from './owner/EditVenueOwner';
import OwnerProfileEdit from './owner/OwnerProfileEdit';

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

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => sidebarOpen && setSidebarOpen(false);

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
          {/* Ochiq sahifalar */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Profile */}
          <Route
            path="/profile"
            element={
              <PrivateRoute roles={['user']}>
                <Profile />
              </PrivateRoute>
            }
          />


          {/* Owner panel */}
          <Route
            path="/owner-panel/*"
            element={
              <PrivateRoute roles={['owner']}>
                <OwnerPanel />
              </PrivateRoute>
            }
          >
            <Route index element={<OwnerDashboard />} />
            <Route path="venues" element={<OwnerVenueList />} />
            <Route path="add-venue" element={<OwnerVenueForm />} />
            <Route path="edit-venue/:id" element={<OwnerVenueForm />} />
            <Route path="edit-venue-form/:venueId" element={<EditVenue />} /> {/* <- bu o'zgaradi */}
            <Route path="bookings" element={<OwnerBookingList />} />
            <Route path="profile" element={<OwnerProfileEdit />} />
          </Route>

          {/* Admin panel */}
          <Route
            path="/admin-panel/*"
            element={
              <PrivateRoute roles={['admin']}>
                <AdminPanel />
              </PrivateRoute>
            }
          />

          {/* User sahifalari */}
          <Route path="/user/venues" element={<UserVenueList />} />
          <Route path="/user/venues/:hallId" element={<VenueDetails />} />
          <Route path="/user/book/:id" element={<UserBookingForm />} />

          {/* User Booking ro‘yxati */}
          <Route
            path="/user/bookings"
            element={
              <PrivateRoute roles={['user']}>
                <UserBookingList />
              </PrivateRoute>
            }
          />
        </Routes>

        {showFooter && <Footer />}
      </div>
    </>
  );
}

export default Layout;
