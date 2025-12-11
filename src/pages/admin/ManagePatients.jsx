"use client";
import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Table,
  InputGroup,
  Modal,
} from "react-bootstrap";
import { useTheme } from "../../contexts/ThemeContexts";
import axios from "axios";
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import BarChartIcon from "@mui/icons-material/BarChart";
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
        Loading data pasien...
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
// ----------------------------------

// --------- Fungsi Tanggal & Umur ---------
function getAgeFromDOB(dob) {
  if (!dob || dob === "-") return "-";
  const parts = dob.includes("-") ? dob.split("-") : [];
  let birth;
  if (parts.length === 3) {
    if (parseInt(parts[0], 10) > 1000) {
      birth = new Date(dob);
    } else {
      birth = new Date(parts[2], parts[1] - 1, parts[0]);
    }
  } else {
    birth = new Date(dob);
  }
  if (!(birth instanceof Date) || isNaN(birth)) return "-";
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

// ---- MODAL DETAIL PASIEN -----
const PatientDetailModal = ({ show, handleClose, patient, theme }) => {
  if (!patient) return null;
  const getThemeClass = (darkClass, lightClass) =>
    theme === "dark" ? darkClass : lightClass;
  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      size="lg"
      dialogClassName={theme === "dark" ? "modal-dark" : ""}
    >
      <Modal.Header
        closeButton
        className={getThemeClass(
          "bg-dark text-white border-secondary",
          "bg-light text-dark border-light"
        )}
      >
        <Modal.Title
          className={getThemeClass("text-white", "text-dark")}
        >{`Detail Pasien: ${patient.name}`}</Modal.Title>
      </Modal.Header>
      <Modal.Body
        className={getThemeClass(
          "bg-dark text-white",
          "bg-white text-dark"
        )}
      >
        <Row className="g-3">
          <Col md={6}>
            <p className="mb-1">
              <small className={getThemeClass("text-muted", "text-secondary")}>
                Email:
              </small>
              <br />
              <span className="fw-medium">{patient.email}</span>
            </p>
            <p className="mb-1">
              <small className={getThemeClass("text-muted", "text-secondary")}>
                Kontak:
              </small>
              <br />
              <span className="fw-medium">{patient.contact}</span>
            </p>
            <p className="mb-1">
              <small className={getThemeClass("text-muted", "text-secondary")}>
                Alamat:
              </small>
              <br />
              <span className="fw-medium">{patient.address}</span>
            </p>
            <p className="mb-1">
              <small className={getThemeClass("text-muted", "text-secondary")}>
                Umur:
              </small>
              <br />
              <span className="fw-medium">{patient.age} tahun</span>
            </p>
          </Col>
          <Col md={6}>
            <p className="mb-1">
              <small className={getThemeClass("text-muted", "text-secondary")}>
                Jenis Kelamin:
              </small>
              <br />
              <span className="fw-medium">{patient.gender}</span>
            </p>
            <p className="mb-1">
              <small className={getThemeClass("text-muted", "text-secondary")}>
                Status:
              </small>
              <br />
              <span
                className={`badge ${
                  patient.status === "Aktif" ? "bg-success" : "bg-danger"
                } text-white`}
              >
                {patient.status}
              </span>
            </p>
            <p className="mb-1">
              <small className={getThemeClass("text-muted", "text-secondary")}>
                Total Kunjungan:
              </small>
              <br />
              <span className="fw-medium">{patient.totalVisits}</span>
            </p>
            <p className="mb-1">
              <small className={getThemeClass("text-muted", "text-secondary")}>
                Tanggal Daftar:
              </small>
              <br />
              <span className="fw-medium">{patient.registrationDate}</span>
            </p>
            <p className="mb-1">
              <small className={getThemeClass("text-muted", "text-secondary")}>
                Riwayat Medis:
              </small>
              <br />
              <span className="fw-medium">
                {patient.medicalHistory || "-"}
              </span>
            </p>
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer
        className={getThemeClass(
          "bg-dark text-white border-secondary",
          "bg-light text-dark border-light"
        )}
      >
        <Button variant="secondary" onClick={handleClose}>
          Tutup
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

// ---- MODAL HAPUS PASIEN -----
const DeleteConfirmationModal = ({
  show,
  handleClose,
  handleConfirm,
  patientName,
  theme,
}) => {
  const getThemeClass = (darkClass, lightClass) =>
    theme === "dark" ? darkClass : lightClass;
  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      dialogClassName={theme === "dark" ? "modal-dark" : ""}
    >
      <Modal.Header
        closeButton
        className={getThemeClass(
          "bg-dark text-white border-secondary",
          "bg-light text-dark border-light"
        )}
      >
        <Modal.Title className={getThemeClass("text-white", "text-dark")}>
          Konfirmasi Hapus
        </Modal.Title>
      </Modal.Header>
      <Modal.Body
        className={getThemeClass("bg-dark text-white", "bg-white text-dark")}
      >
        <p>
          Yakin ingin menghapus pasien <strong>{patientName}</strong>? Tindakan
          ini tidak dapat dibatalkan.
        </p>
      </Modal.Body>
      <Modal.Footer
        className={getThemeClass(
          "bg-dark text-white border-secondary",
          "bg-light text-dark border-light"
        )}
      >
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

const ManagePatients = () => {
  const { theme } = useTheme();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMonthYear, setSelectedMonthYear] = useState(dayjs());

  // Modal detail
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  // Modal delete
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [patientToDeleteId, setPatientToDeleteId] = useState(null);
  const [patientToDeleteName, setPatientToDeleteName] = useState("");

  const [filterGender, setFilterGender] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  

  // Ambil data
  useEffect(() => {
    async function loadPatients() {
      setLoading(true);
      try {
        const usersRes = await axios.get("http://localhost:5000/users?role=patient");
        const users = usersRes.data;
        const profilesRes = await axios.get("http://localhost:5000/profiles");
        const profiles = profilesRes.data;
        const appointmentsRes = await axios.get("http://localhost:5000/appointments");
        const appointments = appointmentsRes.data;
  
        const merged = users.map((user) => {
          const prof = profiles.find((p) => p.userId === String(user.id));
          const kunjunganSelesai = appointments.filter(
            (a) => a.userId === user.id && (a.status || "").toLowerCase() === "selesai"
          ).length;
          return {
            id: user.id,
            profileId: prof?.id || "",
            name: user.name || "-",
            email: user.email || "-",
            contact: prof?.phone || "-",
            address: prof?.address || "-",
            age: prof?.dob ? getAgeFromDOB(prof.dob) : "-",
            gender: prof?.gender || "-",
            status: prof?.status && prof.status !== "" ? prof.status : "Aktif",
            totalVisits: kunjunganSelesai,
            registrationDate: prof?.joinedSince || "-",
            medicalHistory: prof?.medicalHistory || "-",
          };
        });
        setPatients(merged);
      } catch (e) {
        setPatients([]);
        console.error("Gagal load pasien", e);
      }
      setLoading(false);
    }
    loadPatients();
  }, []);

  // Search/filter
  const filteredPatients = patients.filter(
    (p) =>
      ((p.name || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
        (p.email || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (p.contact || "").includes(searchTerm)) &&
      (filterGender ? (p.gender || "").toLowerCase() === filterGender.toLowerCase() : true) &&
      (filterStatus ? (p.status || "").toLowerCase() === filterStatus.toLowerCase() : true)
  );

  // Summary
  // --- Helper Bulan Indonesia ---
const BULAN_ID = {
  januari: 0, februari: 1, maret: 2, april: 3, mei: 4, juni: 5,
  juli: 6, agustus: 7, september:8, oktober:9, november:10, desember:11
};

function parseTanggalIndo(str) {
  if (!str) return null;
  // ISO format langsung pakai new Date
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) return new Date(str);
  // Format: "31 Juli 2025"
  const match = str.match(/^(\d{1,2}) ([A-Za-z]+) (\d{4})$/i);
  if (match) {
    const tgl = parseInt(match[1]);
    const bln = match[2].toLowerCase();
    const thn = parseInt(match[3]);
    if (BULAN_ID.hasOwnProperty(bln)) {
      return new Date(thn, BULAN_ID[bln], tgl);
    }
  }
  // Fallback: parsing gagal
  return null;
}

// --- PERHITUNGAN SUMMARY ---
const totalPatients = patients.length;

const activePatients = patients.filter(
  (p) => (p.status || "").toLowerCase() === "aktif"
).length;

const newPatientsCustomMonth = patients.filter((p) => {
  if (!p.registrationDate) return false;
  let d = parseTanggalIndo(p.registrationDate);
  if (!d || isNaN(d)) return false;
  return (
    d.getMonth() === selectedMonthYear.$M &&
    d.getFullYear() === selectedMonthYear.$y
  );
}).length;

const averageVisits =
  totalPatients > 0
    ? (
        patients.reduce(
          (sum, p) => sum + (Number(p.totalVisits) || 0),
          0
        ) / totalPatients
      ).toFixed(0)
    : 0;

  // Modal
  const handleShowDetail = (patient) => {
    setSelectedPatient(patient);
    setShowDetailModal(true);
  };
  const handleCloseDetail = () => {
    setShowDetailModal(false);
    setSelectedPatient(null);
  };

  const handleDeleteClick = (patientId, patientName) => {
    setPatientToDeleteId(patientId);
    setPatientToDeleteName(patientName);
    setShowDeleteConfirmModal(true);
  };
  const handleConfirmDelete = async () => {
    setLoading(true);
    try {
      await axios.delete(`http://localhost:5000/users/${patientToDeleteId}`);
      const patient = patients.find((p) => p.id === patientToDeleteId);
      if (patient && patient.profileId)
        await axios.delete(
          `http://localhost:5000/profiles/${patient.profileId}`
        );
      setPatients(patients.filter((p) => p.id !== patientToDeleteId));
      setShowDeleteConfirmModal(false);
      setPatientToDeleteId(null);
      setPatientToDeleteName("");
    } catch (err) {
      alert("Gagal hapus pasien.");
    }
    setLoading(false);
  };
  const handleCancelDelete = () => {
    setShowDeleteConfirmModal(false);
    setPatientToDeleteId(null);
    setPatientToDeleteName("");
  };

  // ------------- UI --------------
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
            Manajemen Pasien
          </h1>
          <p
            className={`lead mb-0 ${
              theme === "dark" ? "text-light" : "text-muted"
            }`}
          >
            Kelola data pasien rumah sakit
          </p>
        </Col>
      </Row>
      {/* --- SUMMARY --- */}
      <Row className="g-4 mb-5">
        <Col md={6} lg={3}>
          <Card
            className="h-100 shadow-sm"
            style={{
              minHeight: 190,
              background: "#DCF2FF",
              border: "none",
              borderRadius: 5,
            }}
          >
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <Card.Title className="h6 text-info mb-0">
                  Total Pasien
                </Card.Title>
                <PeopleAltIcon sx={{ fontSize: 36, color: "#0dbfe6" }} />
              </div>
              <h3 className="fw-bold text-info">{totalPatients}</h3>
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
                  Pasien Aktif
                </Card.Title>
                <CheckCircleIcon
                  sx={{ fontSize: 36, color: "#15d168" }}
                />
              </div>
              <h3 className="fw-bold text-success">{activePatients}</h3>
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
                  <Card.Title className="h6" style={{ color: "#FF9800" }}>Pasien Baru</Card.Title>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#FF9800" }}>
                    {selectedMonthYear.format("MMMM YYYY")}
                  </span>
                </div>
                <CalendarMonthIcon sx={{ fontSize: 36, color: "#FF9800" }}/>
              </div>
              <h3 className="fw-bold" style={{ color: "#FF9800" }}>{newPatientsCustomMonth}</h3>
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
                  Rata-rata Kunjungan
                </Card.Title>
                <BarChartIcon
                  sx={{ fontSize: 36, color: "#4972ee" }}
                />
              </div>
              <h3 className="fw-bold text-primary">{averageVisits}</h3>
              <Card.Text>
                <small className="text-primary">Per pasien</small>
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      {/* --- SEARCH --- */}
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
          Cari Pasien
        </Card.Title>
        <Card.Text className={theme === "dark" ? "text-light" : "text-muted"}>
          Temukan pasien rumah sakit berdasarkan nama, email, telepon, gender, atau status
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
          value={filterGender}
          onChange={e => setFilterGender(e.target.value)}
          className={theme === "dark"
            ? "bg-secondary text-white border-secondary"
            : ""}
        >
          <option value="">Gender</option>
          <option value="Laki-Laki">Laki-laki</option>
          <option value="Perempuan">Perempuan</option>
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
          <option value="Tidak Aktif">Tidak Aktif</option>
        </Form.Select>
      </Col>
      <Col md={2}>
        <Button
          variant={theme === "dark" ? "info" : "primary"}
          onClick={() => {
            setSearchTerm("");
            setFilterGender("");
            setFilterStatus("");
          }}
        >
          <i className="bi bi-arrow-clockwise"></i> Reset
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
            Daftar Pasien
          </Card.Title>
          <Card.Text className={theme === "dark" ? "text-light" : "text-muted"}>
            Menampilkan {filteredPatients.length} dari {patients.length} pasien
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
                    <th>Kontak</th>
                    <th>Umur</th>
                    <th>Jenis Kelamin</th>
                    <th>Status</th>
                    <th>Total Kunjungan</th>
                    <th>Tanggal Daftar</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPatients.map((patient) => (
                    <tr key={patient.id}>
                      <td>
                        <span className="fw-bold">{patient.name}</span>
                        <br />
                        <small
                          className={theme === "dark" ? "text-light" : "text-muted"}
                        >
                          {patient.email}
                        </small>
                      </td>
                      <td>{patient.contact}</td>
                      <td>
                        <span className="fw-medium">{patient.age}</span> tahun
                      </td>
                      <td>
                      <span
                        className="badge px-3 py-2 rounded-pill fw-semibold"
                        style={{
                          background: patient.gender.toLowerCase().includes("laki")
                            ? "#e3f2fd"
                            : "#fce4ec",
                          color: patient.gender.toLowerCase().includes("laki")
                            ? "#1967d2"
                            : "#d81b60"
                        }}
                      >
                        {patient.gender.toLowerCase().includes("laki") ? (
                          <i className="bi bi-gender-male me-1"></i>
                        ) : (
                          <i className="bi bi-gender-female me-1"></i>
                        )}
                        {patient.gender}
                      </span>
                      </td>
                      <td>
                      <span className={`badge px-3 py-2 rounded-pill fw-semibold d-flex align-items-center gap-2`}
                          style={{
                            background: patient.status === "Aktif" ? "#13c77b" : "#e34646",
                            color: "#fff"
                          }}>
                          {patient.status === "Aktif" 
                          ? <i className="bi bi-check2-circle me-1"></i>
                          : <i className="bi bi-x-octagon me-1"></i>
                          }
                          {patient.status}
                        </span>
                      </td>
                      <td>{patient.totalVisits}</td>
                      <td>{patient.registrationDate}</td>
                      <td>
                        <Button
                          variant="btn btn-info"
                          size="sm"
                          className="me-2"
                          onClick={() => handleShowDetail(patient)}
                        >
                          <i className="bi bi-eye me-1"></i>Detail
                        </Button>
                        <Button
                          variant="btn btn-danger"
                          size="sm"
                          onClick={() =>
                            handleDeleteClick(patient.id, patient.name)
                          }
                        >
                          <i className="bi bi-trash"></i>
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {filteredPatients.length === 0 && (
                    <tr>
                      <td
                        colSpan="8"
                        className="text-center text-muted py-3"
                      >
                        Tidak ada pasien yang ditemukan.
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>
      {/* --- MODAL DETAIL --- */}
      <PatientDetailModal
        show={showDetailModal}
        handleClose={handleCloseDetail}
        patient={selectedPatient}
        theme={theme}
      />
      {/* --- MODAL HAPUS --- */}
      <DeleteConfirmationModal
        show={showDeleteConfirmModal}
        handleClose={handleCancelDelete}
        handleConfirm={handleConfirmDelete}
        patientName={patientToDeleteName}
        theme={theme}
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

export default ManagePatients;