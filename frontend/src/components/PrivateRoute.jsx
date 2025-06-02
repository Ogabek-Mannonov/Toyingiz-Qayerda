// src/components/PrivateRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

export default function PrivateRoute({ children, roles }) {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');

  if (!token) {
    // Agar token bo'lmasa, login sahifasiga yo'naltirish
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(userRole)) {
    // Agar foydalanuvchi roli kerakli ro'llar orasida bo'lmasa, asosiy sahifaga yo'naltirish
    return <Navigate to="/login" replace />;
  }

  // Hammasi to'g'ri bo'lsa, child komponentni render qilish
  return children;
}
