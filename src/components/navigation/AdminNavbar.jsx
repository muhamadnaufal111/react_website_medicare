// src/components/AdminNavbar.jsx
"use client"
import { Navbar as BSNavbar, Nav, NavDropdown, Container, Button } from "react-bootstrap"
import { useAuth } from "../../contexts/AuthContexts"
import { useTheme } from "../../contexts/ThemeContexts"
import { useNavigate, Link } from "react-router-dom"

const AdminNavbar = () => {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/masuk") // Arahkan ke halaman masuk setelah logout
  }

  if (!user || user.role !== "admin") {
    return null; // Hanya render jika user adalah admin
  }

  // Tentukan tinggi navbar Bootstrap default, sekitar 56px.
  // Kita bisa menggunakan nilai yang sedikit lebih besar untuk memastikan konten tidak tertutup.
  const navbarHeight = '70px'; // Sesuaikan jika navbar Anda memiliki tinggi yang berbeda

  return (
    // Menggunakan React.Fragment atau shorthand <>...</> untuk mengembalikan beberapa elemen
    <>
      <BSNavbar
        fixed="top"
        bg={theme === "dark" ? "dark" : "light"}
        variant={theme}
        expand="lg"
        className="shadow-sm"
        style={{ zIndex: 1050 }} // <--- Tambahkan inline style ini untuk z-index yang lebih tinggi
      >
        <Container>
          <BSNavbar.Brand as={Link} to="/admin" className="fw-bold fs-4">
            <i className="bi bi-heart-pulse-fill me-2 text-primary"></i>
            MediCare
          </BSNavbar.Brand>

          <BSNavbar.Toggle aria-controls="basic-navbar-nav" />

          <BSNavbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link as={Link} to="/admin">
                Dashboard Admin
              </Nav.Link>
              <Nav.Link as={Link} to="/admin/patients"> {/* Mengelola Pasien */}
                Pasien
              </Nav.Link>
              <Nav.Link as={Link} to="/admin/doctors"> {/* Mengelola Dokter */}
                Dokter
              </Nav.Link>
              <Nav.Link as={Link} to="/admin/appointments"> {/* Mengelola Janji Temu */}
                Janji Temu
              </Nav.Link>
              <Nav.Link as={Link} to="/admin/medicines"> {/* Mengelola Obat-obatan */}
                Obat-obatan
              </Nav.Link>

              {/* Tombol Tema */}
              <Button variant="outline-black" size="sm" onClick={toggleTheme} className="me-2 ms-lg-3">
                <i className={`bi bi-${theme === "light" ? "moon" : "sun"}`}></i>
              </Button>

              {/* Dropdown User (Admin) */}
              <NavDropdown
                title={
                  <>
                    <i className="bi bi-person-circle me-1"></i>
                    {user.name || user.email}
                  </>
                }
                id="admin-user-dropdown"
                align="end"
              >
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>
                  <i className="bi bi-box-arrow-right me-2"></i>
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </BSNavbar.Collapse>
        </Container>
      </BSNavbar>
      {/* Spacer div untuk mendorong konten ke bawah agar tidak tertutup navbar */}
      <div style={{ height: navbarHeight }}></div>
    </>
  )
}

export default AdminNavbar
