// src/pages/admin/AddDoctor.jsx
"use client";

import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useTheme } from '../../contexts/ThemeContexts'; // Pastikan path benar
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate untuk navigasi

const AddDoctor = () => {
  const { theme } = useTheme();
  const navigate = useNavigate(); // Hook untuk navigasi

  // State untuk menyimpan data formulir dokter baru
  const [newDoctor, setNewDoctor] = useState({
    name: '',
    specialization: '',
    contactEmail: '',
    contactPhone: '',
    schedule: '',
    experience: '',
    password: '', // Kata sandi awal untuk login dokter
    status: 'Aktif', // Default status aktif
  });

  const [message, setMessage] = useState({ type: '', text: '' }); // State untuk pesan sukses/error
  const [submitting, setSubmitting] = useState(false); // State untuk indikator loading submit

  // Handle perubahan input form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewDoctor(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Handle submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage({ type: '', text: '' }); // Reset pesan

    // Validasi sederhana
    if (!newDoctor.name || !newDoctor.specialization || !newDoctor.contactEmail || !newDoctor.password) {
      setMessage({ type: 'danger', text: 'Nama, Spesialisasi, Email, dan Kata Sandi harus diisi.' });
      setSubmitting(false);
      return;
    }

    // Simulasi sukses untuk demo
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log("Data dokter baru yang akan dikirim:", newDoctor);
    setMessage({ type: 'success', text: 'Dokter berhasil ditambahkan (simulasi)!' });
    setNewDoctor({ // Reset form setelah sukses
      name: '', specialization: '', contactEmail: '', contactPhone: '',
      schedule: '', experience: '', password: '', status: 'Aktif'
    });
    setSubmitting(false);
    // Redirect setelah simulasi sukses
    setTimeout(() => navigate('/admin/doctors'), 2000);
  };

  // Dynamic CSS Classes based on theme
  const mainBgClass = theme === 'dark' ? 'bg-dark' : 'bg-light';
  const mainTextColorClass = theme === 'dark' ? 'text-white' : 'text-dark';
  const cardBgClass = theme === 'dark' ? 'bg-secondary text-white border-secondary' : 'bg-white text-dark border-light';
  const formControlClass = theme === 'dark' ? 'bg-dark text-white border-secondary' : '';

  return (
    <Container fluid className={`py-4 px-lg-5 ${mainBgClass} ${mainTextColorClass}`} style={{ minHeight: 'calc(100vh - 56px)' }}>
      <Row className="mb-4 align-items-center">
        <Col>
          <h1 className={`mb-0 ${mainTextColorClass}`}>Tambah Dokter Baru <i className="bi bi-person-plus-fill"></i></h1>
          <p className={`lead mb-0 ${theme === 'dark' ? 'text-light' : 'text-muted'}`}>Isi detail dokter baru untuk ditambahkan ke sistem.</p>
        </Col>
        <Col xs="auto">
          <Button variant={theme === 'dark' ? 'outline-secondary' : 'secondary'} as={Link} to="/admin/doctors">
            <i className="bi bi-arrow-left-circle-fill me-2"></i>Kembali ke Daftar Dokter
          </Button>
        </Col>
      </Row>

      <Card className={`shadow-sm mb-4 ${cardBgClass}`}>
        <Card.Body>
          <Card.Title className={`h5 mb-4 ${mainTextColorClass}`}>Formulir Data Dokter</Card.Title>

          {message.text && (
            <Alert variant={message.type} className="mb-3">
              {message.text}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="formDoctorName">
                <Form.Label>Nama Lengkap Dokter <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Masukkan nama dokter"
                  name="name"
                  value={newDoctor.name}
                  onChange={handleChange}
                  required
                  className={formControlClass}
                />
              </Form.Group>

              <Form.Group as={Col} controlId="formSpecialization">
                <Form.Label>Spesialisasi <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Contoh: Kardiologi, Dermatologi"
                  name="specialization"
                  value={newDoctor.specialization}
                  onChange={handleChange}
                  required
                  className={formControlClass}
                />
              </Form.Group>
            </Row>

            <Row className="mb-3">
              <Form.Group as={Col} controlId="formContactEmail">
                <Form.Label>Email Kontak (untuk Login) <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Masukkan email dokter"
                  name="contactEmail"
                  value={newDoctor.contactEmail}
                  onChange={handleChange}
                  required
                  className={formControlClass}
                />
                <Form.Text className={theme === 'dark' ? 'text-light' : 'text-muted'}>
                  Email ini akan digunakan dokter untuk masuk ke sistem.
                </Form.Text>
              </Form.Group>

              <Form.Group as={Col} controlId="formContactPhone">
                <Form.Label>Nomor Telepon Kontak</Form.Label>
                <Form.Control
                  type="tel"
                  placeholder="Contoh: 081234567890"
                  name="contactPhone"
                  value={newDoctor.contactPhone}
                  onChange={handleChange}
                  className={formControlClass}
                />
              </Form.Group>
            </Row>

            <Row className="mb-3">
              <Form.Group as={Col} controlId="formSchedule">
                <Form.Label>Jadwal Praktik</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Contoh: Senin-Jumat 08:00-16:00"
                  name="schedule"
                  value={newDoctor.schedule}
                  onChange={handleChange}
                  className={formControlClass}
                />
              </Form.Group>

              <Form.Group as={Col} controlId="formExperience">
                <Form.Label>Pengalaman (Tahun)</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Contoh: 10 tahun"
                  name="experience"
                  value={newDoctor.experience}
                  onChange={handleChange}
                  className={formControlClass}
                />
              </Form.Group>
            </Row>

            <Row className="mb-4">
              <Form.Group as={Col} controlId="formPassword">
                <Form.Label>Kata Sandi Awal <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Atur kata sandi awal"
                  name="password"
                  value={newDoctor.password}
                  onChange={handleChange}
                  required
                  className={formControlClass}
                />
                <Form.Text className={theme === 'dark' ? 'text-light' : 'text-muted'}>
                  Dokter dapat mengubah kata sandi ini setelah login.
                </Form.Text>
              </Form.Group>

              <Form.Group as={Col} controlId="formStatus">
                <Form.Label>Status</Form.Label>
                <Form.Select
                  name="status"
                  value={newDoctor.status}
                  onChange={handleChange}
                  className={formControlClass}
                >
                  <option value="Aktif">Aktif</option>
                  <option value="Cuti">Cuti</option>
                  <option value="Tidak Aktif">Tidak Aktif</option>
                </Form.Select>
              </Form.Group>
            </Row>

            <Button
              variant={theme === 'dark' ? 'outline-success' : 'success'}
              type="submit"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Menambahkan...
                </>
              ) : (
                <>
                  <i className="bi bi-save-fill me-2"></i>Simpan Dokter
                </>
              )}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AddDoctor;
