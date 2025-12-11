// src/pages/doctor/Appointments.jsx
"use client";

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContexts'; // Perbaikan: dari ThemeContexts menjadi ThemeContext
import { useAuth } from '../../contexts/AuthContexts'; // Tambahkan useAuth untuk filter

const DoctorAppointments = () => {
  const { theme } = useTheme();
  const { user } = useAuth(); // Dapatkan user dari AuthContext

  // Dummy data for upcoming appointments
  const [upcomingAppointments, setUpcomingAppointments] = useState([
    {
      id: 1,
      patientName: 'John Doe', // Tambahkan nama pasien
      doctor: 'Dr. Sarah Johnson',
      specialty: 'Kardiologi',
      date: 'Kamis, 25 Juli 2025', // Sesuaikan tanggal agar lebih relevan
      time: '10:00',
      reason: 'Pemeriksaan rutin',
      location: 'Ruang 201',
      notes: 'Bawa hasil lab terbaru',
      status: 'Mendatang'
    },
    {
      id: 2,
      patientName: 'Jane Smith', // Tambahkan nama pasien
      doctor: 'Dr. Michael Chen',
      specialty: 'Dermatologi',
      date: 'Selasa, 30 Juli 2025',
      time: '14:30',
      reason: 'Konsultasi kulit',
      location: 'Ruang 105',
      notes: 'Catatan: Konsultasi lanjutan',
      status: 'Mendatang'
    },
    {
      id: 5, // Contoh janji temu untuk dokter yang login
      patientName: 'Alice Brown',
      doctor: 'Dr. Smith', // Asumsi dokter yang login adalah Dr. Smith
      specialty: 'Umum',
      date: 'Rabu, 24 Juli 2025',
      time: '09:00',
      reason: 'Check-up',
      location: 'Ruang 101',
      notes: 'Pasien baru',
      status: 'Mendatang'
    }
  ]);

  // Dummy data for past appointments
  const [pastAppointments, setPastAppointments] = useState([
    {
      id: 3,
      patientName: 'Bob Johnson', // Tambahkan nama pasien
      doctor: 'Dr. Emily Davis',
      specialty: 'Dokter Umum',
      date: 'Senin, 15 Juli 2025',
      time: '09:00',
      reason: 'Pemeriksaan fisik tahunan',
      location: 'Ruang 301',
      status: 'Selesai'
    },
    {
      id: 4,
      patientName: 'Charlie White', // Tambahkan nama pasien
      doctor: 'Dr. Robert Wilson',
      specialty: 'Ortopedi',
      date: 'Rabu, 10 Juli 2025',
      time: '11:30',
      reason: 'Nyeri lutut',
      location: 'Ruang 205',
      status: 'Selesai'
    },
    {
      id: 6, // Contoh janji temu selesai untuk dokter yang login
      patientName: 'David Green',
      doctor: 'Dr. Smith', // Asumsi dokter yang login adalah Dr. Smith
      specialty: 'Umum',
      date: 'Senin, 22 Juli 2025',
      time: '14:00',
      reason: 'Konsultasi',
      location: 'Ruang 101',
      status: 'Selesai'
    }
  ]);

  // Filter appointments based on logged-in doctor
  useEffect(() => {
    if (user && user.role === 'doctor') {
      const doctorName = user.name || user.email; // Gunakan nama atau email dokter yang login
      const filteredUpcoming = upcomingAppointments.filter(app => app.doctor === doctorName);
      const filteredPast = pastAppointments.filter(app => app.doctor === doctorName);
      setUpcomingAppointments(filteredUpcoming);
      setPastAppointments(filteredPast);
    } else if (user && user.role === 'patient') {
        // Untuk pasien, Anda akan memfilter berdasarkan nama pasien
        // Misalnya: const patientName = user.name || user.email;
        // const filteredUpcoming = upcomingAppointments.filter(app => app.patientName === patientName);
        // const filteredPast = pastAppointments.filter(app => app.patientName === patientName);
        // setUpcomingAppointments(filteredUpcoming);
        // setPastAppointments(filteredPast);
    }
  }, [user]); // Jalankan efek ini saat user berubah

  // Function to handle appointment cancellation (dummy)
  const handleCancelAppointment = (id) => {
    setUpcomingAppointments(prev => prev.filter(app => app.id !== id));
    console.log(`Appointment ${id} cancelled.`);
  };

  return (
    <Container className={`py-5 ${theme === 'dark' ? 'text-white' : 'text-dark'}`}>
      <Row className="mb-4 align-items-center">
        <Col>
          <h1 className={`mb-0 ${theme === 'dark' ? 'text-white' : 'text-dark'}`}>Janji Temu Saya</h1>
          <p className="lead text-muted">Kelola janji temu mendatang dan riwayat kunjungan</p>
        </Col>
        <Col xs="auto">
          {/* Tombol Buat Janji Temu mungkin tidak relevan untuk dokter di sini,
              karena dokter biasanya tidak membuat janji temu untuk diri sendiri
              melainkan mengelola yang sudah ada. Jika ini untuk pasien, biarkan.
              Untuk dokter, ini bisa dihapus atau diubah menjadi "Kelola Jadwal"
              yang mengarah ke halaman Schedule.jsx
          */}
          {user && user.role === 'patient' && ( // Hanya tampilkan jika pasien
            <Button as={Link} to="/appointments/new" variant="primary">
              Buat Janji Temu
            </Button>
          )}
        </Col>
      </Row>

      {/* Janji Temu Mendatang */}
      <h2 className={`mb-3 ${theme === 'dark' ? 'text-white' : 'text-dark'}`}>Janji Temu Mendatang</h2>
      {upcomingAppointments.length > 0 ? (
        upcomingAppointments.map((appointment) => (
          <Card key={appointment.id} className={`mb-3 shadow-sm ${theme === 'dark' ? 'bg-dark text-white border-secondary' : 'bg-white text-dark border-light'}`}>
            <Card.Body>
              <Row className="align-items-center">
                <Col md={7}>
                  <div className="d-flex align-items-center mb-2">
                    <h5 className="mb-0">{appointment.doctor} <span className="badge bg-secondary ms-2">{appointment.specialty}</span></h5>
                  </div>
                  <p className="mb-1">Pasien: {appointment.patientName}</p> {/* Tampilkan nama pasien */}
                  <p className="mb-1">Tanggal: {appointment.date}</p>
                  <p className="mb-1">Alasan: {appointment.reason}</p>
                  <p className="mb-1">Lokasi: {appointment.location}</p>
                  {appointment.notes && <p className="mb-0 text-muted"><small>Catatan: {appointment.notes}</small></p>}
                </Col>
                <Col md={5} className="text-md-end mt-3 mt-md-0">
                  <p className="mb-1">Waktu: {appointment.time}</p>
                  <span className={`badge ${appointment.status === 'Mendatang' ? 'bg-primary' : 'bg-success'} me-2`}>
                    {appointment.status}
                  </span>
                  {user && user.role === 'doctor' && ( // Hanya tampilkan untuk dokter
                    <>
                      <Button variant="outline-primary" size="sm" className="me-2">Ubah Jadwal</Button>
                      <Button variant="outline-danger" size="sm" onClick={() => handleCancelAppointment(appointment.id)}>Batalkan</Button>
                    </>
                  )}
                </Col>
              </Row>
            </Card.Body>
          </Card>
        ))
      ) : (
        <Alert variant={theme === 'dark' ? 'secondary' : 'info'}>Tidak ada janji temu mendatang.</Alert>
      )}

      {/* Riwayat Janji Temu */}
      <h2 className={`mt-5 mb-3 ${theme === 'dark' ? 'text-white' : 'text-dark'}`}>Riwayat Janji Temu</h2>
      {pastAppointments.length > 0 ? (
        pastAppointments.map((appointment) => (
          <Card key={appointment.id} className={`mb-3 shadow-sm ${theme === 'dark' ? 'bg-dark text-white border-secondary' : 'bg-white text-dark border-light'}`}>
            <Card.Body>
              <Row className="align-items-center">
                <Col md={7}>
                  <div className="d-flex align-items-center mb-2">
                    <h5 className="mb-0">{appointment.doctor} <span className="badge bg-secondary ms-2">{appointment.specialty}</span></h5>
                  </div>
                  <p className="mb-1">Pasien: {appointment.patientName}</p> {/* Tampilkan nama pasien */}
                  <p className="mb-1">Tanggal: {appointment.date}</p>
                  <p className="mb-1">Alasan: {appointment.reason}</p>
                  <p className="mb-1">Lokasi: {appointment.location}</p>
                </Col>
                <Col md={5} className="text-md-end mt-3 mt-md-0">
                  <p className="mb-1">Waktu: {appointment.time}</p>
                  <span className={`badge ${appointment.status === 'Selesai' ? 'bg-success' : 'bg-danger'} me-2`}>
                    {appointment.status}
                  </span>
                  {user && user.role === 'doctor' && ( // Hanya tampilkan untuk dokter
                    <Button variant="outline-info" size="sm">Lihat Detail</Button>
                  )}
                </Col>
              </Row>
            </Card.Body>
          </Card>
        ))
      ) : (
        <Alert variant={theme === 'dark' ? 'secondary' : 'info'}>Tidak ada riwayat janji temu.</Alert>
      )}
    </Container>
  );
};

export default DoctorAppointments; // Ubah nama export
