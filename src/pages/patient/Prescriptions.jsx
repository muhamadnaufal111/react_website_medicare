"use client";

import React, { useState, useEffect } from 'react'; // Import useEffect
import { Container, Row, Col, Card, Button, Alert, Modal } from 'react-bootstrap';
import { useTheme } from '../../contexts/ThemeContexts'; // Path diperbaiki, pastikan sesuai dengan struktur proyek Anda

import AOS from "aos";
import "aos/dist/aos.css";

const Prescriptions = () => {
  const { theme } = useTheme(); // Dapatkan tema dari konteks

  // Inisialisasi AOS saat komponen dimuat
  useEffect(() => {
    AOS.init({
      duration: 800, // Durasi animasi dalam ms
      once: true,    // Apakah animasi hanya dimainkan sekali saat di-scroll
    });
    // Jika Anda menggunakan next.js dan route berubah, AOS.refresh() mungkin diperlukan
    // return () => AOS.refreshHard();
  }, []);

  // State untuk mengontrol modal detail
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState(null);

  // Data dummy untuk resep aktif
  const [activePrescriptions] = useState([
    {
      id: 1,
      doctor: 'Dr. Sarah Johnson',
      date: '15 Januari 2024',
      diagnosis: 'Infeksi saluran pernapasan atas',
      medicines: [
        { name: 'Amoxicillin', dosage: '500mg', frequency: '3 kali sehari', duration: '7 hari' },
        { name: 'Ibuprofen', dosage: '400mg', frequency: 'Sesuai kebutuhan', duration: '5 hari' },
      ],
      doctorNotes: 'Minum dengan makanan. Habiskan antibiotik sesuai petunjuk.',
      status: 'Aktif'
    },
    {
      id: 2,
      doctor: 'Dr. Michael Chen',
      date: '10 Januari 2024',
      diagnosis: 'Hipertensi',
      medicines: [
        { name: 'Lisinopril', dosage: '10mg', frequency: 'Sekali sehari', duration: '30 hari' },
      ],
      doctorNotes: 'Pantau tekanan darah secara teratur. Minum di pagi hari.',
      status: 'Aktif'
    },
  ]);

  // Data dummy untuk riwayat resep
  const [pastPrescriptions] = useState([
    {
      id: 3,
      doctor: 'Dr. Emily Davis',
      date: '20 Desember 2023',
      diagnosis: 'Gastritis',
      medicines: [
        { name: 'Omeprazole', dosage: '20mg', frequency: 'Sekali sehari', duration: '14 hari' },
      ],
      doctorNotes: 'Hindari makanan pedas dan asam.',
      status: 'Selesai'
    },
    {
      id: 4,
      doctor: 'Dr. Robert Wilson',
      date: '01 Desember 2023',
      diagnosis: 'Nyeri Lutut',
      medicines: [
        { name: 'Meloxicam', dosage: '7.5mg', frequency: 'Sekali sehari', duration: '7 hari' },
      ],
      doctorNotes: 'Istirahat yang cukup dan hindari aktivitas berat.',
      status: 'Selesai'
    },
  ]);

  // Fungsi untuk menangani klik tombol "Detail"
  const handleDetailClick = (prescription) => {
    setSelectedPrescription(prescription);
    setShowDetailModal(true);
  };

  // Fungsi untuk menangani klik tombol "Unduh"
  const handleDownloadClick = (prescription) => {
    const prescriptionData = `
Resep #${prescription.id}
-------------------------------------
Diresiapkan oleh: ${prescription.doctor}
Tanggal: ${prescription.date}
Diagnosa: ${prescription.diagnosis}

Obat-obatan:
${prescription.medicines.map(med => `  - ${med.name}: ${med.dosage}, ${med.frequency}, ${med.duration}`).join('\n')}

Catatan Dokter: ${prescription.doctorNotes}
Status: ${prescription.status}
    `;

    // Buat Blob dari data resep
    const blob = new Blob([prescriptionData], { type: 'text/plain;charset=utf-8' });

    // Buat elemen tautan (link)
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `resep_${prescription.id}_${prescription.date.replace(/\s/g, '_')}.txt`; // Nama file

    // Tambahkan ke body dan picu klik
    document.body.appendChild(link);
    link.click();

    // Bersihkan: hapus tautan dan cabut URL
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };

  const renderPrescriptionCard = (prescription) => (
    // Menambahkan data-aos="fade-up" pada setiap Card
    <Card key={prescription.id} className={`mb-4 shadow-sm ${theme === 'dark' ? 'bg-dark text-white border-secondary' : 'bg-white text-dark border-light'}`} data-aos="zoom-in-down">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
          <Card.Title className="h5 mb-0">
            <span className="fw-bold me-2">Resep </span>{prescription.id}
          </Card.Title>
          <div>
            <span className={`badge ${prescription.status === 'Aktif' ? 'bg-success' : 'bg-secondary'} me-2 p-2`}>
              {prescription.status}
            </span>
            <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleDetailClick(prescription)}>Detail</Button>
            <Button variant="outline-info" size="sm" onClick={() => handleDownloadClick(prescription)}>Unduh</Button>
          </div>
        </div>

        <Row className="mb-3">
          <Col md={6} className="mb-2 mb-md-0">
            <p className="mb-0"><i className="bi bi-person-fill me-2" style={{ color: '#198754' }}></i><strong className="fw-bold">Diresiapkan oleh:</strong> <span className="fw-bold">{prescription.doctor}</span></p>
          </Col>
          <Col md={6}>
            <p className="mb-0"><i className="bi bi-calendar-event me-2" style={{ color: '#fd7e14' }}></i><strong className="fw-bold">Tanggal:</strong> <span className="fw-bold">{prescription.date}</span></p>
          </Col>
        </Row>

        <h6 className="mb-2 mt-3"><i className="bi bi-clipboard-pulse me-2 text-primary"></i>Diagnosa:</h6>
        <p className={`mb-3 p-3 rounded shadow-sm ${theme === 'dark' ? 'bg-secondary text-white' : 'bg-light text-dark'}`}>
          {prescription.diagnosis}
        </p>

        <h6 className="mb-2 mt-4"><i className="bi bi-capsule-fill me-2 fw-bold"></i>Obat-obatan:</h6>
        {prescription.medicines.map((med, index) => (
          <div key={index} className={`mb-3 p-3 rounded shadow-sm ${theme === 'dark' ? 'bg-secondary text-white border border-secondary' : 'bg-light text-dark border border-light'}`}>
            <p className="mb-2"><strong className="text-primary">{med.name}</strong></p>
            <Row className="text-center g-0">
              <Col xs={4}>
                <small className="d-block text-muted">DOSIS</small>
                <p className="fw-bold mb-0">{med.dosage}</p>
              </Col>
              <Col xs={4}>
                <small className="d-block text-muted">FREKUENSI</small>
                <p className="fw-bold mb-0">{med.frequency}</p>
              </Col>
              <Col xs={4}>
                <small className="d-block text-muted">DURASI</small>
                <p className="fw-bold mb-0">{med.duration}</p>
              </Col>
            </Row>
          </div>
        ))}

        <h6 className="mb-2 mt-4"><i className="bi bi-journal-text me-2 text-primary"></i>Catatan Dokter:</h6>
        <p className={`p-3 rounded shadow-sm ${theme === 'dark' ? 'bg-secondary text-white' : 'bg-light text-dark'}`}>
          {prescription.doctorNotes}
        </p>
      </Card.Body>
    </Card>
  );

  return (
    <Container className={`py-5 ${theme === 'dark' ? 'text-white' : 'text-dark'}`}>
      <h1 data-aos="fade-right" className={`mb-0 ${theme === 'dark' ? 'text-white' : 'text-dark'}`}>Resep Saya</h1>
      <p data-aos="fade-right" className={`lead ${theme === 'dark' ? 'text-light' : 'text-muted'} mb-4`}>Lihat dan kelola resep saat ini dan yang lalu</p>

      {/* Resep Aktif */}
      <h2 data-aos="fade-right" className={`mb-3 ${theme === 'dark' ? 'text-white' : 'text-dark'}`}>Resep Aktif</h2>
      {activePrescriptions.length > 0 ? (
        activePrescriptions.map(renderPrescriptionCard)
      ) : (
        <Alert variant={theme === 'dark' ? 'secondary' : 'info'} className={theme === 'dark' ? 'text-white' : ''} data-aos="zoom-in-down">
          Tidak ada resep aktif.
        </Alert>
      )}

      {/* Riwayat Resep */}
      <h2 data-aos="fade-right" className={`mt-5 mb-3 ${theme === 'dark' ? 'text-white' : 'text-dark'}`}>Riwayat Resep</h2>
      {pastPrescriptions.length > 0 ? (
        pastPrescriptions.map(renderPrescriptionCard)
      ) : (
        <Alert variant={theme === 'dark' ? 'secondary' : 'info'} className={theme === 'dark' ? 'text-white' : ''} data-aos="zoom-in-down">
          Tidak ada riwayat resep.
        </Alert>
      )}

      {/* Modal Detail Resep */}
      <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)} centered size="md">
        <Modal.Header closeButton className={theme === 'dark' ? 'bg-dark text-white border-secondary' : ''}>
          <Modal.Title className={theme === 'dark' ? 'text-white' : 'text-dark'}>Detail Resep <span className="fw-bold">#{selectedPrescription?.id}</span></Modal.Title>
        </Modal.Header>
        <Modal.Body className={theme === 'dark' ? 'bg-dark text-white' : 'text-dark'}>
          {selectedPrescription && (
            <>
              {/* Bagian Informasi Umum */}
              <div className={`mb-3 p-2 rounded ${theme === 'dark' ? 'bg-secondary' : 'bg-light'}`}>
                <h6 className="mb-2 fw-bold"><i className="bi bi-info-circle-fill me-2 text-primary"></i>Informasi Umum</h6>
                <p className="mb-1"><i className="bi bi-person-fill me-2" style={{ color: '#198754' }}></i><span className="fw-bold">Diresiapkan oleh:</span> {selectedPrescription.doctor}</p>
                <p className="mb-2"><i className="bi bi-calendar-event me-2" style={{ color: '#fd7e14' }}></i><span className="fw-bold">Tanggal:</span> {selectedPrescription.date}</p>
                <h6 className="mt-2 mb-1 fw-bold"><i className="bi bi-clipboard-pulse me-2 text-primary"></i>Diagnosa:</h6>
                <p className={`p-1 rounded ${theme === 'dark' ? 'bg-dark text-white' : 'bg-white text-dark'}`}>
                  {selectedPrescription.diagnosis}
                </p>
              </div>

              {/* Bagian Obat-obatan */}
              <h6 className="mb-2 mt-3 fw-bold"><i className="bi bi-capsule-fill me-2 text-primary"></i>Obat-obatan:</h6>
              <ul className="list-unstyled">
                {selectedPrescription.medicines.map((med, index) => (
                  <li key={index} className={`mb-1 p-2 rounded ${theme === 'dark' ? 'bg-secondary text-white' : 'bg-light text-dark'}`}>
                    <p className="mb-0">
                      <span className="fw-bold">{med.name}</span>: {med.dosage}, {med.frequency}, {med.duration}
                    </p>
                  </li>
                ))}
              </ul>

              {/* Bagian Catatan Dokter */}
              <h6 className="mt-3 mb-1 fw-bold"><i className="bi bi-journal-text me-2 text-primary"></i>Catatan Dokter:</h6>
              <p className={`p-2 rounded ${theme === 'dark' ? 'bg-dark text-white' : 'bg-white text-dark'}`}>
                {selectedPrescription.doctorNotes}
              </p>

              {/* Bagian Status */}
              <div className="text-end mt-3">
                <p className="mb-0"><span className="fw-bold">Status:</span> <span className={`badge ${selectedPrescription.status === 'Aktif' ? 'bg-success' : 'bg-secondary'} p-2`}>{selectedPrescription.status}</span></p>
              </div>
            </>
          )}
        </Modal.Body>
        <Modal.Footer className={theme === 'dark' ? 'bg-dark text-white border-secondary' : ''}>
          <Button variant="danger" onClick={() => setShowDetailModal(false)}>
            Tutup
          </Button>
          <Button variant="info" onClick={() => {
            handleDownloadClick(selectedPrescription);
            setShowDetailModal(false); // Tutup modal setelah memulai unduhan
          }}>
            Unduh Resep
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Prescriptions;
