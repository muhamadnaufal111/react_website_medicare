// src/pages/doctor/DoctorPrescriptions.jsx
"use client";

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Form, Alert, Modal, Badge, Spinner } from 'react-bootstrap'; // Import Spinner
import { useAuth } from '../../contexts/AuthContexts'; // Perbaikan path: AuthContext (singular)
import { useTheme } from '../../contexts/ThemeContexts'; // Import useTheme

const DoctorPrescriptions = () => {
  const { user } = useAuth();
  const { theme } = useTheme(); // Dapatkan tema dari context
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false); // Untuk modal tambah resep
  const [newPrescription, setNewPrescription] = useState({
    patientName: '',
    medicine: '',
    dosage: '',
    instructions: '',
    issuedDate: new Date().toISOString().split('T')[0], // Tanggal hari ini
    status: 'active', // Default status 'active'
  });

  // Dummy data pasien dan obat untuk dropdown
  const dummyPatients = [
    { id: 'p1', name: 'Sarah Connor' },
    { id: 'p2', name: 'John Doe' },
    { id: 'p3', name: 'Jane Smith' },
  ];
  const dummyMedicines = [
    { id: 'm1', name: 'Amoxicillin 500mg' },
    { id: 'm2', name: 'Paracetamol 500mg' },
    { id: 'm3', name: 'Ibuprofen 400mg' },
    { id: 'm4', name: 'Loratadine 10mg' },
  ];

  useEffect(() => {
    if (user && user.role === 'doctor') {
      fetchDoctorPrescriptions();
    } else {
      setLoading(false);
      setError('Akses ditolak. Hanya dokter yang dapat mengelola resep.');
    }
  }, [user]);

  const fetchDoctorPrescriptions = async () => {
    setLoading(true);
    setError('');
    try {
      // Simulasi pengambilan data resep dari backend untuk dokter yang login
      await new Promise(resolve => setTimeout(resolve, 1000));

      const dummyData = [
        {
          id: 'rx1',
          patientName: 'Sarah Connor',
          doctorName: 'Dr. Smith', // Asumsi dokter yang login adalah Dr. Smith
          medicine: 'Amoxicillin 500mg',
          dosage: '1 tablet, 3x sehari',
          instructions: 'Minum setelah makan',
          issuedDate: '2025-07-20',
          status: 'active',
        },
        {
          id: 'rx2',
          patientName: 'John Doe',
          doctorName: 'Dr. Smith',
          medicine: 'Paracetamol 500mg',
          dosage: '1 tablet, jika demam',
          instructions: 'Jangan melebihi 4 tablet dalam 24 jam',
          issuedDate: '2025-07-18',
          status: 'inactive',
        },
        {
          id: 'rx3',
          patientName: 'Jane Smith',
          doctorName: 'Dr. Smith',
          medicine: 'Ibuprofen 400mg',
          dosage: '1 tablet, 2x sehari',
          instructions: 'Minum setelah makan, jika nyeri',
          issuedDate: '2025-07-22',
          status: 'active',
        },
      ];

      // Filter resep yang dikeluarkan oleh dokter yang sedang login
      // Ganti 'Dr. Smith' dengan user.name atau user.email yang sebenarnya
      const doctorIdentifier = user.name || user.email;
      const filteredPrescriptions = dummyData.filter(rx => rx.doctorName === doctorIdentifier);
      setPrescriptions(filteredPrescriptions);
    } catch (err) {
      console.error("Error fetching prescriptions:", err);
      setError('Gagal memuat resep.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPrescription(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleAddPrescription = async (e) => {
    e.preventDefault();
    setError('');
    if (!newPrescription.patientName || !newPrescription.medicine || !newPrescription.dosage) {
      setError('Nama pasien, obat, dan dosis harus diisi.');
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const newRx = {
        ...newPrescription,
        id: `rx${prescriptions.length + 1}`, // ID dummy
        doctorName: user.name || user.email, // Dokter yang mengeluarkan resep
        issuedDate: new Date().toISOString().split('T')[0],
        status: 'active', // Resep baru defaultnya aktif
      };
      setPrescriptions(prev => [...prev, newRx]);
      setShowModal(false);
      setNewPrescription({ // Reset form
        patientName: '',
        medicine: '',
        dosage: '',
        instructions: '',
        issuedDate: new Date().toISOString().split('T')[0],
        status: 'active',
      });
      // Mengganti alert() dengan pesan di konsol atau modal kustom
      console.log('Resep berhasil ditambahkan!');
    } catch (err) {
      console.error("Error adding prescription:", err);
      setError('Gagal menambahkan resep.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    setLoading(true);
    setError('');
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setPrescriptions(prevPrescriptions =>
        prevPrescriptions.map(rx =>
          rx.id === id ? { ...rx, status: newStatus } : rx
        )
      );
      console.log(`Resep ${id} berhasil diubah status menjadi ${newStatus}.`);
    } catch (err) {
      console.error("Error updating prescription status:", err);
      setError('Gagal memperbarui status resep.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusVariant = (status) => {
    return status === 'active' ? 'success' : 'danger';
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" role="status" variant={theme === 'dark' ? 'light' : 'primary'}>
          <span className="visually-hidden">Memuat...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container fluid className={`py-4 ${theme === 'dark' ? 'text-white' : 'text-dark'}`}>
      <Row className="mb-4 align-items-center">
        <Col>
          <h1 className={`mb-0 ${theme === 'dark' ? 'text-white' : 'text-dark'}`}>Kelola Resep Medis</h1>
          <p className={`lead mb-0 ${theme === 'dark' ? 'text-light' : 'text-muted'}`}>Buat dan kelola resep untuk pasien Anda.</p>
        </Col>
        <Col xs="auto">
          <Button variant="primary" onClick={() => setShowModal(true)}>
            <i className="bi bi-plus me-2"></i>Tambah Resep Baru
          </Button>
        </Col>
      </Row>

      <Card className={`shadow-sm mb-4 ${theme === 'dark' ? 'bg-dark text-white border-secondary' : 'bg-white text-dark border-light'}`}>
        <Card.Body>
          <Card.Title className={`h5 mb-3 ${theme === 'dark' ? 'text-white' : 'text-dark'}`}>Daftar Resep</Card.Title>
          {prescriptions.length === 0 ? (
            <Alert variant={theme === 'dark' ? 'secondary' : 'info'}>Tidak ada resep yang tersedia.</Alert>
          ) : (
            <div className="table-responsive">
              <Table striped bordered hover variant={theme === 'dark' ? 'dark' : 'light'} className="mb-0">
                <thead>
                  <tr>
                    <th>Pasien</th>
                    <th>Dokter</th>
                    <th>Obat</th>
                    <th>Dosis</th>
                    <th>Instruksi</th>
                    <th>Tanggal Dikeluarkan</th>
                    <th>Status</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {prescriptions.map(rx => (
                    <tr key={rx.id}>
                      <td>{rx.patientName}</td>
                      <td>{rx.doctorName}</td>
                      <td>{rx.medicine}</td>
                      <td>{rx.dosage}</td>
                      <td>{rx.instructions}</td>
                      <td>{rx.issuedDate}</td>
                      <td>
                        <Badge bg={getStatusVariant(rx.status)}>
                          {rx.status.charAt(0).toUpperCase() + rx.status.slice(1)}
                        </Badge>
                      </td>
                      <td>
                        <Button
                          variant={rx.status === 'active' ? 'outline-danger' : 'outline-success'}
                          size="sm"
                          onClick={() => handleToggleStatus(rx.id, rx.status)}
                        >
                          {rx.status === 'active' ? 'Nonaktifkan' : 'Aktifkan'}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Modal Tambah Resep */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton className={theme === 'dark' ? 'bg-dark text-white border-secondary' : 'bg-light text-dark border-light'}>
          <Modal.Title>Tambah Resep Baru</Modal.Title>
        </Modal.Header>
        <Modal.Body className={theme === 'dark' ? 'bg-dark text-white border-secondary' : 'bg-white text-dark border-light'}>
          <Form onSubmit={handleAddPrescription}>
            <Form.Group className="mb-3">
              <Form.Label>Nama Pasien</Form.Label>
              <Form.Select
                name="patientName"
                value={newPrescription.patientName}
                onChange={handleInputChange}
                required
                className={theme === 'dark' ? 'bg-secondary text-white border-secondary' : ''}
              >
                <option value="">Pilih Pasien</option>
                {dummyPatients.map(patient => (
                  <option key={patient.id} value={patient.name}>{patient.name}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Obat</Form.Label>
              <Form.Select
                name="medicine"
                value={newPrescription.medicine}
                onChange={handleInputChange}
                required
                className={theme === 'dark' ? 'bg-secondary text-white border-secondary' : ''}
              >
                <option value="">Pilih Obat</option>
                {dummyMedicines.map(med => (
                  <option key={med.id} value={med.name}>{med.name}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Dosis</Form.Label>
              <Form.Control
                type="text"
                name="dosage"
                value={newPrescription.dosage}
                onChange={handleInputChange}
                placeholder="Contoh: 1 tablet, 3x sehari"
                required
                className={theme === 'dark' ? 'bg-secondary text-white border-secondary' : ''}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Instruksi</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="instructions"
                value={newPrescription.instructions}
                onChange={handleInputChange}
                placeholder="Instruksi tambahan (opsional)"
                className={theme === 'dark' ? 'bg-secondary text-white border-secondary' : ''}
              />
            </Form.Group>
            <Button variant="primary" type="submit" disabled={loading} className="w-100 mt-3">
              {loading ? 'Menambahkan...' : 'Simpan Resep'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default DoctorPrescriptions;
