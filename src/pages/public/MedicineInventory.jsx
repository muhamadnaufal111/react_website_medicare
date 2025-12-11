"use client";

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, InputGroup, Dropdown, Alert, Modal } from 'react-bootstrap';
import { useTheme } from '../../contexts/ThemeContexts'; // Path diperbaiki, pastikan sesuai dengan struktur proyek Anda

import AOS from "aos";
import "aos/dist/aos.css";

const MedicineInventory = () => {
  const { theme } = useTheme(); // Dapatkan tema dari konteks

  // State untuk mengontrol modal detail
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState(null);

  const [medicines, setMedicines] = useState([
    {
      id: 1,
      name: 'Amoxicillin',
      description: 'Antibiotik untuk mengobati infeksi bakteri',
      category: 'Antibiotik',
      stock: 150,
      price: 184850,
      producer: 'PharmaCorp',
      status: 'Tersedia'
    },
    {
      id: 2,
      name: 'Ibuprofen',
      description: 'Pereda nyeri dan obat anti-inflamasi',
      category: 'Pereda Nyeri',
      stock: 200,
      price: 134850,
      producer: 'MediCare Labs',
      status: 'Tersedia'
    },
    {
      id: 3,
      name: 'Lisinopril',
      description: 'ACE inhibitor untuk mengobati tekanan darah tinggi',
      category: 'Kardiovaskular',
      stock: 75,
      price: 239850,
      producer: 'HeartMed',
      status: 'Tersedia'
    },
    {
      id: 4,
      name: 'Metformin',
      description: 'Obat untuk mengobati diabetes tipe 2',
      category: 'Diabetes',
      stock: 120,
      price: 284850,
      producer: 'DiabetesRx',
      status: 'Tersedia'
    },
    {
      id: 5,
      name: 'Omeprazole',
      description: 'Proton pump inhibitor untuk asam lambung',
      category: 'Gastrointestinal',
      stock: 90,
      price: 224850,
      producer: 'GastroMed',
      status: 'Tersedia'
    },
    {
      id: 6,
      name: 'Atorvastatin',
      description: 'Obat statin untuk menurunkan kolesterol',
      category: 'Kardiovaskular',
      stock: 110,
      price: 344850,
      producer: 'HeartMed',
      status: 'Tersedia'
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua Kategori');

  const categories = ['Semua Kategori', 'Antibiotik', 'Pereda Nyeri', 'Kardiovaskular', 'Diabetes', 'Gastrointestinal'];

  const filteredMedicines = medicines.filter(medicine => {
    const matchesSearch = medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          medicine.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Semua Kategori' || medicine.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  useEffect(() => {
    AOS.init(
      {
        duration: 1000,
        once: true,
      }
    );
  }, []);

  // Fungsi untuk menangani klik tombol "Lihat Detail"
  const handleDetailClick = (medicine) => {
    setSelectedMedicine(medicine);
    setShowDetailModal(true);
  };

  return (
    <Container className={`py-5 ${theme === 'dark' ? 'text-white' : 'text-dark'}`}>
      <Row className="mb-4 align-items-center">
        <Col>
          <h1 data-aos="fade-right" className={`mb-0 ${theme === 'dark' ? 'text-white' : 'text-dark'}`}>Katalog Obat</h1>
          <p data-aos="fade-right" className="lead text-muted">Jelajahi koleksi obat-obatan kami yang lengkap</p>
        </Col>
      </Row>

      {/* Search and Filter */}
      <Row className="mb-4">
        <Col md={6}>
          <InputGroup>
            <Form.Control
              data-aos="fade-right"
              type="text"
              placeholder="Cari obat..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={theme === 'dark' ? 'bg-secondary text-white border-secondary' : ''}
            />
            <Button data-aos="fade-right" variant={theme === 'dark' ? 'outline-light' : 'outline-secondary'}>
              <i className="bi bi-search"></i>
            </Button>
          </InputGroup>
        </Col>
        <Col md={6} className="mt-3 mt-md-0 d-flex justify-content-md-end">
          <Dropdown>
            <Dropdown.Toggle variant={theme === 'dark' ? 'outline-light' : 'outline-primary'} id="dropdown-category">
              <i className="bi bi-funnel me-2"></i>{selectedCategory}
            </Dropdown.Toggle>
            <Dropdown.Menu variant={theme === 'dark' ? 'dark' : 'light'}>
              {categories.map(category => (
                <Dropdown.Item
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  active={selectedCategory === category}
                >
                  {category}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </Col>
      </Row>

      <p className="text-muted mb-4">Menampilkan {filteredMedicines.length} dari {medicines.length} obat</p>

      {/* Medicine Cards */}
      <Row className="g-4">
        {filteredMedicines.map(medicine => (
          <Col md={6} lg={4} key={medicine.id}>
            <Card data-aos="zoom-in-right" className={`h-100 shadow-sm ${theme === 'dark' ? 'bg-dark text-white border-secondary' : 'bg-white text-dark border-light'}`}>
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <Card.Title className="h5 mb-0">{medicine.name}</Card.Title>
                  <span className={`badge ${medicine.status === 'Tersedia' ? 'bg-success' : 'bg-danger'}`}>{medicine.status}</span>
                </div>
                <Card.Text className="text-muted mb-2">
                  {medicine.description}
                </Card.Text>
                <div className="mb-2">
                  <span className="badge bg-primary">{medicine.category}</span>
                </div>
                <p className="mb-1"><strong>Stok:</strong> {medicine.stock} unit</p>
                <p className="mb-1"><strong>Harga:</strong> Rp{medicine.price.toLocaleString('id-ID')}</p>
                <p className="mb-3"><strong>Produsen:</strong> {medicine.producer}</p>
                {/* Menambahkan onClick handler ke tombol "Lihat Detail" */}
                <Button variant="outline-primary" size="sm" className="w-100" onClick={() => handleDetailClick(medicine)}>
                  Lihat Detail
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
        {filteredMedicines.length === 0 && (
          <Col xs={12}>
            <Alert variant={theme === 'dark' ? 'secondary' : 'info'} className="text-center">
              Tidak ada obat yang ditemukan.
            </Alert>
          </Col>
        )}
      </Row>

      {/* Modal Detail Obat */}
      <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)} centered size="md">
        <Modal.Header closeButton className={theme === 'dark' ? 'bg-dark text-white border-secondary' : ''}>
          <Modal.Title className={theme === 'dark' ? 'text-white' : 'text-dark'}> {/* Judul modal sesuai tema */}
            Detail Obat: <span className="fw-bold">{selectedMedicine?.name}</span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className={theme === 'dark' ? 'bg-dark text-white' : 'text-dark'}> {/* Teks body sesuai tema */}
          {selectedMedicine && (
            <>
              {/* Bagian Informasi Umum Obat */}
              <div className={`mb-3 p-3 rounded ${theme === 'dark' ? 'bg-secondary' : 'bg-light'}`}> {/* Latar belakang sesuai tema */}
                <h6 className="mb-3 fw-bold"><i className="bi bi-info-circle-fill me-2 text-primary"></i>Informasi Obat</h6>
                <p className="mb-1"><i className="bi bi-tag-fill me-2 text-success"></i><span className="fw-bold">Kategori:</span> {selectedMedicine.category}</p>
                <p className="mb-1"><i className="bi bi-building-fill me-2 text-info"></i><span className="fw-bold">Produsen:</span> {selectedMedicine.producer}</p>
                <p className="mb-2"><i className="bi bi-currency-dollar me-2 text-warning"></i><span className="fw-bold">Harga:</span> Rp{selectedMedicine.price.toLocaleString('id-ID')}</p>
                <h6 className="mt-3 mb-1 fw-bold"><i className="bi bi-card-text me-2 text-primary"></i>Deskripsi:</h6>
                <p className={`p-2 rounded ${theme === 'dark' ? 'bg-dark text-white' : 'bg-white text-dark'}`}> {/* Latar belakang deskripsi sesuai tema */}
                  {selectedMedicine.description}
                </p>
              </div>

              {/* Bagian Stok dan Status */}
              <div className={`mb-3 p-3 rounded ${theme === 'dark' ? 'bg-secondary' : 'bg-light'}`}> {/* Latar belakang sesuai tema */}
                <h6 className="mb-3 fw-bold"><i className="bi bi-box-seam-fill me-2 text-primary"></i>Inventaris</h6>
                <p className="mb-1"><i className="bi bi-box me-2 text-success"></i><span className="fw-bold">Stok Tersedia:</span> {selectedMedicine.stock} unit</p>
                <p className="mb-0">
                  <i className="bi bi-check-circle-fill me-2 text-info"></i><span className="fw-bold">Status:</span> <span className={`badge ${selectedMedicine.status === 'Tersedia' ? 'bg-success' : 'bg-danger'} p-2`}>{selectedMedicine.status}</span>
                </p>
              </div>
            </>
          )}
        </Modal.Body>
        <Modal.Footer className={theme === 'dark' ? 'bg-dark text-white border-danger' : ''}>
          <Button variant="danger" onClick={() => setShowDetailModal(false)}>
            Tutup
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default MedicineInventory;
