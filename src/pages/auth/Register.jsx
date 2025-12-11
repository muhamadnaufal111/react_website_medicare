"use client";
import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContexts';
import { useTheme } from '../../contexts/ThemeContexts';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // <-- ini tambahan!
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const brandColor = "#00bfa5";

  useEffect(() => {
    AOS.init({
      duration: 900,
      once: true,
      easing: 'ease-in-out',
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    if (!name || !email || !password) {
      setError('Mohon isi semua kolom.');
      setLoading(false);
      return;
    }
    if (password.length < 6) {
      setError('Password minimal 6 karakter.');
      setLoading(false);
      return;
    }
    const result = await register({ name, email, password, role: "patient" });
    if (result.success) {
      setLoading(false);
      alert('Pendaftaran berhasil! Silakan login.');
      navigate('/masuk');
    } else {
      setError(result.message || 'Registrasi gagal.');
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        minWidth: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: theme === 'dark'
          ? 'linear-gradient(135deg, #22344c 0%, #001f28 90%)'
          : 'linear-gradient(120deg, #e0f7fa 0%, #e3f2fd 50%, #fafdff 100%)',
      }}
    >
      <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
        <Card
          data-aos="flip-left"
          className={`shadow-lg border-0 glass-card ${theme === 'dark' ? 'text-light' : 'text-dark'}`}
          style={{
            maxWidth: 400,
            width: '96vw',
            borderRadius: 22,
            background: theme === 'dark'
              ? 'rgba(16,28,38,0.88)'
              : 'rgba(255,255,255,0.95)',
            boxShadow: theme === 'dark'
              ? '0 8px 32px #15e0ffe3, 0 2px 0 #00bfa516'
              : '0 6px 24px #0dbfe611, 0 2px 6px #8deeea11',
            backdropFilter: 'blur(18px)',
          }}
        >
          <Card.Body className="p-4">
            <div className="text-center mb-2" data-aos="fade-down">
              <h3 className="fw-bold mb-1" style={{ color: brandColor, fontFamily: 'Poppins, Nunito, sans-serif', letterSpacing: '.2rem' }}>
                Daftar Medi<em style={{ fontStyle:'normal',color:'#22e4cb' }}>Care</em>
              </h3>
              <div
                style={{
                  color: brandColor,
                  fontSize: 13,
                  fontWeight: 500,
                  marginBottom: 2,
                  letterSpacing: '.02em'
                }}
              >
                Mulai perjalanan kesehatan Anda
              </div>
            </div>

            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleSubmit} data-aos="fade-up">
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold" style={{ fontSize: 15 }}>Nama Lengkap</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Nama Anda"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="rounded-3 input-ani"
                  style={theme === 'dark' 
                    ? { background: '#18313e', color: '#eef', border: '1.2px solid #20bfa7', }
                    : { background: '#f4ffff', border: '1.2px solid #cce9e2' }
                  }
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold" style={{ fontSize: 15 }}>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="contoh@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="rounded-3 input-ani"
                  style={theme === 'dark' 
                    ? { background: '#18313e', color: '#eef', border: '1.2px solid #20bfa7', }
                    : { background: '#f4ffff', border: '1.2px solid #cce9e2' }
                  }
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold" style={{ fontSize: 15 }}>Password</Form.Label>
                <div style={{ position: 'relative' }}>
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    placeholder="Minimal 6 karakter"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="rounded-3 input-ani"
                    style={theme === 'dark'
                      ? { background: '#18313e', color: '#eef', border: '1.2px solid #20bfa7', paddingRight: 40 }
                      : { background: '#f4ffff', border: '1.2px solid #cce9e2', paddingRight: 40 }
                    }
                  />
                  <span
                    style={{
                      position: 'absolute',
                      top: '50%',
                      right: 14,
                      transform: 'translateY(-50%)',
                      cursor: 'pointer',
                      color: '#111',
                      opacity: 0.77,
                      zIndex: 10,
                      fontSize: 19,
                    }}
                    onClick={() => setShowPassword(v => !v)}
                    tabIndex={0}
                    aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                  >
                    {showPassword
                      ? <FaEyeSlash style={{ color: '#111' }} />
                      : <FaEye style={{ color: '#111' }} />}
                  </span>
                </div>
              </Form.Group>

              <Button
                type="submit"
                disabled={loading}
                className="w-100 rounded-3 fw-bold shadow-sm ani-btn-login"
                style={{
                  backgroundColor: brandColor,
                  border: 'none',
                  fontSize: 16,
                  letterSpacing: '.015em'
                }}
              >
                {loading ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className="me-2"
                    />
                    Loading...
                  </>
                ) : (
                  'Daftar'
                )}
              </Button>
            </Form>

            <div className="text-center mt-3">
              <Link to="/masuk" style={{
                color: brandColor,
                fontWeight: 600,
                textDecoration: 'none',
                fontSize: 15
              }} className="ani-link">
                Sudah punya akun? Masuk &rarr;
              </Link>
            </div>
          </Card.Body>
        </Card>
      </Container>
      {/* --- Animasi CSS & extra style --- */}
      <style>{`
        .glass-card {
          backdrop-filter: blur(12px) saturate(135%);
        }
        .input-ani:focus {
          border-color: #14ddb9 !important;
          box-shadow: 0 4px 24px #00bfa52b;
          transition: .16s;
        }
        .ani-btn-login:active, .ani-btn-login:focus {
          background:#14ddb9 !important;
        }
        .ani-btn-login:hover {
          filter:brightness(1.08) drop-shadow(0 6px 19px #00bfa53a);
          background:#00d7b9!important;
          color: #fff;
        }
        .ani-link:hover {
          color: #148b74 !important;
          text-decoration: underline;
        }
        @media (max-width:480px) {
          .glass-card {
            box-shadow: 0 4px 22px #18ecec24;
            border-radius: 13px;
          }
          .p-4 { padding: 1.2rem!important;}
        }
      `}</style>
    </div>
  );
};

export default Register;