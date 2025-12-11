// src/pages/Schedule.jsx
"use client";

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Badge, Alert, Spinner } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContexts'; // Perbaikan typo: AuthContext (singular)
import { useTheme } from '../../contexts/ThemeContexts'; // Perbaikan typo: ThemeContext (singular)

const Schedule = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDoctorAppointments = async () => {
      setLoading(true);
      setError('');
      try {
        // Simulasi pengambilan data janji temu dari backend
        // Di aplikasi nyata, ini akan menjadi panggilan API ke Firestore/database
        await new Promise(resolve => setTimeout(resolve, 1000));

        if (user && user.role === 'doctor') {
          const dummyAppointments = [
            {
              id: 'appt1',
              patientName: 'Sarah Connor',
              date: '2025-07-25',
              time: '10:00 AM',
              status: 'pending', // pending, approved, rejected, completed
              reason: 'Pemeriksaan rutin',
            },
            {
              id: 'appt2',
              patientName: 'John Doe',
              date: '2025-07-25',
              time: '11:00 AM',
              status: 'approved',
              reason: 'Konsultasi pasca operasi',
            },
            {
              id: 'appt3',
              patientName: 'Jane Smith',
              date: '2025-07-26',
              time: '02:00 PM',
              status: 'pending',
              reason: 'Vaksinasi anak',
            },
            {
              id: 'appt4',
              patientName: 'Michael Brown',
              date: '2025-07-26',
              time: '03:00 PM',
              status: 'rejected',
              reason: 'Sakit kepala kronis',
            },
            {
              id: 'appt5',
              patientName: 'Emily White',
              date: '2025-07-27',
              time: '09:00 AM',
              status: 'completed',
              reason: 'Pemeriksaan lanjutan',
            },
          ];
          setAppointments(dummyAppointments);
        } else {
          setError('Akses ditolak. Hanya dokter yang dapat melihat jadwal ini.');
        }
      } catch (err) {
        console.error("Error fetching appointments:", err);
        setError('Gagal memuat jadwal janji temu.');
      } finally {
        setLoading(false);
      }
    };

    if (user) { // Only fetch if user data is available
        fetchDoctorAppointments();
    } else {
        setLoading(false);
        setError('Harap login sebagai dokter untuk melihat jadwal.');
    }
  }, [user]);

  const handleStatusChange = async (id, newStatus) => {
    setLoading(true);
    setError('');
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setAppointments(prevAppointments =>
        prevAppointments.map(appt =>
          appt.id === id ? { ...appt, status: newStatus } : appt
        )
      );
      console.log(`Janji temu ${id} berhasil diperbarui menjadi ${newStatus}.`); // Ganti alert
    } catch (err) {
      console.error("Error updating appointment status:", err);
      setError('Gagal memperbarui status janji temu.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'approved':
        return 'success';
      case 'rejected':
        return 'danger';
      case 'completed':
        return 'primary';
      default:
        return 'secondary';
    }
  };

  // Dynamic CSS Classes based on theme
  const mainBgClass = theme === 'dark' ? 'bg-dark' : 'bg-light';
  const mainTextColorClass = theme === 'dark' ? 'text-white' : 'text-dark';
  const cardBgClass = theme === 'dark' ? 'bg-secondary text-white border-secondary' : 'bg-white text-dark border-light';
  const cardTitleColorClass = theme === 'dark' ? 'text-info' : 'text-primary';
  const tableThemeClass = theme === 'dark' ? 'table-dark' : '';
  const alertVariantClass = theme === 'dark' ? 'secondary' : 'info';

  if (loading) {
    return (
      <Container fluid className={`d-flex justify-content-center align-items-center ${mainBgClass} ${mainTextColorClass}`} style={{ minHeight: 'calc(100vh - 56px)' }}>
        <Spinner animation="border" role="status" variant={theme === 'dark' ? 'light' : 'primary'}>
          <span className="visually-hidden">Memuat...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container fluid className={`py-5 ${mainBgClass} ${mainTextColorClass}`} style={{ minHeight: 'calc(100vh - 56px)' }}>
        <Alert variant="danger" className="mx-auto" style={{ maxWidth: '600px' }}>{error}</Alert>
      </Container>
    );
  }

  return (
    <Container fluid className={`py-4 px-lg-5 ${mainBgClass} ${mainTextColorClass}`} style={{ minHeight: 'calc(100vh - 56px)' }}>
      <Row className="mb-4 align-items-center">
        <Col>
          <h1 className={`mb-2 ${mainTextColorClass}`}>Jadwal Saya ({user?.name || user?.email}) <i className="bi bi-calendar-week-fill"></i></h1>
          <p className={`lead mb-0 ${theme === 'dark' ? 'text-light' : 'text-muted'}`}>Kelola janji temu pasien Anda secara efisien.</p>
        </Col>
      </Row>

      <Card className={`shadow-lg ${cardBgClass}`}>
        <Card.Header className={`${cardTitleColorClass} h4`}>
          Daftar Janji Temu <i className="bi bi-list-check"></i>
        </Card.Header>
        <Card.Body>
          {appointments.length === 0 ? (
            <Alert variant={alertVariantClass} className="text-center">Tidak ada janji temu yang tersedia.</Alert>
          ) : (
            <div className="table-responsive">
              <Table striped bordered hover className={`${tableThemeClass} mb-0`}>
                <thead>
                  <tr>
                    <th>Pasien</th>
                    <th>Tanggal</th>
                    <th>Waktu</th>
                    <th>Alasan</th>
                    <th>Status</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map(appt => (
                    <tr key={appt.id}>
                      <td>{appt.patientName}</td>
                      <td>{appt.date}</td>
                      <td>{appt.time}</td>
                      <td>{appt.reason}</td>
                      <td>
                        <Badge bg={getStatusVariant(appt.status)}>
                          {appt.status.charAt(0).toUpperCase() + appt.status.slice(1)}
                        </Badge>
                      </td>
                      <td>
                        {appt.status === 'pending' && (
                          <div className="d-flex gap-2">
                            <Button
                              variant={theme === 'dark' ? 'outline-success' : 'success'}
                              size="sm"
                              onClick={() => handleStatusChange(appt.id, 'approved')}
                            >
                              <i className="bi bi-check-circle-fill me-1"></i>Setujui
                            </Button>
                            <Button
                              variant={theme === 'dark' ? 'outline-danger' : 'danger'}
                              size="sm"
                              onClick={() => handleStatusChange(appt.id, 'rejected')}
                            >
                              <i className="bi bi-x-circle-fill me-1"></i>Tolak
                            </Button>
                          </div>
                        )}
                        {appt.status === 'approved' && (
                          <Button
                            variant={theme === 'dark' ? 'outline-primary' : 'primary'}
                            size="sm"
                            onClick={() => handleStatusChange(appt.id, 'completed')}
                          >
                            <i className="bi bi-check-all me-1"></i>Tandai Selesai
                          </Button>
                        )}
                        {/* Tidak ada aksi untuk status rejected atau completed */}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Schedule;
