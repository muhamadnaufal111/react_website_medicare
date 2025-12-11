// src/pages/admin/ManageMedicines.jsx
"use client";

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Table, InputGroup, Spinner, Modal } from 'react-bootstrap';
import { useTheme } from '../../contexts/ThemeContexts';

// --- Komponen Modal untuk Detail Obat ---
const MedicineDetailModal = ({ show, handleClose, medicine, theme }) => {
  if (!medicine) return null;

  const getThemeClass = (darkClass, lightClass) => theme === 'dark' ? darkClass : lightClass;

  return (
    <Modal show={show} onHide={handleClose} centered size="lg" dialogClassName={getThemeClass('modal-dark', '')}>
      <Modal.Header closeButton className={getThemeClass('bg-dark text-white border-secondary', 'bg-light text-dark border-light')}>
        <Modal.Title className={getThemeClass('text-white', 'text-dark')}>Detail Obat: {medicine.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body className={getThemeClass('bg-dark text-white', 'bg-white text-dark')}>
        <Row className="g-3">
          <Col md={6}>
            <p className="mb-1"><small className={getThemeClass('text-muted', 'text-secondary')}>Kategori:</small> <br /><span className="fw-medium">{medicine.category}</span></p>
            <p className="mb-1"><small className={getThemeClass('text-muted', 'text-secondary')}>Produsen:</small> <br /><span className="fw-medium">{medicine.producer}</span></p>
            <p className="mb-1"><small className={getThemeClass('text-muted', 'text-secondary')}>Stok:</small> <br /><span className="fw-medium">{medicine.stock} unit</span></p>
            <p className="mb-1"><small className={getThemeClass('text-muted', 'text-secondary')}>Harga:</small> <br /><span className="fw-medium">
              {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(medicine.price)}
            </span></p>
          </Col>
          <Col md={6}>
            <p className="mb-1"><small className={getThemeClass('text-muted', 'text-secondary')}>Kadaluarsa:</small> <br /><span className="fw-medium">{medicine.expiryDate}</span></p>
            <p className="mb-1"><small className={getThemeClass('text-muted', 'text-secondary')}>Status:</small> <br /><span className={`badge ${
              medicine.status === 'Tersedia' ? 'bg-success' :
              medicine.status === 'Stok rendah' ? 'bg-warning' :
              'bg-danger'
            }`}>{medicine.status}</span></p>
            <p className="mb-1"><small className={getThemeClass('text-muted', 'text-secondary')}>Deskripsi:</small> <br /><span className="fw-medium">{medicine.description}</span></p>
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer className={getThemeClass('bg-dark text-white border-secondary', 'bg-light text-dark border-light')}>
        <Button variant="secondary" onClick={handleClose}>
          Tutup
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

// --- Komponen Modal untuk Tambah/Edit Obat ---
const AddEditMedicineModal = ({ show, handleClose, medicine, theme, onSave }) => {
  const [formData, setFormData] = useState({
    id: medicine ? medicine.id : null,
    name: medicine ? medicine.name : '',
    category: medicine ? medicine.category : '',
    producer: medicine ? medicine.producer : '',
    stock: medicine ? medicine.stock : 0,
    price: medicine ? medicine.price : 0,
    expiryDate: medicine ? medicine.expiryDate : '',
    description: medicine ? medicine.description : '',
    status: medicine ? medicine.status : 'Tersedia', // Status akan dihitung ulang saat disimpan
  });

  useEffect(() => {
    if (medicine) {
      setFormData({
        id: medicine.id,
        name: medicine.name,
        category: medicine.category,
        producer: medicine.producer,
        stock: medicine.stock,
        price: medicine.price,
        expiryDate: medicine.expiryDate,
        description: medicine.description,
        status: medicine.status,
      });
    } else {
      setFormData({
        id: null,
        name: '',
        category: '',
        producer: '',
        stock: 0,
        price: 0,
        expiryDate: '',
        description: '',
        status: 'Tersedia',
      });
    }
  }, [medicine]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({ // <--- Perbaikan di sini: Menggunakan 'prev'
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Hitung status berdasarkan stok sebelum menyimpan
    let calculatedStatus = 'Tersedia';
    if (formData.stock === 0) {
      calculatedStatus = 'Habis';
    } else if (formData.stock <= 50) { // Contoh ambang batas stok rendah
      calculatedStatus = 'Stok rendah';
    }
    onSave({ ...formData, status: calculatedStatus });
    handleClose();
  };

  const getThemeClass = (darkClass, lightClass) => theme === 'dark' ? darkClass : lightClass;

  return (
    <Modal show={show} onHide={handleClose} centered size="lg" dialogClassName={getThemeClass('modal-dark', '')}>
      <Modal.Header closeButton className={getThemeClass('bg-dark text-white border-secondary', 'bg-light text-dark border-light')}>
        <Modal.Title className={getThemeClass('text-white', 'text-dark')}>{medicine ? 'Edit Obat' : 'Tambah Obat Baru'}</Modal.Title>
      </Modal.Header>
      <Modal.Body className={getThemeClass('bg-dark text-white', 'bg-white text-dark')}>
        <Form onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="formMedicineName">
              <Form.Label className={getThemeClass('text-light', 'text-dark')}>Nama Obat</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className={getThemeClass('bg-secondary text-white border-secondary', 'bg-light text-dark border-secondary')}
              />
            </Form.Group>
            <Form.Group as={Col} controlId="formCategory">
              <Form.Label className={getThemeClass('text-light', 'text-dark')}>Kategori</Form.Label>
              <Form.Control
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className={getThemeClass('bg-secondary text-white border-secondary', 'bg-light text-dark border-secondary')}
              />
            </Form.Group>
          </Row>

          <Row className="mb-3">
            <Form.Group as={Col} controlId="formProducer">
              <Form.Label className={getThemeClass('text-light', 'text-dark')}>Produsen</Form.Label>
              <Form.Control
                type="text"
                name="producer"
                value={formData.producer}
                onChange={handleChange}
                required
                className={getThemeClass('bg-secondary text-white border-secondary', 'bg-light text-dark border-secondary')}
              />
            </Form.Group>
            <Form.Group as={Col} controlId="formStock">
              <Form.Label className={getThemeClass('text-light', 'text-dark')}>Stok (Unit)</Form.Label>
              <Form.Control
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                required
                min="0"
                className={getThemeClass('bg-secondary text-white border-secondary', 'bg-light text-dark border-secondary')}
              />
            </Form.Group>
          </Row>

          <Row className="mb-3">
            <Form.Group as={Col} controlId="formPrice">
              <Form.Label className={getThemeClass('text-light', 'text-dark')}>Harga (IDR)</Form.Label>
              <InputGroup>
                <InputGroup.Text className={getThemeClass('bg-secondary text-white border-secondary', 'bg-light text-dark border-secondary')}>Rp</InputGroup.Text>
                <Form.Control
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="0"
                  className={getThemeClass('bg-secondary text-white border-secondary', 'bg-light text-dark border-secondary')}
                />
              </InputGroup>
            </Form.Group>
            <Form.Group as={Col} controlId="formExpiryDate">
              <Form.Label className={getThemeClass('text-light', 'text-dark')}>Tanggal Kadaluarsa</Form.Label>
              <Form.Control
                type="date"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleChange}
                required
                className={getThemeClass('bg-secondary text-white border-secondary', 'bg-light text-dark border-secondary')}
              />
            </Form.Group>
          </Row>

          <Form.Group className="mb-3" controlId="formDescription">
            <Form.Label className={getThemeClass('text-light', 'text-dark')}>Deskripsi</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={getThemeClass('bg-secondary text-white border-secondary', 'bg-light text-dark border-secondary')}
            />
          </Form.Group>

          <Modal.Footer className={getThemeClass('bg-dark text-white border-secondary', 'bg-light text-dark border-light')}>
            <Button variant="secondary" onClick={handleClose}>
              Batal
            </Button>
            <Button variant="primary" type="submit">
              {medicine ? 'Simpan Perubahan' : 'Tambah Obat'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

// --- Komponen Modal untuk Konfirmasi Hapus Obat ---
const DeleteMedicineConfirmationModal = ({ show, handleClose, handleConfirm, medicineName, theme }) => {
  const getThemeClass = (darkClass, lightClass) => theme === 'dark' ? darkClass : lightClass;

  return (
    <Modal show={show} onHide={handleClose} centered dialogClassName={getThemeClass('modal-dark', '')}>
      <Modal.Header closeButton className={getThemeClass('bg-dark text-white border-secondary', 'bg-light text-dark border-light')}>
        <Modal.Title className={getThemeClass('text-white', 'text-dark')}>Konfirmasi Hapus Obat</Modal.Title>
      </Modal.Header>
      <Modal.Body className={getThemeClass('bg-dark text-white', 'bg-white text-dark')}>
        <p>Apakah Anda yakin ingin menghapus obat <strong>{medicineName}</strong>?</p>
        <p className="text-danger">Tindakan ini tidak dapat dibatalkan.</p>
      </Modal.Body>
      <Modal.Footer className={getThemeClass('bg-dark text-white border-secondary', 'bg-light text-dark border-light')}>
        <Button variant="secondary" onClick={handleClose}>
          Batal
        </Button>
        <Button variant="danger" onClick={handleConfirm}>
          Hapus
        </Button>
      </Modal.Footer>
    </Modal>
  );
};


const ManageMedicines = () => {
  const { theme } = useTheme();
  const [medicines, setMedicines] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // States untuk modal detail obat
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState(null);

  // States untuk modal tambah/edit obat
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [medicineToEdit, setMedicineToEdit] = useState(null); // Menyimpan data obat yang akan diedit

  // States untuk modal konfirmasi hapus obat
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [medicineToDeleteId, setMedicineToDeleteId] = useState(null);
  const [medicineToDeleteName, setMedicineToDeleteName] = useState('');


  // Dummy data for medicines
  const dummyMedicines = [
    {
      id: 1,
      name: "Amoxicillin",
      category: "Antibiotik",
      producer: "PharmaCorp",
      stock: 100,
      price: 100000,
      expiryDate: "2025-06-15", // Format YYYY-MM-DD
      status: "Tersedia",
      description: "Antibiotik untuk mengobati infeksi bakteri."
    },
    {
      id: 2,
      name: "Ibuprofen",
      category: "Pereda Nyeri",
      producer: "MediCare Labs",
      stock: 100,
      price: 100000,
      expiryDate: "2025-08-20",
      status: "Tersedia",
      description: "Pereda nyeri dan obat anti-inflamasi."
    },
    {
      id: 3,
      name: "Lisinopril",
      category: "Kardiovaskular",
      producer: "HeartMed",
      stock: 100,
      price: 50000,
      expiryDate: "2025-04-10",
      status: "Stok rendah",
      description: "ACE inhibitor untuk mengobati hipertensi."
    },
    {
      id: 4,
      name: "Metformin",
      category: "Diabetes",
      producer: "DiabetesRx",
      stock: 0,
      price: 80000,
      expiryDate: "2025-06-30",
      status: "Habis",
      description: "Obat untuk mengobati diabetes tipe 2."
    },
    {
      id: 5,
      name: "Omeprazole",
      category: "Gastrointestinal",
      producer: "GastroMed",
      stock: 100,
      price: 70000,
      expiryDate: "2025-07-25",
      status: "Tersedia",
      description: "Proton pump inhibitor untuk asam lambung."
    }
  ];

  useEffect(() => {
    // Simulate fetching data
    setLoading(true);
    setTimeout(() => {
      setMedicines(dummyMedicines);
      setLoading(false);
    }, 500); // Simulate network delay
  }, []);

  // Filter medicines based on search term
  const filteredMedicines = medicines.filter(medicine =>
    medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    medicine.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    medicine.producer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate summary stats
  const totalMedicines = medicines.length;
  const lowStockMedicines = medicines.filter(m => m.stock > 0 && m.stock <= 50).length; // Stok > 0 dan <= 50
  const outOfStockMedicines = medicines.filter(m => m.stock === 0).length;
  const totalCategories = [...new Set(medicines.map(m => m.category))].length;
  const totalStockValue = medicines.reduce((sum, m) => sum + (m.stock * m.price), 0);

  // --- Handlers untuk Modal ---

  // Buka modal detail obat
  const handleShowDetail = (medicine) => {
    setSelectedMedicine(medicine);
    setShowDetailModal(true);
  };

  // Tutup modal detail obat
  const handleCloseDetail = () => {
    setShowDetailModal(false);
    setSelectedMedicine(null);
  };

  // Buka modal tambah obat
  const handleAddMedicineClick = () => {
    setMedicineToEdit(null); // Pastikan null untuk mode tambah
    setShowAddEditModal(true);
  };

  // Buka modal edit obat
  const handleEditClick = (medicine) => {
    setMedicineToEdit(medicine); // Set obat yang akan diedit
    setShowAddEditModal(true);
  };

  // Tutup modal tambah/edit obat
  const handleCloseAddEditModal = () => {
    setShowAddEditModal(false);
    setMedicineToEdit(null);
  };

  // Simpan/Perbarui obat (dari modal tambah/edit)
  const handleSaveMedicine = (formData) => {
    if (formData.id) {
      // Edit obat yang sudah ada
      setMedicines(medicines.map(med =>
        med.id === formData.id ? { ...formData } : med
      ));
      console.log('Obat berhasil diperbarui (simulasi):', formData);
      alert('Obat berhasil diperbarui!'); // Ganti dengan notifikasi UI yang lebih baik
    } else {
      // Tambah obat baru
      const newId = medicines.length > 0 ? Math.max(...medicines.map(med => med.id)) + 1 : 1;
      const newMedicine = { ...formData, id: newId };
      setMedicines([...medicines, newMedicine]);
      console.log('Obat baru berhasil ditambahkan (simulasi):', newMedicine);
      alert('Obat baru berhasil ditambahkan!'); // Ganti dengan notifikasi UI yang lebih baik
    }
  };

  // Buka modal konfirmasi hapus obat
  const handleDeleteClick = (medicineId, medicineName) => {
    setMedicineToDeleteId(medicineId);
    setMedicineToDeleteName(medicineName);
    setShowDeleteConfirmModal(true);
  };

  // Konfirmasi hapus obat
  const handleConfirmDelete = () => {
    setMedicines(medicines.filter(med => med.id !== medicineToDeleteId));
    setShowDeleteConfirmModal(false);
    setMedicineToDeleteId(null);
    setMedicineToDeleteName('');
    console.log(`Obat dengan ID: ${medicineToDeleteId} berhasil dihapus (simulasi).`);
    alert(`Obat ${medicineToDeleteName} berhasil dihapus!`); // Ganti dengan notifikasi UI yang lebih baik
  };

  // Batalkan hapus obat
  const handleCloseDeleteConfirmModal = () => {
    setShowDeleteConfirmModal(false);
    setMedicineToDeleteId(null);
    setMedicineToDeleteName('');
  };

  return (
    <Container fluid className={`py-4 ${theme === 'dark' ? 'text-white' : 'text-dark'}`}>
      <Row className="mb-4 align-items-center">
        <Col>
          <h1 className={`mb-0 ${theme === 'dark' ? 'text-white' : 'text-dark'}`}>Manajemen Obat</h1>
          <p className={`lead mb-0 ${theme === 'dark' ? 'text-light' : 'text-muted'}`}>Kelola inventori obat dan farmasi</p>
        </Col>
        <Col xs="auto">
          <Button variant="primary" onClick={handleAddMedicineClick}>
            <i className="bi bi-plus me-2"></i>Tambah Obat
          </Button>
        </Col>
      </Row>

      {/* Summary Statistics */}
      <Row className="g-4 mb-5">
        <Col md={6} lg={3}>
          <Card className={`h-100 shadow-sm ${theme === 'dark' ? 'bg-dark text-white border-secondary' : 'bg-white text-dark border-light'}`}>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <Card.Title className={`h6 ${theme === 'dark' ? 'text-light' : 'text-muted'} mb-0`}>Total Obat</Card.Title>
                <i className="bi bi-capsule display-6 opacity-75"></i>
              </div>
              <h3 className="fw-bold">{totalMedicines}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} lg={3}>
          <Card className={`h-100 shadow-sm ${theme === 'dark' ? 'bg-dark text-white border-secondary' : 'bg-white text-dark border-light'}`}>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <Card.Title className={`h6 ${theme === 'dark' ? 'text-light' : 'text-muted'} mb-0`}>Stok Rendah</Card.Title>
                <i className="bi bi-exclamation-triangle display-6 opacity-75 text-warning"></i> {/* Menggunakan text-warning */}
              </div>
              <h3 className="fw-bold text-warning">{lowStockMedicines}</h3> {/* Menggunakan text-warning */}
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} lg={3}>
          <Card className={`h-100 shadow-sm ${theme === 'dark' ? 'bg-dark text-white border-secondary' : 'bg-white text-dark border-light'}`}>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <Card.Title className={`h6 ${theme === 'dark' ? 'text-light' : 'text-muted'} mb-0`}>Kategori</Card.Title>
                <i className="bi bi-tags display-6 opacity-75"></i>
              </div>
              <h3 className="fw-bold">{totalCategories}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} lg={3}>
          <Card className={`h-100 shadow-sm ${theme === 'dark' ? 'bg-dark text-white border-secondary' : 'bg-white text-dark border-light'}`}>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <Card.Title className={`h6 ${theme === 'dark' ? 'text-light' : 'text-muted'} mb-0`}>Nilai Total Stok</Card.Title>
                <i className="bi bi-currency-dollar display-6 opacity-75"></i>
              </div>
              <h3 className="fw-bold">
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  minimumFractionDigits: 0,
                }).format(totalStockValue)}
              </h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Search Medicine */}
      <Card className={`shadow-sm mb-4 ${theme === 'dark' ? 'bg-dark text-white border-secondary' : 'bg-white text-dark border-light'}`}>
        <Card.Body>
          <Card.Title className={`h5 mb-3 ${theme === 'dark' ? 'text-white' : 'text-dark'}`}>Cari Obat</Card.Title>
          <Card.Text className={theme === 'dark' ? 'text-light' : 'text-muted'}>Cari berdasarkan nama, kategori, atau produsen</Card.Text>
          <InputGroup className="mb-3">
            <InputGroup.Text className={theme === 'dark' ? 'bg-secondary text-white border-secondary' : ''}>
              <i className="bi bi-search"></i>
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Cari obat..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={theme === 'dark' ? 'bg-secondary text-white border-secondary' : ''}
            />
          </InputGroup>
        </Card.Body>
      </Card>

      {/* Medicine List */}
      <Card className={`shadow-sm mb-4 ${theme === 'dark' ? 'bg-dark text-white border-secondary' : 'bg-white text-dark border-light'}`}>
        <Card.Body>
          <Card.Title className={`h5 mb-3 ${theme === 'dark' ? 'text-white' : 'text-dark'}`}>Daftar Obat</Card.Title>
          <Card.Text className={theme === 'dark' ? 'text-light' : 'text-muted'}>Menampilkan {filteredMedicines.length} dari {medicines.length} obat</Card.Text>
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" role="status" variant={theme === 'dark' ? 'light' : 'primary'}>
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          ) : (
            <div className="table-responsive">
              <Table striped bordered hover variant={theme === 'dark' ? 'dark' : 'light'} className="mb-0">
                <thead>
                  <tr>
                    <th>Nama & Kategori</th>
                    <th>Produsen</th>
                    <th>Stok</th>
                    <th>Harga</th>
                    <th>Kadaluarsa</th>
                    <th>Status</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMedicines.map(medicine => (
                    <tr key={medicine.id}>
                      <td>
                        <div className={theme === 'dark' ? 'text-white' : 'text-dark'}>{medicine.name}</div>
                        <small className={theme === 'dark' ? 'text-light' : 'text-muted'}>{medicine.category}</small>
                      </td>
                      <td>{medicine.producer}</td>
                      <td>{medicine.stock} unit</td>
                      <td>
                        {new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                          minimumFractionDigits: 0,
                        }).format(medicine.price)}
                      </td>
                      <td>{medicine.expiryDate}</td>
                      <td>
                        <span className={`badge ${
                          medicine.status === 'Tersedia' ? 'bg-success' :
                          medicine.status === 'Stok rendah' ? 'bg-warning' :
                          'bg-danger'
                        }`}>
                          {medicine.status}
                        </span>
                      </td>
                      <td>
                        <Button variant="outline-info" size="sm" className="me-2" onClick={() => handleShowDetail(medicine)}>
                          <i className="bi bi-eye me-1"></i>Detail
                        </Button>
                        <Button variant="outline-warning" size="sm" className="me-2" onClick={() => handleEditClick(medicine)}>
                          <i className="bi bi-pencil me-1"></i>Edit
                        </Button>
                        <Button variant="outline-danger" size="sm" onClick={() => handleDeleteClick(medicine.id, medicine.name)}>
                          <i className="bi bi-trash me-1"></i>Hapus
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {filteredMedicines.length === 0 && (
                    <tr>
                      <td colSpan="7" className="text-center text-muted py-3">Tidak ada obat yang ditemukan.</td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Render Modals */}
      <MedicineDetailModal
        show={showDetailModal}
        handleClose={handleCloseDetail}
        medicine={selectedMedicine}
        theme={theme}
      />

      <AddEditMedicineModal
        show={showAddEditModal}
        handleClose={handleCloseAddEditModal}
        medicine={medicineToEdit} // Akan null untuk tambah, objek untuk edit
        theme={theme}
        onSave={handleSaveMedicine}
      />

      <DeleteMedicineConfirmationModal
        show={showDeleteConfirmModal}
        handleClose={handleCloseDeleteConfirmModal}
        handleConfirm={handleConfirmDelete}
        medicineName={medicineToDeleteName}
        theme={theme}
      />
    </Container>
  );
};

export default ManageMedicines;
