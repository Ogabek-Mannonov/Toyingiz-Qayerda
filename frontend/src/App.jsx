import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signin';
import OwnerPanel from './owner/OwnerPanel';
import AdminPanel from './admin/AdminPanel';



function Layout() {
  const location = useLocation();

 const hideHeaderPaths = ['/login', '/signup', '/owner-panel', '/admin-panel', '/admin-panel/venues', '/admin-panel/createvenues', '/admin-panel/owners', '/admin-panel/createowners', '/admin-panel/bookings', '/admin-panel/createvenueowner' ];

  return (
    <>
      {!hideHeaderPaths.includes(location.pathname) && <Header />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/owner-panel/*" element={<OwnerPanel />} />
        <Route path="/admin-panel/*" element={<AdminPanel />} />
      </Routes>
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
