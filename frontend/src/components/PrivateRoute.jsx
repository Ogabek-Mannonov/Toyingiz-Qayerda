import React from 'react';
import { Navigate } from 'react-router-dom';

export default function PrivateRoute({ children, roles }) {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');

  if (!token) {
    // Token bo'lmasa login sahifasiga yo'naltir
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(userRole)) {
    // Rollar mos kelmasa bosh sahifaga yoki xatolik sahifasiga yo'naltir
    return <Navigate to="/" replace />;
  }

  // Hammasi joyida, sahifani ko'rsat
  return children;
}
