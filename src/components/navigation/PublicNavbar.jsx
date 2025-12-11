// src/components/PublicNavbar.jsx
"use client";
import { Navbar as BSNavbar, Nav, Container, Button } from "react-bootstrap";
import { useAuth } from "../../contexts/AuthContexts";
import { useTheme } from "../../contexts/ThemeContexts";
import { Link } from "react-router-dom";

const PublicNavbar = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <BSNavbar
      bg={theme === "dark" ? "dark" : "info"}
      variant="dark"
      expand="lg"
      className="shadow-sm"
    >
      <Container>
        <BSNavbar.Brand as={Link} to="/">
          <i className="bi bi-heart-pulse-fill me-2"></i>
          MediCare
        </BSNavbar.Brand>

        <BSNavbar.Toggle aria-controls="basic-navbar-nav" />

        <BSNavbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {/* Nav.Link untuk toggle tema */}
            <Nav.Link onClick={toggleTheme} className="me-2">
              <i className={`bi bi-${theme === "light" ? "moon-fill" : "sun-fill"}`}></i>
            </Nav.Link>

            {!user ? (
              <>
                {/* Tombol Masuk yang lebih kecil */}
                <Button
                  as={Link}
                  to="/masuk"
                  variant={theme === 'dark' ? 'info' : 'info'}
                  // Mengurangi padding untuk membuat tombol lebih kecil
                  className={`rounded-pill px-2 py-0.5 fw-bold me-2 ${theme === 'dark' ? 'text-dark' : 'text-white'}`}
                >
                  Masuk
                </Button>
                {/* Tombol Daftar sebagai outline, juga lebih kecil dan tautan diperbaiki */}
                <Button
                  as={Link}
                  to="/masuk"
                  variant={theme === 'dark' ? 'info' : 'info'}
                  // Mengurangi padding untuk membuat tombol lebih kecil
                  className={`rounded-pill px-2 py-0.5 fw-bold me-2 ${theme === 'dark' ? 'text-dark' : 'text-white'}`}
                >
                  Daftar
                </Button>
              </>
            ) : (
              null // Tidak menampilkan tombol jika user sudah login
            )}
          </Nav>
        </BSNavbar.Collapse>
      </Container>
    </BSNavbar>
  );
};

export default PublicNavbar;
