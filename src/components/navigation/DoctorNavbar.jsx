// src/components/DoctorNavbar.jsx
"use client"

import { Navbar, Nav, Container, Button, Dropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContexts';
import { useTheme } from '../../contexts/ThemeContexts';
import { useEffect } from 'react';

const DoctorNavbar = () => { // Nama komponen diubah dari LoggedInNavbar menjadi DoctorNavbar
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/masuk');
    } catch (error) {
      console.error('Gagal logout:', error);
      // Handle error, e.g., show a message
    }
  };

  useEffect(() => {
    // Apply theme to body
    document.body.className = theme === 'dark' ? 'bg-dark text-white' : 'bg-light text-dark';
  }, [theme]);

  // Determine the default dashboard link based on user role
  // This navbar is now primarily for Doctors or other non-admin/non-patient roles
  const defaultDashboardLink = user?.role === 'doctor' ? '/dokter/dashboard' : '/';

  return (
    <Navbar
      expand="lg"
      className={`${theme === 'dark' ? 'bg-dark navbar-dark border-bottom border-secondary' : 'bg-white navbar-light shadow-sm'}`}
      sticky="top"
    >
      <Container>
        <Navbar.Brand as={Link} to={defaultDashboardLink} className="fw-bold fs-4">
          <i className="bi bi-heart-pulse-fill me-2 text-primary"></i>
          MediCare
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {/* Links for general logged-in users (e.g., Doctors) */}
            {user?.role === 'doctor' && (
              <>
                <Nav.Link as={Link} to="/dokter/dashboard">Dashboard</Nav.Link>
                <Nav.Link as={Link} to="/dokter/resep">Resep</Nav.Link>
                <Nav.Link as={Link} to="/dokter/jadwal">Jadwal</Nav.Link>
                <Nav.Link as={Link} to="/dokter/pasien">Pasien Saya</Nav.Link>
              </>
            )}
          </Nav>
          <Nav>
            <Dropdown align="end">
              <Dropdown.Toggle variant="link" id="dropdown-basic" className={`nav-link ${theme === 'dark' ? 'text-white' : 'text-dark'}`}>
                <i className="bi bi-person-circle me-2"></i>
                {user?.name || user?.email || 'Pengguna'}
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
    </Navbar>
  );
};

export default DoctorNavbar; // Export diubah dari LoggedInNavbar menjadi DoctorNavbar
