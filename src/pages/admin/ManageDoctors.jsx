// src/pages/admin/ManageDoctors.jsx
"use client";

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Table, InputGroup, Spinner, Alert, Modal, Toast, ToastContainer } from 'react-bootstrap';
import { useTheme } from '../../contexts/ThemeContexts';
import axios from 'axios';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import BarChartIcon from "@mui/icons-material/BarChart";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import dayjs from "dayjs";

// ----------------------------------
// UIVERSE Animasi Hospital Loader
// ----------------------------------
const HospitalLoader = ({ dark }) => (
  <div className="uiverse-loader-container">
    <div className="uiverse-loader">
      <svg viewBox="0 0 100 100" width="70" height="70">
        <rect x="39" y="20" width="22" height="60" rx="8" fill={dark ? "#0dcaf0" : "#0dbfe6"}>
          <animate attributeName="x" values="39;30;39" keyTimes="0;0.5;1" dur="1.6s" repeatCount="indefinite" />
        </rect>
        <rect x="18" y="48" width="60" height="15" rx="8" fill={dark ? "#fff" : "#15d168"}>
          <animate attributeName="y" values="48;30;48" keyTimes="0;0.5;1" dur="1.6s" repeatCount="indefinite" />
        </rect>
        <rect x="39" y="38" width="22" height="10" rx="5" fill={dark ? "#f9c231" : "#f9c231"}>
          <animate attributeName="width" values="22;36;22" keyTimes="0;0.5;1" dur="1.6s" repeatCount="indefinite" />
        </rect>
        {/* "Medical Cross" */}
        <rect x="60" y="65" width="6" height="18" rx="3" fill="#ef3648"/>
        <rect y="83" x="58" width="18" height="6" rx="3" fill="#ef3648"/>
      </svg>
      <div className="uiverse-loader-text" style={{color: dark ? "#fff":"#222"}}>
        Loading data dokter...
      </div>
    </div>
    <style>{`
    .uiverse-loader-container {
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      min-height: 250px;
      padding: 48px 0;
      width: 100%;
    }
    .uiverse-loader {
      display: flex; flex-direction: column; align-items: center;
      gap: 18px;
    }
    .uiverse-loader svg { display: block;}
    .uiverse-loader-text {
      margin-top:8px; font-size: 17px; font-weight: 500;
      letter-spacing:0.5px;
    }
    `}</style>
  </div>
);

// --- Helper Functions untuk Mengambil Data ---
const fetchDoctorsFromAPI = async () => {
  try {
    const usersRes = await axios.get("http://localhost:5000/users?role=doctor");
    const profilesRes = await axios.get("http://localhost:5000/profiles");
    
    const doctorUsers = usersRes.data;
    const profiles = profilesRes.data;
    
    const doctors = doctorUsers.map((user) => {
      const profile = profiles.find((p) => p.userId === String(user.id));
      return {
        id: user.id,
        name: user.name || "-",
        specialization: user.specialty || profile?.specialty || "Umum",
        contactEmail: user.email || "-",
        contactPhone: profile?.phone || "-",
        schedule: profile?.schedule || "-",
        experience: profile?.experience || "-",
        totalPatients: 0,
        status: profile?.status || "Aktif",
        joinedDate: profile?.joinedSince || "-"
      };
    });
    
    return doctors;
  } catch (error) {
    console.error("Error fetching doctors from API:", error);
    return [];
  }
};

const addDoctorToAPI = async (doctorData) => {
  try {
    const newUser = {
      username: doctorData.contactEmail,
      password: doctorData.password,
      role: "doctor",
      email: doctorData.contactEmail,
      name: doctorData.name,
      specialty: doctorData.specialization
    };
    
    const userResponse = await axios.post("http://localhost:5000/users", newUser);
    const createdUser = userResponse.data;
    
    const newProfile = {
      userId: String(createdUser.id),
      phone: doctorData.contactPhone || "",
      schedule: doctorData.schedule || "",
      experience: doctorData.experience || "",
      specialty: doctorData.specialization,
      status: doctorData.status || "Aktif",
      joinedSince: new Date().toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      })
    };
    
    await axios.post("http://localhost:5000/profiles", newProfile);
    
    return {
      ...doctorData,
      id: createdUser.id,
      totalPatients: 0,
      joinedDate: newProfile.joinedSince
    };
  } catch (error) {
    console.error("Error adding doctor to API:", error);
    throw error;
  }
};

