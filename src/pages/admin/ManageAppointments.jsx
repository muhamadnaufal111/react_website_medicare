import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { Container, Row, Col, Card, Button, Form, Table, InputGroup, Spinner, Modal, Alert } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import axios from 'axios';
import { DatePicker, Select } from 'antd';
import dayjs from 'dayjs';

// API URL
const API_BASE_URL = 'http://localhost:5000';

// --- Theme Context Mock ---
const ThemeContext = createContext({theme: 'light', toggleTheme: () => {}});
const useTheme = () => useContext(ThemeContext);

// **MODAL KHUSUS EDIT STATUS**
const EditStatusModal = ({ show, handleClose, appointment, theme, onSave }) => {
  const [status, setStatus] = useState(appointment ? appointment.status : "Terjadwal");
  useEffect(() => {
    if (appointment) setStatus(appointment.status);
  }, [appointment]);
  const getThemeClass = (dark, light) => theme === 'dark' ? dark : light;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (status && appointment) {
      onSave({...appointment, status});
      handleClose();
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton className={getThemeClass('bg-dark text-white', 'bg-light text-dark')}>
        <Modal.Title>Ubah Status Janji Temu</Modal.Title>
      </Modal.Header>
      <Modal.Body className={getThemeClass('bg-dark text-white', 'bg-white text-dark')}>
        <div className="mb-2">
          <strong>ID:</strong> {appointment?.id}
        </div>
        <div className="mb-2">
          <strong>Pasien:</strong> {appointment?.patientName}
        </div>
        <div className="mb-3">
          <strong>Dokter:</strong> {appointment?.doctorName}
        </div>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formStatus">
              <Form.Label>Status Janji Temu</Form.Label>
              <Form.Select value={status} onChange={e => setStatus(e.target.value)} required>
                <option value="Menunggu Persetujuan">Menunggu Persetujuan</option>
                <option value="Terjadwal">Terjadwal</option>
                <option value="Selesai">Selesai</option>
                <option value="Dibatalkan">Dibatalkan</option>
              </Form.Select>
            </Form.Group>
            <Modal.Footer className="mt-3 border-0 px-0">
              <Button variant="secondary" onClick={handleClose}>Batal</Button>
              <Button variant="primary" type="submit">Simpan Status</Button>
            </Modal.Footer>
          </Form>
      </Modal.Body>
    </Modal>
  );
};

