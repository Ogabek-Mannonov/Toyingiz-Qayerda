import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import SidebarMenu from './components/SidebarMenu';  
import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signin';
import OwnerPanel from './owner/OwnerPanel';
import AdminPanel from './admin/AdminPanel';
import UserVenueList from './user/UserVenueList';
import UserBookingForm from './user/UserBookingForm'; 

function Layout() {
  const location = useLocation();

  // Hide header for these paths
  const hideHeaderPaths = [
    '/login', 
    '/signup', 
    '/owner-panel', 
    '/admin-panel', 
    '/admin-panel/venues', 
    '/admin-panel/createvenues', 
    '/admin-panel/owners', 
    '/admin-panel/createowners', 
    '/admin-panel/bookings', 
    '/admin-panel/createvenueowner'
  ];

  return (
    <>
      {/* Header faqat muayyan sahifalarda ko‘rsatiladi */}
      {!hideHeaderPaths.includes(location.pathname) && <Header />}

      <div className="app-container">
        <SidebarMenu />

        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/owner-panel/*" element={<OwnerPanel />} />
            <Route path="/admin-panel/*" element={<AdminPanel />} />
            <Route path="/user/venues" element={<UserVenueList />} /> 
            <Route path="/user/venues/:id" element={<UserBookingForm />} /> 
          </Routes>
        </div>
      </div>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}
