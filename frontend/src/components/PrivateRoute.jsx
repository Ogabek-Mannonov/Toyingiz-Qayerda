import React from 'react';
import { Navigate, useLocation, matchPath } from 'react-router-dom';

export default function PrivateRoute({ children, roles }) {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');
  const location = useLocation();

  // Faqat token bo‘lmasa ham ochilishi mumkin bo‘lgan route’lar
  const publicRoutes = ['/user/venues', '/user/venues/:id'];

  const isPublicRoute = publicRoutes.some((route) =>
    matchPath({ path: route, end: false }, location.pathname)
  );

  // Token bo'lmasa va route public bo'lmasa → login sahifasiga
  if (!token && !isPublicRoute) {
    return <Navigate to="/login" replace />;
  }

  // Ruxsat etilmagan rol bo‘lsa → bosh sahifaga
  if (roles && !roles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  // Barcha holatlar normal bo‘lsa → sahifani ko‘rsat
  return children;
}