// --- Komponen Utama ---
const App = () => {
  const { theme } = useTheme();
  const [appointments, setAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('Semua Status');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal Status
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [appointmentToEdit, setAppointmentToEdit] = useState(null);

  // Tanggal filter, dll
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const getThemeClass = (darkClass, lightClass) => (theme === 'dark' ? darkClass : lightClass);

  // Fetch data
  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const appointmentsResponse = await axios.get(`${API_BASE_URL}/appointments`);
      const usersResponse = await axios.get(`${API_BASE_URL}/users`);
      const usersMap = usersResponse.data.reduce((acc, user) => {
        acc[user.id] = user;
        return acc;
      }, {});

      const mergedAppointments = appointmentsResponse.data.map((app) => {
        const user = usersMap[app.userId];
        const patientName = user ? user.name : 'Nama tidak ditemukan';
        const patientEmail = user ? user.email : 'Email tidak ditemukan';
        const patientPhone = user ? user.phone : 'Tidak ditemukan';

        const scheduleDate = app.scheduleDate || app.date || 'Tidak ditentukan';
        const scheduleTime = app.scheduleTime || app.time || 'Tidak ditentukan';
        const doctorName = app.doctorName || app.doctor || 'Dokter tidak ditentukan';
        const doctorSpecialization = app.doctorSpecialization || app.specialty || 'Spesialisasi tidak ditentukan';
        const notes = app.notes || app.note || '';
        const status = app.status || 'Menunggu Persetujuan';

        return {
          ...app,
          patientName,
          patientEmail,
          patientPhone,
          scheduleDate,
          scheduleTime,
          doctorName,
          doctorSpecialization,
          notes,
          status,
        };
      });

      setAppointments(mergedAppointments);
    } catch (err) {
      setError('Gagal memuat data janji temu. Pastikan server backend berjalan di http://localhost:5000.');
      toast.error('Gagal memuat data janji temu.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  // Filter
  const filteredAppointments = appointments.filter((appointment) => {
    const matchesSearch = (appointment.patientName || '').toLowerCase().includes(searchTerm.toLowerCase())
      || (appointment.doctorName || '').toLowerCase().includes(searchTerm.toLowerCase())
      || (appointment.patientEmail || '').toLowerCase().includes(searchTerm.toLowerCase())
      || (appointment.patientPhone || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'Semua Status' || appointment.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  // Statistik
  const totalAppointments = appointments.length;
  const selectedDayAppointments = appointments.filter((app) => app.scheduleDate === selectedDate).length;
  const scheduledAppointments = appointments.filter((app) => app.status === 'Terjadwal').length;
  const completedAppointments = appointments.filter((app) => app.status === 'Selesai').length;

  // STATUS Modal
  const handleEditClick = (appointment) => {
    setAppointmentToEdit(appointment);
    setShowStatusModal(true);
  };
  const handleCloseStatusModal = () => {
    setShowStatusModal(false);
    setAppointmentToEdit(null);
  };
  const handleSaveStatus = async (formData) => {
    setLoading(true);
    setError('');
    try {
      await axios.patch(`${API_BASE_URL}/appointments/${formData.id}`, {
        status: formData.status
      });
      toast.success('Status janji temu berhasil diubah!');
      await fetchAppointments();
    } catch (err) {
      setError('Gagal menyimpan status!');
      toast.error('Gagal mengubah status!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Container fluid className={`py-4 ${getThemeClass('text-white', 'text-dark')}`}>
        <Row className="mb-4 align-items-center">
          <Col>
            <h1 className={`mb-0 ${getThemeClass('text-white', 'text-dark')}`}>Manajemen Janji Temu</h1>
            <p className={`lead mb-0 ${getThemeClass('text-light', 'text-muted')}`}>
              Kelola semua janji temu pasien dengan dokter
            </p>
          </Col>
        </Row>
        {error && <Alert variant="danger">{error}</Alert>}
        {/* Summary Statistics */}
        <Row className="g-4 mb-5">
          <Col md={6} lg={3}>
            <Card className={`h-100 shadow-sm ${getThemeClass('bg-dark text-white border-secondary', 'bg-white text-dark border-light')}`}>
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <Card.Title className={`h6 ${getThemeClass('text-light', 'text-muted')} mb-0`}>Total Janji Temu</Card.Title>
                  <i className="bi bi-calendar-check display-6 opacity-75 text-primary" />
                </div>
                <h3 className="fw-bold">{totalAppointments}</h3>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6} lg={3}>
            <Card className={`h-100 shadow-sm ${getThemeClass('bg-dark text-white border-secondary', 'bg-white text-dark border-light')}`}>
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <Card.Title className={`h6 ${getThemeClass('text-light', 'text-muted')} mb-0`}>Janji Temu Pada Tanggal</Card.Title>
                  <i className="bi bi-calendar-event display-6 opacity-75 text-danger" />
                </div>
                <h3 className="fw-bold">{selectedDayAppointments}</h3>
                <Form.Group className="mt-2">
                  <DatePicker
                    value={selectedDate && dayjs(selectedDate).isValid() ? dayjs(selectedDate) : null}
                    onChange={(date, dateString) => setSelectedDate(dateString)}
                    style={{ width: '100%' }}
                    className={getThemeClass('bg-secondary text-white border-primary', 'bg-white text-dark border-primary shadow-sm')}
                  />
                </Form.Group>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6} lg={3}>
            <Card className={`h-100 shadow-sm ${getThemeClass('bg-dark text-white border-secondary', 'bg-white text-dark border-light')}`}>
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <Card.Title className={`h6 ${getThemeClass('text-light', 'text-muted')} mb-0`}>Terjadwal</Card.Title>
                  <i className="bi bi-clock display-6 opacity-75 text-warning" />
                </div>
                <h3 className="fw-bold">{scheduledAppointments}</h3>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6} lg={3}>
            <Card className={`h-100 shadow-sm ${getThemeClass('bg-dark text-white border-secondary', 'bg-white text-dark border-light')}`}>
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <Card.Title className={`h6 ${getThemeClass('text-light', 'text-muted')} mb-0`}>Selesai</Card.Title>
                  <i className="bi bi-check-circle display-6 opacity-75 text-success" />
                </div>
                <h3 className="fw-bold">{completedAppointments}</h3>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        {/* Filter */}
        <Card className={`shadow-sm mb-4 ${getThemeClass('bg-dark text-white border-secondary', 'bg-white text-dark border-light')}`}>
          <Card.Body>
            <Row className="g-3">
            <Col md={8}>
              <InputGroup>
                <InputGroup.Text
                  className={getThemeClass(
                    'bg-secondary text-white border-secondary',
                    'bg-white text-dark border-secondary'
                  )}
                >
                  <i className="bi bi-search"></i>
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Cari berdasarkan nama pasien, dokter, email, atau nomor telepon..." 
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className={getThemeClass(
                    'bg-secondary text-white border-secondary',
                    'bg-white text-dark border-secondary'
                  )}
                />
              </InputGroup>
            </Col>
              <Col md={4}>
                <Select
                  options={[
                    { value: 'Semua Status', label: 'Semua Status' },
                    { value: 'Menunggu Persetujuan', label: 'Menunggu Persetujuan' },
                    { value: 'Terjadwal', label: 'Terjadwal' },
                    { value: 'Selesai', label: 'Selesai' },
                    { value: 'Dibatalkan', label: 'Dibatalkan' },
                  ]}
                  value={filterStatus}
                  onChange={(value) => setFilterStatus(value)}
                  style={{ width: '100%' }}
                />
              </Col>
            </Row>
          </Card.Body>
        </Card>
        {/* List Table */}
        <Card className={`shadow-sm mb-4 ${getThemeClass('bg-dark text-white border-secondary', 'bg-white text-dark border-light')}`}>
          <Card.Body>
            <Card.Title className={`h5 mb-3 ${getThemeClass('text-white', 'text-dark')}`}>Semua Janji Temu</Card.Title>
            <Card.Text className={getThemeClass('text-light', 'text-muted')}>
              Menampilkan {filteredAppointments.length} dari {appointments.length} janji temu
            </Card.Text>
            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" role="status" variant={getThemeClass('light', 'primary')}><span className="visually-hidden">Loading...</span></Spinner>
              </div>
            ) : filteredAppointments.length === 0 ? (
              <Alert variant={getThemeClass('secondary', 'info')} className="text-center">Tidak ada janji temu yang ditemukan.</Alert>
            ) : (
              <div className="table-responsive">
                <Table striped bordered hover variant={getThemeClass('dark', 'light')} className="mb-0">
                  <thead>
                    <tr>
                      <th className='text-center'>Pasien</th>
                      <th className='text-center'>Dokter</th>
                      <th className='text-center'>Jadwal</th>
                      <th className='text-center'>Alasan</th>
                      <th className='text-center'>Status</th>
                      <th className='text-center'>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAppointments.map((app) => (
                      <tr key={app.id}>
                        <td>
                          <div>{app.patientName}</div>
                          <small className={getThemeClass('text-light', 'text-muted')}>
                            {app.patientEmail}
                            <br />
                            {app.patientPhone || 'Tidak tersedia'}
                          </small>
                        </td>
                        <td>
                          <div>{app.doctorName}</div>
                          <small className={getThemeClass('text-light', 'text-muted')}>{app.doctorSpecialization}</small>
                        </td>
                        <td>
                          <div>{app.scheduleDate}</div>
                          <small className={getThemeClass('text-light', 'text-muted')}>{app.scheduleTime}</small>
                        </td>
                        <td>
                          <div>{app.reason}</div>
                          <small className={getThemeClass('text-light', 'text-muted')}>{app.notes}</small>
                        </td>
                        <td className='text-center align-middle'>
                          <span
                            className={`badge border px-2 py-2 fw-semibold status-badge status-${app.status.replace(/\s/g,'').toLowerCase()}`}
                            style={{fontSize:'1rem', letterSpacing:0.5}}
                          >
                            {app.status}
                          </span>
                        </td>
                        <td className="align-middle text-center">
                          <Button
                            variant="btn btn-warning"
                            size="sm"
                            onClick={() => handleEditClick(app)}
                          >
                            <i className="bi bi-pencil me-1" /> Ubah Status
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
        {/* Modal Edit Status */}
        <EditStatusModal
          show={showStatusModal}
          handleClose={handleCloseStatusModal}
          appointment={appointmentToEdit}
          theme={theme}
          onSave={handleSaveStatus}
        />

        {/* Tambahkan style badge di bawah */}
        <style>
        {`
          .status-badge { 
            border-radius: 9px;
            font-weight: 600;
            border-width: 2px !important;
            font-size: 1em;
            min-width: 120px;
            display: inline-block;
          }
          .status-terjadwal {
            background: #f9f871 !important;
            color: #5d5d06 !important;
            border-color: #ede053 !important;
          }
          .status-menunggupersetujuan {
            background: #dde5ff !important;
            color: #3358c1 !important;
            border-color: #9cb5f7 !important;
          }
          .status-selesai {
            background: #71edb8 !important;
            color: #146a38 !important;
            border-color: #43b782 !important;
          }
          .status-dibatalkan {
            background: #ffcaca !important;
            color: #930707 !important;
            border-color: #fb8282 !important;
          }
        `}
        </style>
      </Container>
      <ToastContainer theme={theme === 'dark' ? 'dark' : 'light'} position="top-right" />
    </>
  );
};

export default App;