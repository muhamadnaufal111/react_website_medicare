// src/pages/doctor/DoctorDashboard.jsx
"use client";

import { Container, Row, Col, Card, Button, Spinner, Alert } from "react-bootstrap";
import { useAuth } from "../../contexts/AuthContexts";
import { useTheme } from "../../contexts/ThemeContexts";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

// Import Chart.js components
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const DoctorDashboard = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [stats, setStats] = useState({
    todayAppointments: 0,
    totalPatients: 0,
    activePrescriptions: 0,
    pendingAppointments: 0,
    completedAppointmentsThisMonth: 0,
    newPatientsThisMonth: 0,
  });

  const [loading, setLoading] = useState(true);
  const [recentActivities, setRecentActivities] = useState([]);
  const [chartData, setChartData] = useState({
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul'],
    datasets: [{
      label: 'Jumlah Janji Temu',
      data: [65, 59, 80, 81, 56, 75, 60],
      tension: 0.4
    }]
  });

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock data for demo (more complete)
      setStats({
        todayAppointments: 12,
        totalPatients: 850,
        activePrescriptions: 215,
        pendingAppointments: 7,
        completedAppointmentsThisMonth: 85,
        newPatientsThisMonth: 12,
      });

      // --- PENTING: Penjelasan untuk Aktivitas Terbaru ---
      // Data 'recentActivities' ini seharusnya diambil dari API backend Anda.
      // Backend akan melacak berbagai event seperti:
      // - Pasien baru membuat janji temu (dari sisi pasien)
      // - Dokter mengeluarkan resep baru (dari sisi dokter)
      // - Catatan medis pasien diperbarui (dari sisi dokter)
      // - Janji temu disetujui/ditolak (dari sisi dokter/admin)
      //
      // Data ini biasanya disimpan dalam database di tabel 'activities' atau 'notifications'
      // yang memiliki kolom seperti 'timestamp', 'user_id' (dokter yang terkait), 'type' (jenis aktivitas), 'message', dll.
      // Saat fetchDashboardData dipanggil, Anda akan mengirim permintaan GET ke endpoint API Anda,
      // misalnya `/api/doctor/activities` atau `/api/activities?role=doctor&limit=5`.
      //
      // Contoh pengambilan data dari backend (pseudo-code):
      // const response = await fetch('/api/doctor/recent-activities', {
      //   headers: {
      //     'Authorization': `Bearer ${user.token}` // Kirim token otentikasi
      //   }
      // });
      // const data = await response.json();
      // setRecentActivities(data.activities);

      setRecentActivities([
        {
          id: 1,
          type: "appointment_new",
          icon: "bi bi-calendar-plus-fill",
          message: "Janji temu baru dari Sarah Wilson pada 26 Jul, 10:00 WIB.",
          time: "5 menit lalu",
        },
        {
          id: 2,
          type: "prescription_issued",
          icon: "bi bi-prescription",
          message: "Resep baru dikeluarkan untuk John Smith",
          time: "15 menit lalu",
        },
        {
          id: 3,
          type: "patient_updated",
          icon: "bi bi-file-earmark-person-fill",
          message: "Catatan medis Jane Doe diperbarui (Riwayat penyakit).",
          time: "30 menit lalu",
        },
        {
          id: 4,
          type: "appointment_approved",
          icon: "bi bi-check-circle-fill",
          message: "Janji temu Michael Brown disetujui (27 Jul, 09:00 WIB).",
          time: "1 jam lalu",
        },
      ]);

      setChartData(prev => ({
        ...prev,
        datasets: [{
          ...prev.datasets[0],
          data: [70, 65, 85, 78, 62, 80, 70],
          backgroundColor: theme === 'dark' ? 'rgba(129, 230, 217, 0.2)' : 'rgba(0, 123, 255, 0.2)',
          borderColor: theme === 'dark' ? '#81E6D9' : '#007bff',
          pointBackgroundColor: theme === 'dark' ? '#81E6D9' : '#007bff',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: theme === 'dark' ? '#81E6D9' : '#007bff',
          fill: true,
        }]
      }));

      setLoading(false);
    } catch (error) {
      console.error("Gagal memuat data dashboard dokter:", error);
      setLoading(false);
    }
  };

  const getWelcomeMessage = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Selamat pagi";
    if (hour < 18) return "Selamat siang";
    return "Selamat malam";
  };

  const mainBgClass = theme === 'dark' ? 'bg-dark' : 'bg-light';
  const mainTextColorClass = theme === 'dark' ? 'text-white' : 'text-dark';
  const cardBgClass = theme === 'dark' ? 'bg-secondary text-white border-secondary' : 'bg-white text-dark border-light';
  const cardTitleColorClass = theme === 'dark' ? 'text-info' : 'text-primary';
  const welcomeCardBg = theme === 'dark' ? 'bg-primary-dark-gradient' : 'bg-primary';
  const buttonVariantPrimary = theme === 'dark' ? 'outline-info' : 'primary';
  const buttonVariantWarning = theme === 'dark' ? 'outline-warning' : 'warning';
  const buttonVariantSuccess = theme === 'dark' ? 'outline-success' : 'success';

  const getActivityIcon = (type) => {
    switch (type) {
      case 'appointment_new': return 'bi bi-calendar-plus-fill text-success';
      case 'prescription_issued': return 'bi bi-prescription text-info';
      case 'patient_updated': return 'bi bi-file-earmark-person-fill text-warning';
      case 'appointment_approved': return 'bi bi-check-circle-fill text-primary';
      default: return 'bi bi-info-circle text-muted';
    }
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: theme === 'dark' ? '#adb5bd' : '#495057',
        },
      },
      title: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('en-US').format(context.parsed.y);
            }
            return label;
          }
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: theme === 'dark' ? '#ced4da' : '#6c757d',
        },
        grid: {
          color: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
      },
      y: {
        ticks: {
          color: theme === 'dark' ? '#ced4da' : '#6c757d',
          beginAtZero: true,
        },
        grid: {
          color: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
      },
    },
  };


  if (loading) {
    return (
      <Container fluid className={`d-flex justify-content-center align-items-center ${mainBgClass} ${mainTextColorClass}`} style={{ minHeight: 'calc(100vh - 56px)' }}>
        <Spinner animation="border" role="status" variant={theme === 'dark' ? 'light' : 'primary'}>
          <span className="visually-hidden">Memuat Dashboard...</span>
        </Spinner>
      </Container>
    );
  }

  if (!user || user.role !== 'doctor') {
    return (
      <Container fluid className={`py-5 ${mainBgClass} ${mainTextColorClass}`} style={{ minHeight: 'calc(100vh - 56px)' }}>
        <Alert variant="danger" className="mx-auto" style={{ maxWidth: '600px' }}>
          Akses Ditolak. Anda harus login sebagai dokter untuk melihat dashboard ini.
        </Alert>
      </Container>
    );
  }

  return (
    <Container fluid className={`py-4 px-lg-5 ${mainBgClass} ${mainTextColorClass}`} style={{ minHeight: 'calc(100vh - 56px)' }}>
      {/* Welcome Section */}
      <Row className="mb-4">
        <Col>
          <Card className={`shadow-lg ${welcomeCardBg} text-white`}>
            <Card.Body>
              <Row className="align-items-center">
                <Col>
                  <h1 className="mb-2">Selamat Datang Dokter <i className="bi bi-person-bounding-box"></i></h1>
                  <p className="lead mb-0">
                    {getWelcomeMessage()}, {user?.name || user?.email}!
                  </p>
                  <p className="mb-0 opacity-75">Kelola praktik Anda dan pantau aktivitas penting.</p>
                </Col>
                <Col xs="auto" className="d-none d-md-block">
                  <i className="bi bi-heart-pulse-fill display-1 text-white opacity-50"></i>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Summary Statistics */}
      <h2 className={`mb-3 ${mainTextColorClass}`}>Statistik Ringkasan <i className="bi bi-bar-chart-line-fill"></i></h2>
      <Row className="g-4 mb-5">
        <Col xs={12} sm={6} lg={3}>
          <Card className={`h-100 shadow-sm ${cardBgClass}`}>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <Card.Title className={`h6 mb-0 ${cardTitleColorClass}`}>Janji Temu Hari Ini</Card.Title>
                <i className={`bi bi-calendar-check-fill display-6 ${theme === 'dark' ? 'text-info' : 'text-primary'}`}></i>
              </div>
              <h3 className="fw-bold display-5">{stats.todayAppointments}</h3>
              <Card.Text className={`${theme === 'dark' ? 'text-light' : 'text-muted'}`}>
                <small>Janji temu yang dijadwalkan hari ini.</small>
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} sm={6} lg={3}>
          <Card className={`h-100 shadow-sm ${cardBgClass}`}>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <Card.Title className={`h6 mb-0 ${cardTitleColorClass}`}>Total Pasien</Card.Title>
                <i className={`bi bi-person-fill-gear display-6 ${theme === 'dark' ? 'text-info' : 'text-primary'}`}></i>
              </div>
              <h3 className="fw-bold display-5">{stats.totalPatients}</h3>
              <Card.Text className={`${theme === 'dark' ? 'text-light' : 'text-muted'}`}>
                <small>Total pasien yang pernah ditangani.</small>
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} sm={6} lg={3}>
          <Card className={`h-100 shadow-sm ${cardBgClass}`}>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <Card.Title className={`h6 mb-0 ${cardTitleColorClass}`}>Resep Aktif</Card.Title>
                <i className={`bi bi-prescription2 display-6 ${theme === 'dark' ? 'text-info' : 'text-primary'}`}></i>
              </div>
              <h3 className="fw-bold display-5">{stats.activePrescriptions}</h3>
              <Card.Text className={`${theme === 'dark' ? 'text-light' : 'text-muted'}`}>
                <small>Resep yang baru-baru ini dikeluarkan.</small>
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} sm={6} lg={3}>
          <Card className={`h-100 shadow-sm ${cardBgClass}`}>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <Card.Title className={`h6 mb-0 ${cardTitleColorClass}`}>Janji Temu Tertunda</Card.Title>
                <i className={`bi bi-hourglass-split display-6 ${theme === 'dark' ? 'text-info' : 'text-primary'}`}></i>
              </div>
              <h3 className="fw-bold display-5">{stats.pendingAppointments}</h3>
              <Card.Text className={`${theme === 'dark' ? 'text-light' : 'text-muted'}`}>
                <small>Janji temu menunggu persetujuan Anda.</small>
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Quick Actions & Recent Activities */}
      <Row className="g-4 mb-5">
        {/* Quick Actions */}
        <Col lg={6}>
          <Card className={`h-100 shadow-lg ${cardBgClass}`}>
            <Card.Header className={`${cardTitleColorClass} h5`}>
              Aksi Cepat <i className="bi bi-lightning-fill"></i>
            </Card.Header>
            <Card.Body>
              <Row className="g-3">
                <Col md={6}>
                  <Card className={`h-100 ${theme === 'dark' ? 'bg-dark text-white border-info' : 'bg-light text-dark border-primary'} text-center p-3`}>
                    <Card.Body className="d-flex flex-column justify-content-between">
                      <h6 className="mb-2"><i className="bi bi-calendar-week-fill me-2"></i>Jadwal Saya</h6>
                      <p className="text-muted mb-3"><small>Lihat & kelola janji temu.</small></p>
                      <Button as={Link} to="/dokter/jadwal" variant={buttonVariantPrimary} className="mt-auto">
                        Lihat Jadwal
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={6}>
                  <Card className={`h-100 ${theme === 'dark' ? 'bg-dark text-white border-warning' : 'bg-light text-dark border-warning'} text-center p-3`}>
                    <Card.Body className="d-flex flex-column justify-content-between">
                      <h6 className="mb-2"><i className="bi bi-prescription me-2"></i>Kelola Resep</h6>
                      <p className="text-muted mb-3"><small>Buat & kelola resep pasien.</small></p>
                      <Button as={Link} to="/dokter/resep" variant={buttonVariantWarning} className="mt-auto">
                        Kelola Resep
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={6}>
                  <Card className={`h-100 ${theme === 'dark' ? 'bg-dark text-white border-success' : 'bg-light text-dark border-success'} text-center p-3`}>
                    <Card.Body className="d-flex flex-column justify-content-between">
                      <h6 className="mb-2"><i className="bi bi-people-fill me-2"></i>Data Pasien</h6>
                      <p className="text-muted mb-3"><small>Akses & perbarui catatan pasien.</small></p>
                      <Button as={Link} to="/dokter/pasien" variant={buttonVariantSuccess} className="mt-auto">
                        Lihat Pasien
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
                {/* Removed "Rekam Medis Pasien" card to keep only 3 quick actions */}
              </Row>
            </Card.Body>
          </Card>
        </Col>

        {/* Recent Activities */}
        <Col lg={6}>
          <Card className={`h-100 shadow-lg ${cardBgClass}`}>
            <Card.Header className={`${cardTitleColorClass} h5`}>
              Aktivitas Terbaru <i className="bi bi-activity"></i>
            </Card.Header>
            <Card.Body>
              {recentActivities.length > 0 ? (
                <ul className="list-unstyled mb-0">
                  {recentActivities.map((activity) => (
                    <li key={activity.id} className="d-flex align-items-start mb-3 pb-3 border-bottom">
                      <div className={`me-3 fs-4`}>
                        <i className={getActivityIcon(activity.type)}></i>
                      </div>
                      <div>
                        <p className="mb-1" dangerouslySetInnerHTML={{ __html: activity.message }}></p>
                        <small className={`${theme === 'dark' ? 'text-info' : 'text-muted'}`}>
                          <i className="bi bi-clock me-1"></i> {activity.time}
                        </small>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <Alert variant={theme === 'dark' ? 'secondary' : 'info'} className="text-center">
                  Tidak ada aktivitas terbaru.
                </Alert>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Performance Chart */}
      <h2 className={`mb-3 ${mainTextColorClass}`}>Analisis Kinerja Bulanan <i className="bi bi-graph-up"></i></h2>
      <Card className={`shadow-lg mb-5 ${cardBgClass}`}>
        <Card.Header className={`${cardTitleColorClass} h5`}>
          Janji Temu per Bulan <i className="bi bi-bar-chart-fill"></i>
        </Card.Header>
        <Card.Body>
          <div style={{ height: '300px', width: '100%' }}>
            <Line data={chartData} options={chartOptions} />
          </div>
          <Card.Text className={`${theme === 'dark' ? 'text-light' : 'text-muted'} mt-3`}>
            <small>Data ini menunjukkan tren jumlah janji temu yang diselesaikan setiap bulan. Data ini hanyalah simulasi.</small>
          </Card.Text>
        </Card.Body>
      </Card>

      {/* Additional Stats / Quick Links */}
      <h2 className={`mb-3 ${mainTextColorClass}`}>Statistik Tambahan <i className="bi bi-info-circle-fill"></i></h2>
      <Row className="g-4 mb-5">
        <Col md={6} lg={4}>
          <Card className={`h-100 shadow-sm ${cardBgClass}`}>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <Card.Title className={`h6 mb-0 ${cardTitleColorClass}`}>Janji Temu Selesai (Bulan Ini)</Card.Title>
                <i className={`bi bi-calendar-check-fill display-6 ${theme === 'dark' ? 'text-info' : 'text-primary'}`}></i>
              </div>
              <h3 className="fw-bold display-5">{stats.completedAppointmentsThisMonth}</h3>
              <Card.Text className={`${theme === 'dark' ? 'text-light' : 'text-muted'}`}>
                <small>Janji temu yang telah diselesaikan bulan ini.</small>
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} lg={4}>
          <Card className={`h-100 shadow-sm ${cardBgClass}`}>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <Card.Title className={`h6 mb-0 ${cardTitleColorClass}`}>Pasien Baru (Bulan Ini)</Card.Title>
                <i className={`bi bi-person-add display-6 ${theme === 'dark' ? 'text-info' : 'text-primary'}`}></i>
              </div>
              <h3 className="fw-bold display-5">{stats.newPatientsThisMonth}</h3>
              <Card.Text className={`${theme === 'dark' ? 'text-light' : 'text-muted'}`}>
                <small>Pasien baru yang terdaftar bulan ini.</small>
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={12} lg={4}>
          <Card className={`h-100 shadow-sm ${cardBgClass}`}>
            <Card.Body className="d-flex flex-column justify-content-center align-items-center text-center">
              <i className={`bi bi-box-arrow-right display-4 mb-3 ${theme === 'dark' ? 'text-danger' : 'text-danger'}`}></i>
              <h5 className={`mb-2 ${cardTitleColorClass}`}>Keluar / Logout</h5>
              <p className={`${theme === 'dark' ? 'text-light' : 'text-muted'} mb-3`}>
                <small></small>
              </p>
              <Button onClick={() => console.log('Logout action here')} variant={theme === 'dark' ? 'outline-danger' : 'danger'}>
                <i className="bi bi-box-arrow-right me-2"></i> Logout
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

    </Container>
  );
};

export default DoctorDashboard;

<style jsx>{`
  .bg-primary-dark-gradient {
    background: linear-gradient(135deg, #007bff, #0056b3); /* Blue gradient for dark mode */
  }
  .bg-primary {
    background-color: var(--bs-primary) !important;
  }
  /* Optional: Adjust card colors for better distinction in light mode */
  .bg-light .card.bg-light.text-dark.border-primary {
    border-color: var(--bs-primary) !important;
  }
  .bg-light .card.bg-light.text-dark.border-warning {
    border-color: var(--bs-warning) !important;
  }
  .bg-light .card.bg-light.text-dark.border-success {
    border-color: var(--bs-success) !important;
  }
  .bg-light .card.bg-light.text-dark.border-danger {
    border-color: var(--bs-danger) !important;
  }
`}</style>  