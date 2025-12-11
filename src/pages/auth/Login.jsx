"use client";
import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContexts';
import { useTheme } from '../../contexts/ThemeContexts';
import { FaHeartbeat, FaEye, FaEyeSlash } from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // <-- TAMBAHKAN INI
  const [error, setError] = useState('');
  const { login, loading: authLoading } = useAuth();
  const { theme } = useTheme();

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
    if (!email || !password) {
      setError('Email dan password harus diisi.');
      return;
    }
    const result = await login(email, password);
    if (!result.success) {
      setError(result.message || 'Login gagal. Silakan coba lagi.');
    }
  };

  const isLoading = authLoading;
  const brandColor = "#00bfa5"; // turquoise

  return (
    <div
      style={{
        minHeight: '100vh',
        minWidth: '100vw',
        background: theme === 'dark'
          ? 'linear-gradient(135deg, #22344c 0%, #001f28 90%)'
          : 'linear-gradient(120deg, #e0f7fa 0%, #e3f2fd 50%, #fafdff 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Container className="login-page-container d-flex align-items-center justify-content-center" style={{ minHeight:'100vh' }}>
        <Card
          data-aos="zoom-in"
          className={`shadow-lg border-0 glass-card ${theme === 'dark' ? 'text-light' : 'text-dark'}`}
          style={{
            maxWidth: 400,
            width: '96vw',
            borderRadius: 22,
            margin: '0 auto',
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
            {/* ---- Logo + Header ---- */}
            <div className="text-center mb-2" data-aos="fade-down">
              <span className="heartbeat-ani">
                <FaHeartbeat color={brandColor} size={38} />
              </span>
              <h3 className="fw-bold mt-1 mb-0" style={{ color: brandColor, fontFamily:'Poppins, Nunito, sans-serif', letterSpacing:'.2rem' }}>
                Medi<em style={{fontStyle:'normal',color:'#22e4cb'}}>Care</em>
              </h3>
              <span
                style={{
                  color: brandColor,
                  fontSize: 13,
                  fontWeight: 500,
                  marginBottom: 2,
                  letterSpacing: '.02em'
                }}
              >Login Platform Kesehatan</span>
              <div className="mb-3 mt-2" style={{fontSize:13, color: theme==='dark' ? '#89f6ed':'#3fa39f'}}>
                Sembuh lebih cepat bersama MediCare
              </div>
            </div>

            {/* ---- Error Alert ---- */}
            {error && <Alert variant="danger" className="py-2 mb-2">{error}</Alert>}

            {/* ---- Form Login ---- */}
            <Form onSubmit={handleSubmit} data-aos="fade-up">
              <Form.Group className="mb-3">
                <Form.Label className="mb-1 fw-semibold" style={{fontSize:15}}>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Masukkan email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  className="rounded-3 input-ani"
                  style={theme === 'dark'
                    ? { background: '#18313e', color: '#eef', border: '1.2px solid #20bfa7', }
                    : { background: '#f4ffff', border: '1.2px solid #cce9e2' }
                  }
                />
              </Form.Group>

              {/* --- Password field dengan tombol mata --- */}
              <Form.Group className="mb-3">
                <Form.Label className="mb-1 fw-semibold" style={{fontSize:15}}>Password</Form.Label>
                <div style={{ position: 'relative' }}>
                  <Form.Control
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Masukkan password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
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
                disabled={isLoading}
                className="w-100 rounded-3 fw-bold shadow-sm ani-btn-login"
                style={{
                  background: isLoading
                    ? "#76fff1"
                    : brandColor,
                  border: "none",
                  color: "#fff",
                  fontSize: 16,
                  letterSpacing: ".03em",
                  transition: '.15s'
                }}
              >
                {isLoading ? (
                  <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                ) : (
                  <>
                    <i className="bi bi-box-arrow-in-right me-1"></i> Masuk
                  </>
                )}
              </Button>

              <div className="text-center mt-3">
                <Link
                  to="/daftar"
                  style={{
                    color: brandColor,
                    fontWeight: 600,
                    textDecoration: 'none',
                    fontSize: 15
                  }}
                  className="ani-link"
                >
                  <span>Daftar sebagai pasien baru</span> <i className="bi bi-arrow-right ms-1"></i>
                </Link>
              </div>
            </Form>

            {/* Info/bantuan: */}
            <div className="text-center mt-4">
              <small style={{ color: brandColor, letterSpacing: ".01em" }}>
                Butuh bantuan? <b>Hubungi layanan pelanggan 24/7</b>
              </small>
            </div>
          </Card.Body>
        </Card>
      </Container>
      {/* --- Animasi CSS & extra style --- */}
      <style>{`
        .glass-card {
          backdrop-filter: blur(12px) saturate(135%);
        }
        .heartbeat-ani {
          display:inline-block;
          animation: beat 1.2s infinite cubic-bezier(.55,.06,.68,.19);
          transform-origin: 55% 60%;
        }
        @keyframes beat {
          0%,90%,100% {transform:scale(1);}
          25% {transform:scale(1.10);}
          60% {transform:scale(0.93);}
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
          background:#00d7b9;
          color: #fff;
        }
        .ani-link:hover {
          color: #148b74 !important;
          text-decoration: underline;
        }
        .login-page-container {
          min-height: 100vh;
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

export default Login;