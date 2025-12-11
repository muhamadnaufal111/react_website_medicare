// src/pages/PatientDashboard.jsx
"use client"; // Jika menggunakan Next.js, pastikan ini ada

import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import Image from "react-bootstrap/Image"; 
import Spinner from "react-bootstrap/Spinner"; 

import { useAuth } from "../../contexts/AuthContexts";
import { Link as RouterLink } from "react-router-dom"; 
import { useTheme } from "../../contexts/ThemeContexts";

import AOS from "aos";
import "aos/dist/aos.css";

import HistoryIcon from '@mui/icons-material/History';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PharmaIcon from '@mui/icons-material/LocalPharmacy';
import ArticleIcon from '@mui/icons-material/Article';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const fadeUpVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.6,
      type: "spring",
      stiffness: 100,
    },
  }),
};

const Dashboard = () => {
  const { user } = useAuth(); // Ambil user dari context
  const { theme } = useTheme(); // Ambil theme dari context
  const [profileData, setProfileData] = useState(null);
  const [stats, setStats] = useState({
    totalAppointments: 0,
    activePrescriptions: 0,
    upcomingAppointments: 0,
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });

    // Fetch data saat komponen dimuat jika user ada
    if (user) {
      fetchDashboardData(user.id);
    } else {
      setLoading(false); // Jika tidak ada user, hentikan loading
    }
  }, [user]); // Re-run effect jika user berubah

  const fetchDashboardData = async (userId) => {
    setLoading(true);
    try {
      // Fetch profile data
      const profileResponse = await fetch(`http://localhost:5000/profiles?userId=${userId}`);
      if (!profileResponse.ok) {
        throw new Error("Gagal mengambil data profil.");
      }
      const profileDataArray = await profileResponse.json();
      const fetchedProfile = profileDataArray.length > 0 ? profileDataArray[0] : null;
      setProfileData(fetchedProfile);

      // Fetch appointment data (untuk mengisi stats)
      const appointmentsResponse = await fetch(`http://localhost:5000/appointments?userId=${userId}`);
      if (!appointmentsResponse.ok) {
        throw new Error("Gagal mengambil data janji temu.");
      }
      const appointments = await appointmentsResponse.json();

      // Fetch activities data (simulasi dari JSON dummy)
      const activitiesResponse = await fetch(`http://localhost:5000/activities?userId=${userId}`);
      if (!activitiesResponse.ok) {
        throw new Error("Gagal mengambil data aktivitas.");
      }
      const activities = await activitiesResponse.json();

      // Proses data untuk mengisi stats dan recent activities
      let totalAppointments = 0;
      let upcomingAppointments = 0;
      let activePrescriptions = 0; // Ini harusnya dari data resep, tapi kita ambil dari profile jika ada
      const recentActivitiesList = [];

      // Stats dari Profile Data (jika ada)
      if (fetchedProfile) {
        totalAppointments = fetchedProfile.totalVisits || 0;
        upcomingAppointments = fetchedProfile.upcomingAppointments || 0;
        activePrescriptions = fetchedProfile.activePrescriptions || 0; // Dari profile
        if (fetchedProfile.joinedSince) {
          // Simulasikan data 'joinedSince' jika belum ada di profile
          // Atau ambil dari data user jika ada field tanggal daftar
        }
      }

      // Tambahkan data dari Appointments jika user adalah pasien
      if (user.role === 'patient' && appointments.length > 0) {
        // Perhitungkan total janji temu dari data appointments (jika tidak ada di profile)
        if (!fetchedProfile?.totalVisits) {
          totalAppointments = appointments.filter(app => app.status !== "Dibatalkan").length;
        }
        // Perhitungkan janji temu mendatang
        upcomingAppointments = appointments.filter(app => app.status === "Menunggu Persetujuan").length;
      }

      // Proses Recent Activities (Simulasi dari dummy JSON)
      if (activities.length > 0) {
        const userActivities = activities.filter(act => act.userId === userId);
        userActivities.forEach((act, idx) => {
          let icon = null;
          let message = act.message;

          // Inject name into message if available
          if (message.includes("{patientName}")) {
             message = message.replace("{patientName}", fetchedProfile?.name || user?.name || "Pasien");
          }

          // Tentukan ikon berdasarkan jenis activity (simulasi)
          if (act.type === 'patient') {
            icon = <AccountCircleIcon sx={{ fontSize: 24, color: theme === 'dark' ? '#eee' : '#333' }} />;
          } else if (act.type === 'appointment') {
            icon = <CalendarMonthIcon sx={{ fontSize: 24, color: '#1FAA59' }} />;
          } else if (act.type === 'prescription') {
            icon = <PharmaIcon sx={{ fontSize: 24, color: '#1976d2' }} />;
          } else {
            icon = <ArticleIcon sx={{ fontSize: 24, color: theme === 'dark' ? '#ccc' : '#666' }} />;
          }

          recentActivitiesList.push({
            id: act.id,
            icon: icon,
            message: message,
            time: act.time,
            color: theme === 'dark' ? 'text-light' : 'text-muted' // Untuk styling p/small
          });
        });
      }


      setStats({
        totalAppointments: totalAppointments,
        activePrescriptions: activePrescriptions,
        upcomingAppointments: upcomingAppointments,
      });
      setRecentActivities(recentActivitiesList);

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      // Handle error display if needed
      setProfileData(null); // Reset data jika fetch gagal
      setStats({ totalAppointments: 0, activePrescriptions: 0, upcomingAppointments: 0 });
      setRecentActivities([]);
    } finally {
      setLoading(false);
    }
  };

  const getWelcomeMessage = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Selamat pagi";
    if (hour < 18) return "Selamat siang";
    return "Selamat malam";
  };

  const isProfileFieldsComplete = (profile) => {
    if (!profile) return false;
    // Periksa field penting dari JSON dummy
    const requiredFields = [
      "name", "email", "phone", "dob", "address", "gender", "occupation",
      "medicalHistory", "emergencyContact", "allergies", "joinedSince"
    ];
    return requiredFields.every(field => profile[field] && String(profile[field]).trim() !== "");
  };

  // Fungsi untuk merender bagian dashboard pasien
  const renderPatientDashboard = () => {
    const isProfileComplete = isProfileFieldsComplete(profileData);

    return (
      <>
        <h2 data-aos="fade-right" className={`mb-4 ${theme === "dark" ? "text-white" : "text-dark"}`}>
          {getWelcomeMessage()}, {profileData?.name || user?.name || "Pasien"}!
        </h2>
        <p data-aos="fade-right" className={`lead mb-2 ${theme === "dark" ? "text-light" : "text-muted"}`}>
          Berikut adalah ringkasan perjalanan kesehatan Anda
        </p>

        {/* Statistik Ringkasan */}
        <h3 className={`mb-3 ${theme === "dark" ? "text-white" : "text-dark"}`}>Ringkasan Kesehatan</h3>
        <Row className="g-4 mb-5">
          <Col md={6} lg={3}>
            <Card
              data-aos="flip-right"
              className={`h-100 shadow-sm ${theme === "dark" ? "bg-dark text-white border-secondary" : "bg-white text-dark border-light"}`}
            >
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <Card.Title className={`h6 ${theme === "dark" ? "text-light" : "text-muted"} mb-0`}>Total Janji Temu</Card.Title>
                  <CalendarMonthIcon className="text-primary" style={{ fontSize: 28 }} />
                </div>
                <h3 className="fw-bold">{stats.totalAppointments}</h3>
                <Card.Text className={theme === "dark" ? "text-light" : "text-muted"}>
                  <small>Sejak bergabung</small>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6} lg={3}>
            <Card
              data-aos="flip-left"
              className={`h-100 shadow-sm ${theme === "dark" ? "bg-dark text-white border-secondary" : "bg-white text-dark border-light"}`}
            >
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <Card.Title className={`h6 ${theme === "dark" ? "text-light" : "text-muted"} mb-0`}>Mendatang</Card.Title>
                  <i className="bi bi-clock text-warning" style={{ fontSize: 28 }}></i>
                </div>
                <h3 className="fw-bold">{stats.upcomingAppointments}</h3>
                <Card.Text className={theme === "dark" ? "text-light" : "text-muted"}>
                  <small>Janji temu</small>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6} lg={3}>
            <Card
              data-aos="flip-right"
              className={`h-100 shadow-sm ${theme === "dark" ? "bg-dark text-white border-secondary" : "bg-white text-dark border-light"}`}
            >
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <Card.Title className={`h6 ${theme === "dark" ? "text-light" : "text-muted"} mb-0`}>Resep Aktif</Card.Title>
                  <PharmaIcon className="text-info" style={{ fontSize: 28 }} />
                </div>
                <h3 className="fw-bold">{stats.activePrescriptions}</h3>
                <Card.Text className={theme === "dark" ? "text-light" : "text-muted"}>
                  <small>Saat ini</small>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6} lg={3}>
            <Card
              data-aos="flip-left"
              className={`h-100 shadow-sm ${theme === "dark" ? "bg-dark text-white border-secondary" : "bg-white text-dark border-light"}`}
            >
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <Card.Title className={`h6 ${theme === "dark" ? "text-light" : "text-muted"} mb-0`}>Bergabung</Card.Title>
                  <i className="bi bi-calendar-event text-danger" style={{ fontSize: 28 }}></i>
                </div>
                <h3 className="fw-bold">{profileData?.joinedSince || "N/A"}</h3>
                <Card.Text className={theme === "dark" ? "text-light" : "text-muted"}>
                  <small>Sejak</small>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Bagian Aksi Cepat */}
        <h3 className={`mb-3 ${theme === "dark" ? "text-white" : "text-dark"}`}>Aksi Cepat</h3>
        <Row className="g-4 mb-5">
          <Col md={6} lg={3}>
            <Card
              data-aos="fade-down"
              className={`h-100 shadow-sm text-center p-4 ${
                isProfileComplete ? "bg-success text-white" : theme === "dark" ? "bg-dark text-white border-secondary" : "bg-white text-dark border-light"
              }`}
            >
              {isProfileComplete ? (
                <AccountCircleIcon className={`display-4 mb-3 ${theme === "dark" ? "text-white" : "text-white"}`} />
              ) : (
                <i className="bi bi-person-exclamation display-4 text-warning mb-3"></i>
              )}
              <Card.Title className="h5 mb-2">
                {isProfileComplete ? "Profil Lengkap!" : "Lengkapi Profil"}
              </Card.Title>
              <Card.Text className={isProfileComplete ? "text-white-50" : theme === "dark" ? "text-light" : "text-muted"}>
                {isProfileComplete ? "Data Anda sudah terverifikasi." : "Selesaikan detail profil Anda."}
              </Card.Text>
              <Button
                as={RouterLink}
                to="/profil" // Ganti dengan path profil yang sebenarnya
                variant={isProfileComplete ? "outline-light" : "primary"}
                className="mt-3"
              >
                {isProfileComplete ? "Lihat Profil" : "Lengkapi Sekarang"}
              </Button>
            </Card>
          </Col>

          <Col md={6} lg={3}>
            <Card
              data-aos="fade-down"
              className={`h-100 shadow-sm text-center p-4 ${theme === "dark" ? "bg-dark text-white border-secondary" : "bg-white text-dark border-light"}`}
            >
              <CalendarMonthIcon className="display-4 text-primary mb-3" />
              <Card.Title className="h5 mb-2">Janji Temu</Card.Title>
              <Card.Text className={theme === "dark" ? "text-light" : "text-muted"}>
                Jadwalkan janji temu baru
              </Card.Text>
              <Button as={RouterLink} to="/pasien/janji-temu" variant="primary" className="mt-3">
                Buat Janji
              </Button>
            </Card>
          </Col>

          <Col md={6} lg={3}>
            <Card
              data-aos="fade-down"
              className={`h-100 shadow-sm text-center p-4 ${theme === "dark" ? "bg-dark text-white border-secondary" : "bg-white text-dark border-light"}`}
            >
              <PharmaIcon className="display-4 text-success mb-3" />
              <Card.Title className="h5 mb-2">Resep & Obat</Card.Title>
              <Card.Text className={theme === "dark" ? "text-light" : "text-muted"}>
                Periksa resep dan obat Anda
              </Card.Text>
              <Button as={RouterLink} to="/pasien/resep" variant="success" className="mt-3">
                Lihat Resep
              </Button>
            </Card>
          </Col>

          <Col md={6} lg={3}>
            <Card
              data-aos="fade-down"
              className={`h-100 shadow-sm text-center p-4 ${theme === "dark" ? "bg-dark text-white border-secondary" : "bg-white text-dark border-light"}`}
            >
              <HistoryIcon className="display-4 text-info mb-3" />
              <Card.Title className="h5 mb-2">Riwayat Medis</Card.Title>
              <Card.Text className={theme === "dark" ? "text-light" : "text-muted"}>
                Akses catatan kesehatan Anda
              </Card.Text>
              <Button as={RouterLink} to="/pasien/riwayat" variant="info" className="mt-3">
                Lihat Riwayat
              </Button>
            </Card>
          </Col>
        </Row>

        {/* Aktivitas Terbaru */}
        <h3 className={`mb-3 ${theme === "dark" ? "text-white" : "text-dark"}`}>Aktivitas Terbaru</h3>
        <Card
          data-aos="zoom-in"
          className={`shadow-sm ${theme === "dark" ? "bg-dark border-secondary" : "bg-white border-light"} mb-5`}
        >
          <Card.Body>
            <Card.Title className="h5 mb-4">Aktivitas Terbaru</Card.Title>
            <Card.Text className={theme === "dark" ? "text-light" : "text-muted"}>
              Interaksi kesehatan terbaru Anda
            </Card.Text>
            <ul className="list-unstyled">
              {recentActivities.length > 0 ? (
                recentActivities.map((activity) => (
                  <li key={activity.id} className="d-flex align-items-center mb-3">
                    <div className={`me-3 ${activity.color || ''}`}> {/* Gunakan warna jika ada */}
                      {activity.icon} {/* Tampilkan icon */}
                    </div>
                    <div>
                      <p className={`mb-0 ${theme === "dark" ? "text-white" : "text-dark"}`}>{activity.message}</p>
                      <small className={theme === "dark" ? "text-light" : "text-muted"}>{activity.time}</small>
                    </div>
                  </li>
                ))
              ) : (
                <p className={theme === "dark" ? "text-light" : "text-muted"}>
                  Tidak ada aktivitas terbaru.
                </p>
              )}
            </ul>
          </Card.Body>
        </Card>
      </>
    );
  };

  // Fungsi untuk merender dashboard dokter (bisa ditambahkan jika diperlukan)
  const renderDoctorDashboard = () => (
    <Row className="g-4">
      <Col md={6} lg={4}>
        <Card className="h-100 shadow-sm text-center p-4">
          <CalendarMonthIcon className="display-4 text-primary mb-3" />
          <Card.Title className="h5 mb-2">Jadwal Saya</Card.Title>
          <Card.Text>Lihat janji temu Anda hari ini</Card.Text>
          <Button as={RouterLink} to="/dokter/jadwal" variant="primary" className="mt-3">
            Lihat Jadwal
          </Button>
        </Card>
      </Col>
      <Col md={6} lg={4}>
        <Card className="h-100 shadow-sm text-center p-4">
          <AccountCircleIcon className="display-4 text-secondary mb-3" />
          <Card.Title className="h5 mb-2">Daftar Pasien</Card.Title>
          <Card.Text>Kelola pasien Anda</Card.Text>
          <Button as={RouterLink} to="/dokter/pasien" variant="secondary" className="mt-3">
            Lihat Pasien
          </Button>
        </Card>
      </Col>
      <Col md={6} lg={4}>
        <Card className="h-100 shadow-sm text-center p-4">
          <PharmaIcon className="display-4 text-success mb-3" />
          <Card.Title className="h5 mb-2">Kelola Resep</Card.Title>
          <Card.Text>Buat dan kelola resep</Card.Text>
          <Button as={RouterLink} to="/dokter/resep" variant="success" className="mt-3">
            Kelola Resep
          </Button>
        </Card>
      </Col>
    </Row>
  );

  // Render loading state
  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant={theme === "dark" ? "light" : "primary"} role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className={theme === "dark" ? "text-light" : "text-muted"}>Memuat data dashboard...</p>
      </Container>
    );
  }

  // Render jika tidak ada user yang login
  if (!user) {
    return (
      <Container className="py-5 text-center">
        <Alert variant="warning">Silakan login untuk mengakses dashboard Anda.</Alert>
      </Container>
    );
  }

  // Render dashboard berdasarkan role user
  return (
    <Container className="py-5">
      {user.role === "patient" && renderPatientDashboard()}
      {user.role === "doctor" && renderDoctorDashboard()}
      {user.role === "admin" && (
        <Container className="py-5 text-center">
          <h2 className={`mb-4 ${theme === "dark" ? "text-white" : "text-dark"}`}>Selamat datang, Admin!</h2>
          <p className={`lead ${theme === "dark" ? "text-light" : "text-muted"}`}>Halaman dashboard admin akan segera hadir.</p>
        </Container>
      )}
    </Container>
  );
};

export default Dashboard;