const updateDoctorInAPI = async (doctorData) => {
  try {
    const userUpdateData = {
      name: doctorData.name,
      email: doctorData.contactEmail,
      specialty: doctorData.specialization
    };
    
    await axios.put(`http://localhost:5000/users/${doctorData.id}`, userUpdateData);
    
    const profilesRes = await axios.get(`http://localhost:5000/profiles?userId=${doctorData.id}`);
    const existingProfile = profilesRes.data[0];
    
    const profileUpdateData = {
      phone: doctorData.contactPhone || "",
      schedule: doctorData.schedule || "",
      experience: doctorData.experience || "",
      specialty: doctorData.specialization,
      status: doctorData.status || "Aktif"
    };
    
    if (existingProfile) {
      await axios.put(`http://localhost:5000/profiles/${existingProfile.id}`, {
        ...existingProfile,
        ...profileUpdateData
      });
    } else {
      await axios.post("http://localhost:5000/profiles", {
        userId: String(doctorData.id),
        ...profileUpdateData
      });
    }
    
    return doctorData;
  } catch (error) {
    console.error("Error updating doctor in API:", error);
    throw error;
  }
};

const deleteDoctorFromAPI = async (doctorId) => {
  try {
    const profilesRes = await axios.get(`http://localhost:5000/profiles?userId=${doctorId}`);
    const profile = profilesRes.data[0];
    if (profile) {
      await axios.delete(`http://localhost:5000/profiles/${profile.id}`);
    }
    
    await axios.delete(`http://localhost:5000/users/${doctorId}`);
    
    return true;
  } catch (error) {
    console.error("Error deleting doctor from API:", error);
    throw error;
  }
};

const calculateDoctorPatientCounts = (appointments) => {
  const doctorPatients = {};
  
  appointments.forEach(appointment => {
    const doctorId = appointment.doctorId || appointment.doctor_id;
    if (doctorId) {
      if (!doctorPatients[doctorId]) {
        doctorPatients[doctorId] = new Set();
      }
      doctorPatients[doctorId].add(appointment.userId);
    }
  });
  
  const doctorPatientCounts = {};
  Object.keys(doctorPatients).forEach(doctorId => {
    doctorPatientCounts[doctorId] = doctorPatients[doctorId].size;
  });
  
  return doctorPatientCounts;
};

// --- Komponen Toast Notification ---
const ToastNotification = ({ message, variant, show, onClose }) => {
  return (
    <ToastContainer position="top-end" className="p-3">
      <Toast show={show} onClose={onClose} delay={3000} autohide bg={variant}>
        <Toast.Header>
          <strong className="me-auto">Notifikasi</strong>
        </Toast.Header>
        <Toast.Body className={variant === 'success' ? 'text-white' : 'text-white'}>
          {message}
        </Toast.Body>
      </Toast>
    </ToastContainer>
  );
};

