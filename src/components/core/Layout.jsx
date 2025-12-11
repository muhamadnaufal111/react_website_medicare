// src/components/Layout.jsx
import React from 'react';
import { useAuth } from '../../contexts/AuthContexts'; // Dikoreksi: AuthContext (tunggal)
import { useTheme } from '../../contexts/ThemeContexts'; // Dikoreksi: ThemeContext (tunggal)

// Impor komponen Navbar yang berbeda
import PublicNavbar from '../navigation/PublicNavbar';
import DoctorNavbar from '../navigation/DoctorNavbar';
import AdminNavbar from '../navigation/AdminNavbar';
import PatientNavbar from '../navigation/PatientNavbar';

/**
 * Komponen Layout untuk menyediakan struktur yang konsisten untuk aplikasi.
 * Ini secara dinamis merender Navbar yang sesuai berdasarkan peran pengguna
 * dan menerapkan tema saat ini ke latar belakang halaman dan warna teks.
 *
 * @param {object} props - Properti komponen.
 * @param {React.ReactNode} props.children - Komponen anak yang akan dirender di dalam layout.
 */
const Layout = ({ children }) => {
  const { user, loading } = useAuth(); // Dapatkan status pengguna dan loading dari AuthContext
  const { theme } = useTheme(); // Dapatkan tema dari ThemeContext

  /**
   * Merender Navbar yang sesuai berdasarkan peran pengguna yang terautentikasi.
   * Jika sedang loading, tidak ada Navbar yang dirender. Jika tidak ada pengguna yang login, PublicNavbar ditampilkan.
   *
   * @returns {React.ReactNode|null} Komponen Navbar atau null.
   */
  const renderNavbar = () => {
    if (loading) {
      return null; // Jangan render Navbar saat status autentikasi sedang loading
    }
    if (user) {
      // Render Navbar spesifik berdasarkan peran pengguna
      if (user.role === "admin") {
        return <AdminNavbar />;
      } else if (user.role === "patient") {
        return <PatientNavbar />;
      } else if (user.role === "doctor") {
        return <DoctorNavbar />;
      } else {
        // Fallback untuk pengguna yang login dengan peran yang tidak dikenali, atau jika peran belum diatur
        return <PublicNavbar />;
      }
    }
    // Render PublicNavbar jika tidak ada pengguna yang login
    return <PublicNavbar />;
  };

  return (
    // Div kontainer utama yang mengisi seluruh tinggi viewport dan menggunakan flexbox untuk tata letak
    // Menerapkan kelas tema gelap/terang berdasarkan status tema saat ini
    <div className={`d-flex flex-column min-vh-100 ${theme === 'dark' ? 'bg-dark text-white' : 'bg-light text-dark'}`}>
      {renderNavbar()} {/* Render Navbar dinamis */}
      {/* Area konten utama, mengambil sisa ruang vertikal yang tersedia */}
      <main className="flex-grow-1">
        {children} {/* Render komponen anak (misalnya, Rute) */}
      </main>
    </div>
  );
};

export default Layout;
