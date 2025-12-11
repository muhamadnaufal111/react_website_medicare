// src/components/PatientNavbar.jsx
"use client"

import { Navbar, Nav, Container, Button, Dropdown } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContexts'; // Pastikan path ini benar
import { useTheme } from '../../contexts/ThemeContexts'; // Pastikan path ini benar
import { useEffect } from 'react';

const PatientNavbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation(); // Untuk mengetahui rute aktif

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/masuk');
    } catch (error) {
      console.error('Gagal logout:', error);
      // Tangani error, misal tampilkan pesan
    }
  };

  useEffect(() => {
    // Terapkan tema ke body
    document.body.className = theme === 'dark' ? 'bg-dark text-white' : 'bg-light text-dark';
  }, [theme]);

  // Fungsi untuk menentukan apakah link aktif
  const isActive = (path) => location.pathname === path;

  return (
    <Navbar
      expand="lg"
      className={`${theme === 'dark' ? 'bg-dark navbar-dark border-bottom border-secondary' : 'bg-white navbar-light shadow-sm'}`}
      sticky="top"
    >
      <Container>
        <Navbar.Brand as={Link} to="/dashboard" className="fw-bold fs-4">
          <i className="bi bi-heart-pulse-fill me-2 text-primary"></i>
          MediCare
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {/* Navigasi utama dengan garis bawah untuk link aktif */}
            <Nav.Link
              as={Link}
              to="/dashboard"
              className={isActive('/dashboard') ? 'active-nav-link' : ''}
              style={{
                color: isActive('/dashboard') ? '#007bff' : (theme === 'dark' ? 'white' : 'inherit'),
                fontWeight: isActive('/dashboard') ? 'bold' : 'normal',
                position: 'relative', // Diperlukan untuk pseudo-element
              }}
            >
              Dashboard
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/pasien/janji-temu"
              className={isActive('/pasien/janji-temu') ? 'active-nav-link' : ''}
              style={{
                color: isActive('/pasien/janji-temu') ? '#007bff' : (theme === 'dark' ? 'white' : 'inherit'),
                fontWeight: isActive('/pasien/janji-temu') ? 'bold' : 'normal',
                position: 'relative',
              }}
            >
              Janji Temu
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/pasien/resep"
              className={isActive('/pasien/resep') ? 'active-nav-link' : ''}
              style={{
                color: isActive('/pasien/resep') ? '#007bff' : (theme === 'dark' ? 'white' : 'inherit'),
                fontWeight: isActive('/pasien/resep') ? 'bold' : 'normal',
                position: 'relative',
              }}
            >
              Resep
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/medicines"
              className={isActive('/medicines') ? 'active-nav-link' : ''}
              style={{
                color: isActive('/medicines') ? '#007bff' : (theme === 'dark' ? 'white' : 'inherit'),
                fontWeight: isActive('/medicines') ? 'bold' : 'normal',
                position: 'relative',
              }}
            >
              Katalog Obat
            </Nav.Link>
          </Nav>
          <Nav>
            <Dropdown align="end">
              <Dropdown.Toggle variant="link" id="dropdown-basic" className={`nav-link ${theme === 'dark' ? 'text-white' : 'text-dark'}`}>
                <i className="bi bi-person-circle me-2"></i>
                {user?.name || user?.email || 'Pasien'}
              </Dropdown.Toggle>

              <Dropdown.Menu className={theme === 'dark' ? 'dropdown-menu-dark bg-dark' : ''}>
                <Dropdown.Item as={Link} to="/profil">
                  <i className="bi bi-person me-2"></i>Profil Saya
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={toggleTheme}>
                  <i className={`bi bi-${theme === 'dark' ? 'sun' : 'moon'} me-2`}></i>
                  Mode {theme === 'dark' ? 'Terang' : 'Gelap'}
                </Dropdown.Item>
                <Dropdown.Item onClick={handleLogout}>
                  <i className="bi bi-box-arrow-right me-2"></i>Keluar
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
      <style data-jsx="true">{`
        .active-nav-link::after {
          content: '';
          position: absolute;
          left: 0;
          right: 0;
          bottom: -8px; /* Sesuaikan posisi garis */
          height: 3px; /* Ketebalan garis */
          background-color: #007bff; /* Warna garis */
          border-radius: 2px; /* Sedikit lengkungan pada garis */
          transform: scaleX(1);
          transition: transform 0.3s ease-in-out;
        }
        .nav-link:not(.active-nav-link)::after {
          content: '';
          position: absolute;
          left: 0;
          right: 0;
          bottom: -8px;
          height: 3px;
          background-color: transparent;
          border-radius: 2px;
          transform: scaleX(0);
          transition: transform 0.3s ease-in-out;
        }
        .nav-link:hover::after {
          transform: scaleX(0.5); /* Garis muncul saat hover */
          background-color: rgba(0, 123, 255, 0.5); /* Warna garis saat hover */
        }
      `}</style>
    </Navbar>
  );
};

export default PatientNavbar;