// --- Komponen Modal untuk Detail Dokter ---
const DoctorDetailModal = ({ show, handleClose, doctor, theme }) => {
  if (!doctor) return null;

  const getThemeClass = (darkClass, lightClass) => theme === 'dark' ? darkClass : lightClass;

  return (
    <Modal show={show} onHide={handleClose} centered size="lg" dialogClassName={getThemeClass('modal-dark', '')}>
      <Modal.Header closeButton className={getThemeClass('bg-dark text-white border-secondary', 'bg-light text-dark border-light')}>
        <Modal.Title className={getThemeClass('text-white', 'text-dark')}>Detail Dokter: {doctor.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body className={getThemeClass('bg-dark text-white', 'bg-white text-dark')}>
        <Row className="g-3">
          <Col md={6}>
            <p className="mb-1"><small className={getThemeClass('text-muted', 'text-secondary')}>Spesialisasi:</small> <br /><span className="fw-medium">{doctor.specialization}</span></p>
            <p className="mb-1"><small className={getThemeClass('text-muted', 'text-secondary')}>Email Kontak:</small> <br /><span className="fw-medium">{doctor.contactEmail}</span></p>
            <p className="mb-1"><small className={getThemeClass('text-muted', 'text-secondary')}>Telepon Kontak:</small> <br /><span className="fw-medium">{doctor.contactPhone}</span></p>
          </Col>
          <Col md={6}>
            <p className="mb-1"><small className={getThemeClass('text-muted', 'text-secondary')}>Jadwal:</small> <br /><span className="fw-medium">{doctor.schedule}</span></p>
            <p className="mb-1"><small className={getThemeClass('text-muted', 'text-secondary')}>Pengalaman:</small> <br /><span className="fw-medium">{doctor.experience}</span></p>
            <p className="mb-1"><small className={getThemeClass('text-muted', 'text-secondary')}>Total Pasien:</small> <br /><span className="fw-medium">{doctor.totalPatients} pasien</span></p>
            <p className="mb-1"><small className={getThemeClass('text-muted', 'text-secondary')}>Status:</small> <br /><span className={`badge ${doctor.status === 'Aktif' ? 'bg-success' : 'bg-danger'}`}>{doctor.status}</span></p>
            <p className="mb-1"><small className={getThemeClass('text-muted', 'text-secondary')}>Tanggal Bergabung:</small> <br /><span className="fw-medium">{doctor.joinedDate}</span></p>
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

// --- Komponen Modal untuk Tambah/Edit Dokter ---
const AddEditDoctorModal = ({ show, handleClose, doctor, theme, onSave }) => {
  const [formData, setFormData] = useState({
    id: doctor ? doctor.id : null,
    name: doctor ? doctor.name : '',
    specialization: doctor ? doctor.specialization : '',
    contactEmail: doctor ? doctor.contactEmail : '',
    contactPhone: doctor ? doctor.contactPhone : '',
    schedule: doctor ? doctor.schedule : '',
    experience: doctor ? doctor.experience : '',
    status: doctor ? doctor.status : 'Aktif',
    password: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (doctor) {
      setFormData({
        id: doctor.id,
        name: doctor.name,
        specialization: doctor.specialization,
        contactEmail: doctor.contactEmail,
        contactPhone: doctor.contactPhone,
        schedule: doctor.schedule,
        experience: doctor.experience,
        totalPatients: doctor.totalPatients,
        status: doctor.status,
        password: '',
      });
    } else {
      setFormData({
        id: null,
        name: '',
        specialization: '',
        contactEmail: '',
        contactPhone: '',
        schedule: '',
        experience: '',
        totalPatients: 0,
        status: 'Aktif',
        password: '',
      });
    }
  }, [doctor]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await onSave(formData);
      handleClose();
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getThemeClass = (darkClass, lightClass) => theme === 'dark' ? darkClass : lightClass;

  return (
    <Modal show={show} onHide={handleClose} centered size="lg" dialogClassName={getThemeClass('modal-dark', '')}>
      <Modal.Header closeButton className={getThemeClass('bg-dark text-white border-secondary', 'bg-light text-dark border-light')}>
        <Modal.Title className={getThemeClass('text-white', 'text-dark')}>{doctor ? 'Edit Dokter' : 'Tambah Dokter Baru'}</Modal.Title>
      </Modal.Header>
      <Modal.Body className={getThemeClass('bg-dark text-white', 'bg-white text-dark')}>
        <Form onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="formDoctorName">
              <Form.Label className={getThemeClass('text-light', 'text-dark')}>Nama Dokter</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={isSubmitting}
                className={getThemeClass('bg-secondary text-white border-secondary', 'bg-light text-dark border-secondary')}
              />
            </Form.Group>
            <Form.Group as={Col} controlId="formSpecialization">
              <Form.Label className={getThemeClass('text-light', 'text-dark')}>Spesialisasi</Form.Label>
              <Form.Select
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                required
                disabled={isSubmitting}
                className={getThemeClass('bg-secondary text-white border-secondary', 'bg-light text-dark border-secondary')}
              >
                <option value="">Pilih Spesialisasi</option>
                <option value="Umum">Umum</option>
                <option value="Kardiologi">Kardiologi</option>
                <option value="Dermatologi">Dermatologi</option>
                <option value="Pediatri">Pediatri</option>
                <option value="Ortopedi">Ortopedi</option>
                <option value="Neurologi">Neurologi</option>
                <option value="Mata">Mata</option>
                <option value="THT">THT</option>
                <option value="Psikiatri">Psikiatri</option>
                <option value="Bedah">Bedah</option>
              </Form.Select>
            </Form.Group>
          </Row>

          <Row className="mb-3">
            <Form.Group as={Col} controlId="formContactEmail">
              <Form.Label className={getThemeClass('text-light', 'text-dark')}>Email Kontak (untuk Login)</Form.Label>
              <Form.Control
                type="email"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleChange}
                required
                disabled={isSubmitting}
                className={getThemeClass('bg-secondary text-white border-secondary', 'bg-light text-dark border-secondary')}
              />
              <Form.Text className={getThemeClass('text-muted', 'text-secondary')}>
                Email ini akan digunakan sebagai username untuk login dokter.
              </Form.Text>
            </Form.Group>
            <Form.Group as={Col} controlId="formContactPhone">
              <Form.Label className={getThemeClass('text-light', 'text-dark')}>Telepon Kontak</Form.Label>
              <Form.Control
                type="tel"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleChange}
                disabled={isSubmitting}
                className={getThemeClass('bg-secondary text-white border-secondary', 'bg-light text-dark border-secondary')}
              />
            </Form.Group>
          </Row>

          {!doctor && (
            <Form.Group className="mb-3" controlId="formPassword">
              <Form.Label className={getThemeClass('text-light', 'text-dark')}>Kata Sandi (untuk Login)</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
                disabled={isSubmitting}
                className={getThemeClass('bg-secondary text-white border-secondary', 'bg-light text-dark border-secondary')}
              />
              <Form.Text className={getThemeClass('text-muted', 'text-secondary')}>
                Password minimal 6 karakter. Dokter dapat mengubah password setelah login pertama.
              </Form.Text>
            </Form.Group>
          )}

          <Form.Group className="mb-3" controlId="formSchedule">
            <Form.Label className={getThemeClass('text-light', 'text-dark')}>Jadwal</Form.Label>
            <Form.Control
              type="text"
              name="schedule"
              value={formData.schedule}
              onChange={handleChange}
              disabled={isSubmitting}
              placeholder="Contoh: Senin-Jumat 08:00-16:00"
              className={getThemeClass('bg-secondary text-white border-secondary', 'bg-light text-dark border-secondary')}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formExperience">
            <Form.Label className={getThemeClass('text-light', 'text-dark')}>Pengalaman</Form.Label>
            <Form.Control
              type="text"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              disabled={isSubmitting}
              placeholder="Contoh: 5 tahun"
              className={getThemeClass('bg-secondary text-white border-secondary', 'bg-light text-dark border-secondary')}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formStatus">
            <Form.Label className={getThemeClass('text-light', 'text-dark')}>Status</Form.Label>
            <Form.Select
              name="status"
              value={formData.status}
              onChange={handleChange}
              disabled={isSubmitting}
              className={getThemeClass('bg-secondary text-white border-secondary', 'bg-light text-dark border-secondary')}
            >
              <option value="Aktif">Aktif</option>
              <option value="Cuti">Cuti</option>
              <option value="Tidak Aktif">Tidak Aktif</option>
            </Form.Select>
          </Form.Group>

          <Modal.Footer className={getThemeClass('bg-dark text-white border-secondary', 'bg-light text-dark border-light')}>
            <Button variant="secondary" onClick={handleClose} disabled={isSubmitting}>
              Batal
            </Button>
            <Button variant="primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Spinner as="span" animation="border" size="sm" role="status" className="me-2" />
                  {doctor ? 'Menyimpan...' : 'Menambah...'}
                </>
              ) : (
                doctor ? 'Simpan Perubahan' : 'Tambah Dokter'
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

// --- Komponen Modal untuk Konfirmasi Hapus ---
const DeleteConfirmationModal = ({ show, handleClose, handleConfirm, doctorName, theme, isDeleting }) => {
  const getThemeClass = (darkClass, lightClass) => theme === 'dark' ? darkClass : lightClass;

  return (
    <Modal show={show} onHide={handleClose} centered dialogClassName={getThemeClass('modal-dark', '')}>
      <Modal.Header closeButton className={getThemeClass('bg-dark text-white border-secondary', 'bg-light text-dark border-light')}>
        <Modal.Title className={getThemeClass('text-white', 'text-dark')}>Konfirmasi Hapus</Modal.Title>
      </Modal.Header>
      <Modal.Body className={getThemeClass('bg-dark text-white', 'bg-white text-dark')}>
        <p>Apakah Anda yakin ingin menghapus dokter <strong>{doctorName}</strong>?</p>
        <p className="text-danger">Tindakan ini akan:</p>
        <ul className="text-danger">
          <li>Menghapus data dokter dari sistem</li>
          <li>Menghapus akun login dokter</li>
          <li>Tidak dapat dibatalkan</li>
        </ul>
      </Modal.Body>
      <Modal.Footer className={getThemeClass('bg-dark text-white border-secondary', 'bg-light text-dark border-light')}>
        <Button variant="secondary" onClick={handleClose} disabled={isDeleting}>
          Batal
        </Button>
        <Button variant="danger" onClick={handleConfirm} disabled={isDeleting}>
          {isDeleting ? (
            <>
              <Spinner as="span" animation="border" size="sm" role="status" className="me-2" />
              Menghapus...
            </>
          ) : (
            'Hapus'
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

// --- Main Component ---
const ManageDoctors = () => {
  const { theme } = useTheme();
  const [doctors, setDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedMonthYear, setSelectedMonthYear] = useState(dayjs());

  // State untuk filter
  const [filterSpecialization, setFilterSpecialization] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  // State untuk data appointments
  const [appointmentsData, setAppointmentsData] = useState([]);
  const [doctorPatientCounts, setDoctorPatientCounts] = useState({});

  // Toast notifications
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState('success');

  // States untuk modal detail dokter
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  // States untuk modal tambah/edit dokter
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [doctorToEdit, setDoctorToEdit] = useState(null);

  // States untuk modal konfirmasi hapus
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [doctorToDeleteId, setDoctorToDeleteId] = useState(null);
  const [doctorToDeleteName, setDoctorToDeleteName] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // Load data appointments untuk menghitung total pasien
  useEffect(() => {
    const loadAppointments = async () => {
      try {
        const appointments = await axios.get("http://localhost:5000/appointments");
        setAppointmentsData(appointments.data);
        
        const patientCounts = calculateDoctorPatientCounts(appointments.data);
        setDoctorPatientCounts(patientCounts);
      } catch (error) {
        console.error('Error loading appointments:', error);
      }
    };
    loadAppointments();
  }, []);

  // Load data dokter dari API
  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      setError('');
      try {
        const doctorsFromAPI = await fetchDoctorsFromAPI();
        
        const doctorsWithPatientCounts = doctorsFromAPI.map(doctor => ({
          ...doctor,
          totalPatients: doctorPatientCounts[doctor.id] || 0
        }));
        
        setDoctors(doctorsWithPatientCounts);
        
      } catch (err) {
        console.error("Error fetching doctors:", err);
        setError('Gagal memuat data dokter dari server.');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, [doctorPatientCounts]);

  // Filter dokter berdasarkan pencarian dan filter
  const filteredDoctors = doctors.filter(doctor =>
    ((doctor.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
     (doctor.contactEmail || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
     (doctor.contactPhone || "").includes(searchTerm)) &&
    (filterSpecialization ? (doctor.specialization || "").toLowerCase() === filterSpecialization.toLowerCase() : true) &&
    (filterStatus ? (doctor.status || "").toLowerCase() === filterStatus.toLowerCase() : true)
  );

  // --- Helper parsing tanggal Indonesia ---
  const BULAN_ID = {
    januari: 0, februari: 1, maret: 2, april: 3, mei: 4, juni: 5,
    juli: 6, agustus: 7, september:8, oktober:9, november:10, desember:11
  };

  function parseTanggalIndo(str) {
    if (!str) return null;
    if (/^\d{4}-\d{2}-\d{2}$/.test(str)) return new Date(str);
    const match = str.match(/^(\d{1,2}) ([A-Za-z]+) (\d{4})$/i);
    if (match) {
      const tgl = parseInt(match[1]);
      const bln = match[2].toLowerCase();
      const thn = parseInt(match[3]);
      if (BULAN_ID.hasOwnProperty(bln)) {
        return new Date(thn, BULAN_ID[bln], tgl);
      }
    }
    return null;
  }

  // Calculate summary stats
  const totalDoctors = doctors.length;
  const activeDoctors = doctors.filter(d => d.status === 'Aktif').length;
  const uniqueSpecializations = [...new Set(doctors.map(d => d.specialization))].length;
  
  const newDoctorsCustomMonth = doctors.filter((d) => {
    if (!d.joinedDate) return false;
    let joinDate = parseTanggalIndo(d.joinedDate);
    if (!joinDate || isNaN(joinDate)) return false;
    return (
      joinDate.getMonth() === selectedMonthYear.$M &&
      joinDate.getFullYear() === selectedMonthYear.$y
    );
  }).length;

  // Toast helper function
  const showNotification = (message, variant = 'success') => {
    setToastMessage(message);
    setToastVariant(variant);
    setShowToast(true);
  };

  // --- Handlers untuk Modal ---
  const handleShowDetail = (doctor) => {
    setSelectedDoctor(doctor);
    setShowDetailModal(true);
  };

  const handleCloseDetail = () => {
    setShowDetailModal(false);
    setSelectedDoctor(null);
  };

  const handleAddDoctorClick = () => {
    setDoctorToEdit(null);
    setShowAddEditModal(true);
  };

  const handleEditClick = (doctor) => {
    setDoctorToEdit(doctor);
    setShowAddEditModal(true);
  };

  const handleCloseAddEditModal = () => {
    setShowAddEditModal(false);
    setDoctorToEdit(null);
  };

  const handleSaveDoctor = async (formData) => {
    try {
      if (formData.id) {
        const updatedDoctor = await updateDoctorInAPI(formData);
        
        const updatedDoctors = doctors.map(doc =>
          doc.id === formData.id ? { 
            ...updatedDoctor, 
            totalPatients: doctorPatientCounts[formData.id] || 0
          } : doc
        );
        setDoctors(updatedDoctors);
        
        showNotification('Dokter berhasil diperbarui!', 'success');
      } else {
        const newDoctor = await addDoctorToAPI(formData);
        
        const updatedDoctors = [...doctors, newDoctor];
        setDoctors(updatedDoctors);
        
        showNotification(`Dokter ${formData.name} berhasil ditambahkan!`, 'success');
      }
    } catch (error) {
      console.error('Error saving doctor:', error);
      showNotification('Gagal menyimpan dokter.', 'danger');
    }
  };

  const handleDeleteClick = (doctorId, doctorName) => {
    setDoctorToDeleteId(doctorId);
    setDoctorToDeleteName(doctorName);
    setShowDeleteConfirmModal(true);
  };

  const handleCloseDeleteConfirmModal = () => {
    setShowDeleteConfirmModal(false);
    setDoctorToDeleteId(null);
    setDoctorToDeleteName('');
  };

  const handleConfirmDelete = async () => {
    if (!doctorToDeleteId) return;
    
    setIsDeleting(true);
    try {
      await deleteDoctorFromAPI(doctorToDeleteId);
      
      const updatedDoctors = doctors.filter(d => d.id !== doctorToDeleteId);
      setDoctors(updatedDoctors);
      
      showNotification(`Dokter ${doctorToDeleteName} berhasil dihapus!`, 'success');
      handleCloseDeleteConfirmModal();
      
    } catch (error) {
      console.error('Error deleting doctor:', error);
      showNotification('Gagal menghapus dokter.', 'danger');
    } finally {
      setIsDeleting(false);
    }
  };

  const specializationColors = {
    "Umum": { background: "#e8f4fd", color: "#1976d2" },
    "Kardiologi": { background: "#ffe5e5", color: "#d32f2f" },
    "Dermatologi": { background: "#f3e5f5", color: "#8e24aa" },
    "Pediatri": { background: "#e8fce8", color: "#388e3c" },
    "Ortopedi": { background: "#e0f7fa", color: "#00838f" },
    "Neurologi": { background: "#ede7f6", color: "#5e35b1" },
    "Mata": { background: "#fff3e0", color: "#ef6c00" },
    "THT": { background: "#fce4ec", color: "#c2185b" },
    "Psikiatri": { background: "#f8bbd0", color: "#c2185b" },
    "Bedah": { background: "#f1f8e9", color: "#33691e" }
  };

  return (
    <Container
      fluid
      className={`py-4 ${
        theme === "dark" ? "text-white" : "text-dark"
      }`}
    >
      <Row className="mb-4 align-items-center">
        <Col>
          <h1
            className={`mb-0 ${
              theme === "dark" ? "text-white" : "text-dark"
            }`}
          >
            Manajemen Dokter
          </h1>
          <p
            className={`lead mb-0 ${
              theme === "dark" ? "text-light" : "text-muted"
            }`}
          >
            Kelola data dokter rumah sakit
          </p>
        </Col>
      </Row>

      {/* --- SUMMARY CARDS --- */}
      <Row className="g-4 mb-5">
        <Col md={6} lg={3}>
          <Card
            className="h-100 shadow-sm"
            style={{
              minHeight: 190,
              background: "#DCF2FF",
              border: "none",
              borderRadius: 16,
            }}
          >
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <Card.Title className="h6 text-info mb-0">
                  Total Dokter
                </Card.Title>
                <LocalHospitalIcon sx={{ fontSize: 36, color: "#0dbfe6" }} />
              </div>
              <h3 className="fw-bold text-info">{totalDoctors}</h3>
              <Card.Text>
                <small className="text-info">Seluruh data</small>
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} lg={3}>
          <Card
            className="h-100 shadow-sm"
            style={{
              minHeight: 190,
              background: "#E6FFF2",
              border: "none",
              borderRadius: 16,
            }}
          >
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <Card.Title className="h6 text-success mb-0">
                  Dokter Aktif
                </Card.Title>
                <CheckCircleIcon
                  sx={{ fontSize: 36, color: "#15d168" }}
                />
              </div>
              <h3 className="fw-bold text-success">{activeDoctors}</h3>
              <Card.Text>
                <small className="text-success">Status Aktif</small>
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} lg={3}>
          <Card
            className="h-100 shadow-sm"
            style={{ background: "#FFF3E0", border: "none", borderRadius: 16 }}
          >
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <Card.Title className="h6" style={{ color: "#FF9800" }}>Dokter Baru</Card.Title>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#FF9800" }}>
                    {selectedMonthYear.format("MMMM YYYY")}
                  </span>
                </div>
                <CalendarMonthIcon sx={{ fontSize: 36, color: "#FF9800" }}/>
              </div>
              <h3 className="fw-bold" style={{ color: "#FF9800" }}>{newDoctorsCustomMonth}</h3>
              <div className="w-100 mt-2">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    views={['year', 'month']}
                    label="Bulan & Tahun"
                    value={selectedMonthYear}
                    onChange={setSelectedMonthYear}
                    format="MMMM YYYY"
                    slotProps={{
                      textField: {
                        size: 'small',
                        variant: 'outlined',
                        fullWidth: true,
                        sx: { background:'#fff', borderRadius: '8px' }
                      }
                    }}
                    sx={{
                      width:'100%',
                      mt:1
                    }}
                  />
                </LocalizationProvider>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} lg={3}>
          <Card
            className="h-100 shadow-sm"
            style={{
              minHeight: 190,
              background: "#E9E0FF",
              border: "none",
              borderRadius: 16,
            }}
          >
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <Card.Title className="h6 text-primary mb-0">
                  Spesialisasi
                </Card.Title>
                <BarChartIcon
                  sx={{ fontSize: 36, color: "#4972ee" }}
                />
              </div>
              <h3 className="fw-bold text-primary">{uniqueSpecializations}</h3>
              <Card.Text>
                <small className="text-primary">Keahlian berbeda</small>
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* --- SEARCH & FILTER --- */}
      <Card
        className={`shadow-sm mb-4 border-0 search-card ${
          theme === "dark"
            ? "bg-dark text-white"
            : "bg-white text-dark"
        }`}
        style={{
          borderRadius: 20,
          boxShadow: theme === "dark"
            ? "0 0 12px #1ae1ff12"
            : "0 4px 28px #237cbd13, 0 1.5px 0 #85f2ff15",
          background: theme === "dark" ? "#181937" : "#fafdff"
        }}
      >
        <Card.Body>
          <div className="d-flex align-items-start mb-3">
            <div
              className="d-flex flex-column align-items-center justify-content-center rounded-circle me-3"
              style={{
                width: 54, height: 54,
                background: theme === "dark" ? "#292c43" : "#EAF7FF",
              }}>
              <i className="bi bi-search" style={{
                color: theme === "dark" ? "#1ae1ff" : "#1380ee",
                fontSize: 34
              }} />
            </div>
            <div>
              <Card.Title className="mb-1 h5" 
                style={{letterSpacing: 0.5}}>
                Cari Dokter
              </Card.Title>
              <Card.Text className={theme === "dark" ? "text-light" : "text-muted"}>
                Temukan dokter berdasarkan nama, email, telepon, spesialisasi, atau status
              </Card.Text>
            </div>
          </div>
          <Row className="g-3 align-items-center mb-2">
            <Col md={6}>
              <InputGroup>
                <InputGroup.Text
                  className={
                    theme === "dark" ? "bg-secondary text-white border-secondary" : ""
                  }
                >
                  <i className="bi bi-person-lines-fill"></i>
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Cari nama, email, atau telepon..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className={theme === "dark" 
                    ? "bg-secondary text-white border-secondary"
                    : ""}
                />
              </InputGroup>
            </Col>
            <Col md={2}>
              <Form.Select
                value={filterSpecialization}
                onChange={e => setFilterSpecialization(e.target.value)}
                className={theme === "dark"
                  ? "bg-secondary text-white border-secondary"
                  : ""}
              >
                <option value="">Spesialisasi</option>
                <option value="Umum">Umum</option>
                <option value="Kardiologi">Kardiologi</option>
                <option value="Dermatologi">Dermatologi</option>
                <option value="Pediatri">Pediatri</option>
                <option value="Ortopedi">Ortopedi</option>
                <option value="Neurologi">Neurologi</option>
                <option value="Mata">Mata</option>
                <option value="THT">THT</option>
                <option value="Psikiatri">Psikiatri</option>
                <option value="Bedah">Bedah</option>
              </Form.Select>
            </Col>
            <Col md={2}>
              <Form.Select
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
                className={theme === "dark"
                  ? "bg-secondary text-white border-secondary"
                  : ""}
              >
                <option value="">Status</option>
                <option value="Aktif">Aktif</option>
                <option value="Cuti">Cuti</option>
                <option value="Tidak Aktif">Tidak Aktif</option>
              </Form.Select>
            </Col>
            <Col md={2}>
              <Button
                variant={theme === "dark" ? "info" : "primary"}
                onClick={() => {
                  setSearchTerm("");
                  setFilterSpecialization("");
                  setFilterStatus("");
                }}
                className="me-2"
              >
                <i className="bi bi-arrow-clockwise"></i> Reset
              </Button>
              <Button
                variant="success"
                onClick={handleAddDoctorClick}
              >
                <i className="bi bi-plus-lg"></i>
              </Button>
            </Col>
          </Row>
        </Card.Body>

        <style>{`
          .search-card {
            transition: box-shadow .18s,transform .18s;
          }
          .search-card:hover {
            box-shadow: 0 4px 32px #18e1c424;
            transform: translateY(-2px) scale(1.01);
            background: #f0f9ff;
          }
          @media (max-width: 900px) {
            .search-card .row .col-md-2,
            .search-card .row .col-md-6 {
              flex: 0 0 100%;
              max-width: 100%;
              margin-bottom: 0.8rem;
            }
          }
        `}</style>
      </Card>

      {/* Error Alert */}
      {error && (
        <Alert variant="danger" className="mb-3">
          {error}
        </Alert>
      )}

      {/* --- TABLE --- */}
      <Card
        className={`shadow-sm mb-4 ${
          theme === "dark"
            ? "bg-dark text-white border-secondary"
            : "bg-white text-dark border-light"
        }`}
      >
        <Card.Body>
          <Card.Title
            className={`h5 mb-3 ${theme === "dark" ? "text-white" : "text-dark"}`}
          >
            Daftar Dokter
          </Card.Title>
          <Card.Text className={theme === "dark" ? "text-light" : "text-muted"}>
            Menampilkan {filteredDoctors.length} dari {doctors.length} dokter
          </Card.Text>
          {loading ? (
            <HospitalLoader dark={theme === "dark"} />
          ) : (
            <div className="table-responsive">
              <Table
                striped
                bordered
                hover
                variant={theme === "dark" ? "dark" : "light"}
                className="mb-0"
              >
                <thead>
                  <tr style={{ background: "#f7fafc" }}>
                    <th>Nama</th>
                    <th>Spesialisasi</th>
                    <th>Kontak</th>
                    <th>Total Pasien</th>
                    <th>Status</th>
                    <th>Pengalaman</th>
                    <th>Bergabung</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDoctors.map((doctor) => {
                    const badgeStyle = specializationColors[doctor.specialization] || {
                      background: "#eeeeee",
                      color: "#424242"
                    };

                    const statusColor =
                      doctor.status === "Aktif"
                        ? "#13c77b"
                        : doctor.status === "Cuti"
                        ? "#ff9800"
                        : "#e34646";

                    const statusIcon =
                      doctor.status === "Aktif" ? (
                        <i className="bi bi-check2-circle me-1"></i>
                      ) : doctor.status === "Cuti" ? (
                        <i className="bi bi-clock me-1"></i>
                      ) : (
                        <i className="bi bi-x-octagon me-1"></i>
                      );

                    return (
                      <tr key={doctor.id}>
                        <td>
                          <span className="fw-bold">{doctor.name}</span>
                          <br />
                          <small className={theme === "dark" ? "text-light" : "text-muted"}>
                            {doctor.contactEmail}
                          </small>
                        </td>
                        <td>
                          <span
                            className="badge px-3 py-2 rounded-pill fw-semibold"
                            style={badgeStyle}
                          >
                            <i className="bi bi-hospital me-1"></i>
                            {doctor.specialization}
                          </span>
                        </td>
                        <td>{doctor.contactPhone || '-'}</td>
                        <td>
                          <span className="badge bg-info px-3 py-2">
                            {doctor.totalPatients} pasien
                          </span>
                        </td>
                        <td>
                          <span
                            className="badge px-3 py-2 rounded-pill fw-semibold d-flex align-items-center gap-2"
                            style={{
                              background: statusColor,
                              color: "#fff"
                            }}
                          >
                            {statusIcon}
                            {doctor.status}
                          </span>
                        </td>
                        <td>{doctor.experience || '-'}</td>
                        <td>{doctor.joinedDate}</td>
                        <td>
                          <Button
                            variant="btn btn-info"
                            size="sm"
                            className="me-2"
                            onClick={() => handleShowDetail(doctor)}
                          >
                            <i className="bi bi-eye me-1"></i>Detail
                          </Button>
                          <Button
                            variant="btn btn-warning"
                            size="sm"
                            className="me-2"
                            onClick={() => handleEditClick(doctor)}
                          >
                            <i className="bi bi-pencil me-1"></i>Edit
                          </Button>
                          <Button
                            variant="btn btn-danger"
                            size="sm"
                            onClick={() => handleDeleteClick(doctor.id, doctor.name)}
                          >
                            <i className="bi bi-trash"></i>
                          </Button>
                        </td>
                      </tr>
                    );
                  })}

                  {filteredDoctors.length === 0 && (
                    <tr>
                      <td colSpan="8" className="text-center text-muted py-3">
                        Tidak ada dokter yang ditemukan.
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Modals */}
      <DoctorDetailModal
        show={showDetailModal}
        handleClose={handleCloseDetail}
        doctor={selectedDoctor}
        theme={theme}
      />

      <AddEditDoctorModal
        show={showAddEditModal}
        handleClose={handleCloseAddEditModal}
        doctor={doctorToEdit}
        theme={theme}
        onSave={handleSaveDoctor}
      />

      <DeleteConfirmationModal
        show={showDeleteConfirmModal}
        handleClose={handleCloseDeleteConfirmModal}
        handleConfirm={handleConfirmDelete}
        doctorName={doctorToDeleteName}
        theme={theme}
        isDeleting={isDeleting}
      />

      {/* Toast Notification */}
      <ToastNotification
        message={toastMessage}
        variant={toastVariant}
        show={showToast}
        onClose={() => setShowToast(false)}
      />

      {/* mini animasi untuk hover efek */}
      <style>
        {`
        .card {
          transition: box-shadow .18s,transform .16s;
        }
        .card:hover {
          box-shadow: 0 4px 32px #29c0e914;
          transform: translateY(-2px) scale(1.02);
        }
        .badge.bg-success {
          background: linear-gradient(90deg,#21d87e 40%,#57e8bd 100%) !important;
        }
        .badge.bg-danger {
          background: linear-gradient(90deg,#ff7878 10%,#ffc67c 100%) !important;
        }
        `}
      </style>
    </Container>
  );
};

export default ManageDoctors;