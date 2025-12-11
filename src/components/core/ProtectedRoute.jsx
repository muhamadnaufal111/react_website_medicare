// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContexts'; // DIPERBAIKI: AuthContext

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();

  // Tampilkan loading state jika otentikasi masih dalam proses
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // Jika tidak ada user (belum login), arahkan ke halaman masuk
  if (!user) {
    return <Navigate to="/masuk" replace />; // Arahkan ke /masuk, bukan /login
  }

  // Jika requiredRole ditentukan dan peran user tidak cocok, arahkan ke dashboard
  // atau halaman yang sesuai (misalnya, 403 Forbidden atau dashboard default)
  if (requiredRole) {
    // Jika requiredRole adalah array (misal: ["patient", "doctor"])
    if (Array.isArray(requiredRole)) {
      if (!requiredRole.includes(user.role)) {
        // Jika peran tidak diizinkan, arahkan ke dashboard yang sesuai dengan peran user
        if (user.role === 'admin') {
          return <Navigate to="/admin" replace />;
        } else {
          return <Navigate to="/dashboard" replace />;
        }
      }
    } else { // Jika requiredRole adalah string tunggal
      if (user.role !== requiredRole) {
        // Jika peran tidak diizinkan, arahkan ke dashboard yang sesuai dengan peran user
        if (user.role === 'admin') {
          return <Navigate to="/admin" replace />;
        } else {
          return <Navigate to="/dashboard" replace />;
        }
      }
    }
  }

  // Jika user sudah login dan memiliki peran yang sesuai, render children
  return children;
};

export default ProtectedRoute;
