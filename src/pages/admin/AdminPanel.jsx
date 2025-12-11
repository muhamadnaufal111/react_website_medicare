// src/pages/admin/AdminPanel.jsx
"use client";

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContexts';
import AOS from "aos";
import "aos/dist/aos.css";

// Import Chart.js components
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement, // Untuk Doughnut Chart
  // Hapus import Filler di sini, karena seringkali tidak diperlukan secara eksplisit
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';

// Register Chart.js elements
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  // Hapus Filler dari pendaftaran di sini
);

const AdminPanel = () => {
  const { theme } = useTheme();
  const [stats, setStats] = useState({
    totalPatients: 1247,
    monthlyRevenue: 15000000,
    todayAppointments: 28,
    pendingAppointments: 15,
    patientSatisfaction: 4.6,
    activeDoctors: 45,
    activePrescriptions: 342,
    avgWaitTime: 25,
    lowStockItems: 12,
    emergencyVisits: 89,
    cancelledRate: 7.2,
    cancelledCount: 280,
    newPatientsToday: 12,
    completedAppointmentsToday: 24,
    prescriptionsIssuedToday: 18,
    todayRevenue: 2500000,
  });

  useEffect(() => {
    AOS.init(
      {
        duration: 1000,
        once: true,
      }
    );
  }, []);

  const [recentActivities, setRecentActivities] = useState([
    {
      id: 1,
      message: "New appointment scheduled - Sarah Wilson with Dr. Johnson",
      time: "2 minutes ago",
      icon: "bi-calendar-check",
      color: "text-primary"
    },
    {
      id: 2,
      message: "New patient registered - John Smith",
      time: "5 minutes ago",
      icon: "bi-person-plus",
      color: "text-success"
    },
    {
      id: 3,
      message: "New prescription issued by Dr. Chen",
      time: "10 minutes ago",
      icon: "bi-file-medical",
      color: "text-info"
    },
    {
      id: 4,
      message: "Medicine stock updated - Amoxicillin",
      time: "15 minutes ago",
      icon: "bi-capsule",
      color: "text-warning"
    },
  ]);

  const [systemAlerts, setSystemAlerts] = useState([
    {
      id: 1,
      message: "12 medicines are running on low stock",
      link: "/admin/medicines",
      type: "warning"
    }
  ]);

  // Dummy function for refreshing data
  const refreshData = () => {
    console.log("Refreshing data...");
    // In a real app, you would fetch new data here
  };

  // Dummy function for generating report
  const generateReport = () => {
    console.log("Generating report...");
    // In a real app, you would trigger report generation here
  };

  // --- Chart Data and Options ---

  // Mengatur warna teks grafik berdasarkan tema
  const getChartTextColor = () => theme === 'dark' ? '#E2E8F0' : '#475569'; // light gray for dark, slate gray for light
  const getGridColor = () => theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'; // faint grid lines

  // Data for Appointment Trends Line Chart
  const appointmentData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Janji Temu',
        data: [65, 59, 80, 81, 56, 55, 70],
        fill: true,
        backgroundColor: theme === 'dark' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.4)', // blue-500 with opacity
        borderColor: '#3B82F6', // blue-500
        tension: 0.4,
        pointBackgroundColor: '#3B82F6',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#3B82F6',
      },
    ],
  };

  const appointmentOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: getChartTextColor(), // Warna label legend
        },
      },
      title: {
        display: false,
        text: 'Tren Janji Temu Bulanan',
        color: getChartTextColor(),
      },
    },
    scales: {
      x: {
        ticks: {
          color: getChartTextColor(), // Warna label sumbu X
        },
        grid: {
          color: getGridColor(), // Warna grid sumbu X
        },
      },
      y: {
        ticks: {
          color: getChartTextColor(), // Warna label sumbu Y
        },
        grid: {
          color: getGridColor(), // Warna grid sumbu Y
        },
      },
    },
  };

  // Data for Patient Demographics Doughnut Chart
  const demographicsData = {
    labels: ['0-18 Tahun', '19-45 Tahun', '46-65 Tahun', '>65 Tahun'],
    datasets: [
      {
        data: [15, 45, 30, 10], // Persentase dummy
        backgroundColor: [
          '#EF4444', // Red-500
          '#22C55E', // Green-500
          '#3B82F6', // Blue-500
          '#F59E0B', // Amber-500
        ],
        borderColor: theme === 'dark' ? '#1E293B' : '#FFFFFF', // slate-800 for dark, white for light
        borderWidth: 2,
      },
    ],
  };

  const demographicsOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: getChartTextColor(), // Warna label legend
        },
      },
      title: {
        display: false,
        text: 'Demografi Pasien',
        color: getChartTextColor(),
      },
    },
  };

  return (
    // Tambahkan padding-top ke Container utama AdminPanel untuk mengakomodasi fixed navbar
    <Container fluid className={`py-4 ${theme === 'dark' ? 'text-white' : 'text-dark'}`} style={{ paddingTop: '80px' }}> {/* Sesuaikan nilai padding-top */}
      <Row className="mb-4 align-items-center">
        <Col>
          <h1 className={`mb-0 ${theme === 'dark' ? 'text-white' : 'text-dark'}`}>Admin Dashboard</h1>
          <p className={`lead mb-0 ${theme === 'dark' ? 'text-light' : 'text-muted'}`}>
          Ringkasan Sistem Manajemen Rumah Sakit -{" "}
            {new Date().toLocaleDateString("id-ID", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </Col>
        <Col xs="auto">
          <Button variant={theme === 'dark' ? 'outline-light' : 'outline-secondary'} onClick={refreshData} className="me-2">
            <i className="bi bi-arrow-clockwise me-1"></i>
            Refresh Data
          </Button>
          <Button variant="primary" onClick={generateReport}>
            <i className="bi bi-file-earmark-text me-1"></i>
            Generate Report
          </Button>
        </Col>
      </Row>

      {/* Key Performance Indicators */}
      <Row className="g-4 mb-4">
        <Col md={6} lg={3} data-aos="fade-down">
          {/* Total Pasien Card - Blue */}
          <Card className="bg-primary text-white h-100 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="card-title opacity-75">Total Pasien</h6>
                  <h2 className="mb-0">{stats.totalPatients.toLocaleString()}</h2>
                  <small className="opacity-75">
                    <i className="bi bi-arrow-up me-1"></i>
                    +12% dari bulan lalu
                  </small>
                </div>
                <i className="bi bi-people display-6 opacity-75"></i>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={3} data-aos="fade-down">
          {/* Pendapatan Bulanan Card - Green */}
          <Card className="bg-success text-white h-100 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="card-title opacity-75">Pendapatan Bulanan</h6>
                  <h2 className="mb-0">
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      minimumFractionDigits: 0,
                    }).format(stats.monthlyRevenue)}
                  </h2>
                  <small className="opacity-75">
                    <i className="bi bi-arrow-down me-1"></i>
                    -8% from last month
                  </small>
                </div>
                <i className="bi bi-currency-dollar display-6 opacity-75"></i>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={3} data-aos="fade-down">
          {/* Janji Temu Hari Ini Card - Purple */}
          <Card className="text-white h-100 shadow-sm" style={{ backgroundColor: '#8B5CF6' }}> {/* Custom purple color */}
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="card-title opacity-75">Janji Temu Hari Ini</h6>
                  <h2 className="mb-0">{stats.todayAppointments}</h2>
                  <small className="opacity-75">
                    <i className="bi bi-clock me-1"></i>
                    {stats.pendingAppointments} pending
                  </small>
                </div>
                <i className="bi bi-calendar-check display-6 opacity-75"></i>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={3} data-aos="fade-down">
          {/* Kepuasan Pasien Card - Yellow/Orange */}
          <Card className="bg-warning text-white h-100 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="card-title opacity-75">Kepuasan Pasien</h6>
                  <h2 className="mb-0">{stats.patientSatisfaction}/5.0</h2>
                  <small className="opacity-75">
                    <i className="bi bi-arrow-down me-1"></i>
                    -0.2 dari bulan lalu
                  </small>
                </div>
                <i className="bi bi-star display-6 opacity-75"></i>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Secondary Stats */}
      <Row className="g-4 mb-4">
        <Col md={6} lg={2}>
          <Card className={`h-100 shadow-sm ${theme === 'dark' ? 'bg-dark text-white border-secondary' : 'bg-white text-dark border-light'}`}>
            <Card.Body className="text-center">
              <i className="bi bi-person-badge display-6 text-primary mb-2"></i>
              <h4 className="mb-0">{stats.activeDoctors}</h4> {/* Perbaiki nama properti */}
              <small className={theme === 'dark' ? 'text-light' : 'text-muted'}>Dokter Aktif</small>
              <div className="mt-1">
                <small className={theme === 'dark' ? 'text-light' : 'text-muted'}>{stats.doctorUtilization || 'N/A'}% utilitas</small> {/* Tambahkan fallback */}
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={2}>
          <Card className={`h-100 shadow-sm ${theme === 'dark' ? 'bg-dark text-white border-secondary' : 'bg-white text-dark border-light'}`}>
            <Card.Body className="text-center">
              <i className="bi bi-file-medical display-6 text-success mb-2"></i>
              <h4 className="mb-0">{stats.activePrescriptions}</h4>
              <small className={theme === 'dark' ? 'text-light' : 'text-muted'}>Active Prescriptions</small>
              <div className="mt-1">
                <small className={theme === 'dark' ? 'text-light' : 'text-muted'}>{stats.totalPrescriptions || 'N/A'} total</small> {/* Tambahkan fallback */}
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={2}>
          <Card className={`h-100 shadow-sm ${theme === 'dark' ? 'bg-dark text-white border-secondary' : 'bg-white text-dark border-light'}`}>
            <Card.Body className="text-center">
              <i className="bi bi-clock display-6 text-info mb-2"></i>
              <h4 className="mb-0">{stats.avgWaitTime}m</h4> {/* Perbaiki nama properti */}
              <small className={theme === 'dark' ? 'text-light' : 'text-muted'}>Waktu Tunggu Rata-rata</small>
              <div className="mt-1">
                <small className="text-success">-5m dari minggu lalu</small>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={2}>
          <Card className={`h-100 shadow-sm ${theme === 'dark' ? 'bg-dark text-white border-secondary' : 'bg-white text-dark border-light'}`}>
            <Card.Body className="text-center">
              <i className="bi bi-exclamation-triangle display-6 text-danger mb-2"></i>
              <h4 className="mb-0 text-danger">{stats.lowStockItems}</h4> {/* Perbaiki nama properti */}
              <small className={theme === 'dark' ? 'text-light' : 'text-muted'}>Item Stok Rendah</small>
              <div className="mt-1">
                <small className="text-warning">Perlu perhatian</small>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={2}>
          <Card className={`h-100 shadow-sm ${theme === 'dark' ? 'bg-dark text-white border-secondary' : 'bg-white text-dark border-light'}`}>
            <Card.Body className="text-center">
              <i className="bi bi-activity display-6 text-warning mb-2"></i>
              <h4 className="mb-0">{stats.emergencyVisits}</h4>
              <small className={theme === 'dark' ? 'text-light' : 'text-muted'}>Kunjungan Darurat</small>
              <div className="mt-1">
                <small className={theme === 'dark' ? 'text-light' : 'text-muted'}>Bulan ini</small>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={2}>
          <Card className={`h-100 shadow-sm ${theme === 'dark' ? 'bg-dark text-white border-secondary' : 'bg-white text-dark border-light'}`}>
            <Card.Body className="text-center">
              <i className="bi bi-arrow-down display-6 text-secondary mb-2"></i>
              <h4 className="mb-0">{stats.cancelledRate}%</h4>
              <small className={theme === 'dark' ? 'text-light' : 'text-muted'}>Tingkat Pembatalan</small>
              <div className="mt-1">
                <small className={theme === 'dark' ? 'text-light' : 'text-muted'}>{stats.cancelledCount} Dibatalkan</small>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Charts Section */}
      <Row className="g-4 mb-4">
        <Col lg={6}>
          <Card className={`h-100 shadow-sm ${theme === 'dark' ? 'bg-dark text-white border-secondary' : 'bg-white text-dark border-light'}`}>
            <Card.Header className={theme === 'dark' ? 'bg-dark text-white border-secondary' : 'bg-white text-dark border-light'}>
              <h5 className={`mb-0 ${theme === 'dark' ? 'text-white' : 'text-dark'}`}>Tren Janji Temu</h5>
              <small className={theme === 'dark' ? 'text-light' : 'text-muted'}>Statistik janji temu bulanan</small>
            </Card.Header>
            <Card.Body>
              <div style={{ height: "250px" }}>
                <Line data={appointmentData} options={appointmentOptions} />
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={6}>
          <Card className={`h-100 shadow-sm ${theme === 'dark' ? 'bg-dark text-white border-secondary' : 'bg-white text-dark border-light'}`}>
            <Card.Header className={theme === 'dark' ? 'bg-dark text-white border-secondary' : 'bg-white text-dark border-light'}>
              <h5 className={`mb-0 ${theme === 'dark' ? 'text-white' : 'text-dark'}`}>Demografi Pasien</h5>
              <small className={theme === 'dark' ? 'text-light' : 'text-muted'}>Distribusi usia pasien</small>
            </Card.Header>
            <Card.Body>
              <div style={{ height: "250px" }}>
                <Doughnut data={demographicsData} options={demographicsOptions} />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Recent Activity, System Status, Today's Summary */}
      <Row className="g-4 mb-4">
        <Col lg={4}>
          <Card className={`h-100 shadow-sm ${theme === 'dark' ? 'bg-dark text-white border-secondary' : 'bg-white text-dark border-light'}`}>
            <Card.Header className={theme === 'dark' ? 'bg-dark text-white border-secondary' : 'bg-white text-dark border-light'}>
              <h5 className={`mb-0 ${theme === 'dark' ? 'text-white' : 'text-dark'}`}>Aktivitas Terbaru</h5>
              <small className={theme === 'dark' ? 'text-light' : 'text-muted'}>Aktivitas dan pembaruan sistem terbaru</small>
            </Card.Header>
            <Card.Body>
              <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                {recentActivities.map(activity => (
                  <div key={activity.id} className={`d-flex align-items-start mb-3 p-2 rounded ${theme === 'dark' ? 'hover-bg-secondary' : 'hover-bg-light'}`}>
                    <i className={`bi ${activity.icon} me-3 fs-5 ${activity.color}`}></i>
                    <div>
                      <p className={`mb-0 small ${theme === 'dark' ? 'text-white' : 'text-dark'}`}>{activity.message}</p>
                      <small className={theme === 'dark' ? 'text-light' : 'text-muted'}>{activity.time}</small>
                    </div>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className={`h-100 shadow-sm ${theme === 'dark' ? 'bg-dark text-white border-secondary' : 'bg-white text-dark border-light'}`}>
            <Card.Header className={theme === 'dark' ? 'bg-dark text-white border-secondary' : 'bg-white text-dark border-light'}>
              <h5 className={`mb-0 ${theme === 'dark' ? 'text-white' : 'text-dark'}`}>Status Sistem</h5>
              <small className={theme === 'dark' ? 'text-light' : 'text-muted'}>Kesehatan sistem saat ini</small>
            </Card.Header>
            <Card.Body>
              <div className={`d-flex justify-content-between align-items-center p-3 rounded mb-3 ${theme === 'dark' ? 'bg-success bg-opacity-25' : 'bg-success bg-opacity-10'}`}>
                <div className="d-flex align-items-center">
                  <div className="bg-success rounded-circle me-2" style={{ width: "8px", height: "8px" }}></div>
                  <span className={`small ${theme === 'dark' ? 'text-white' : 'text-dark'}`}>Server Status</span>
                </div>
                <span className="small text-success fw-bold">Online</span>
              </div>

              <div className={`d-flex justify-content-between align-items-center p-3 rounded mb-3 ${theme === 'dark' ? 'bg-success bg-opacity-25' : 'bg-success bg-opacity-10'}`}>
                <div className="d-flex align-items-center">
                  <div className="bg-success rounded-circle me-2" style={{ width: "8px", height: "8px" }}></div>
                  <span className={`small ${theme === 'dark' ? 'text-white' : 'text-dark'}`}>Database</span>
                </div>
                <span className="small text-success fw-bold">Connected</span>
              </div>

              <div className={`d-flex justify-content-between align-items-center p-3 rounded mb-3 ${theme === 'dark' ? 'bg-secondary' : 'bg-light'}`}>
                <div className="d-flex align-items-center">
                  <i className={`bi bi-clock me-2 ${theme === 'dark' ? 'text-light' : 'text-muted'}`}></i>
                  <span className={`small ${theme === 'dark' ? 'text-white' : 'text-dark'}`}>Last Backup</span>
                </div>
                <span className={`small ${theme === 'dark' ? 'text-light' : 'text-muted'}`}>2 hours ago</span>
              </div>

              <div className={`d-flex justify-content-between align-items-center p-3 rounded ${theme === 'dark' ? 'bg-primary bg-opacity-25' : 'bg-primary bg-opacity-10'}`}>
                <div className="d-flex align-items-center">
                  <i className={`bi bi-activity text-primary me-2`}></i>
                  <span className={`small ${theme === 'dark' ? 'text-white' : 'text-dark'}`}>Uptime</span>
                </div>
                <span className="small text-primary fw-bold">99.9%</span>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className={`h-100 shadow-sm ${theme === 'dark' ? 'bg-dark text-white border-secondary' : 'bg-white text-dark border-light'}`}>
            <Card.Header className={theme === 'dark' ? 'bg-dark text-white border-secondary' : 'bg-white text-dark border-light'}>
              <h5 className={`mb-0 ${theme === 'dark' ? 'text-white' : 'text-dark'}`}>Ringkasan Hari Ini</h5>
              <small className={theme === 'dark' ? 'text-light' : 'text-muted'}>Metrik utama untuk hari ini</small>
            </Card.Header>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div className="d-flex align-items-center">
                  <i className={`bi bi-people text-primary me-2`}></i>
                  <span className={`small ${theme === 'dark' ? 'text-white' : 'text-dark'}`}>Pasien Baru</span>
                </div>
                <span className="h4 text-primary mb-0">{stats.newPatientsToday}</span>
              </div>

              <div className="d-flex justify-content-between align-items-center mb-4">
                <div className="d-flex align-items-center">
                  <i className={`bi bi-calendar-check text-success me-2`}></i>
                  <span className={`small ${theme === 'dark' ? 'text-white' : 'text-dark'}`}>Janji Temu Selesai</span>
                </div>
                <span className="h4 text-success mb-0">{stats.completedAppointmentsToday}</span>
              </div>

              <div className="d-flex justify-content-between align-items-center mb-4">
                <div className="d-flex align-items-center">
                  <i className={`bi bi-file-medical text-info me-2`}></i>
                  <span className={`small ${theme === 'dark' ? 'text-white' : 'text-dark'}`}>Resep Diterbitkan</span>
                </div>
                <span className="h4 text-info mb-0">{stats.prescriptionsIssuedToday}</span>
              </div>

              <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                  <i className={`bi bi-currency-dollar text-warning me-2`}></i>
                  <span className={`small ${theme === 'dark' ? 'text-white' : 'text-dark'}`}>Pendapatan Hari Ini</span>
                </div>
                <span className="h5 text-warning mb-0">
                  {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    minimumFractionDigits: 0,
                  }).format(stats.todayRevenue)}
                </span>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Card className={`shadow-sm mb-5 ${theme === 'dark' ? 'bg-dark text-white border-secondary' : 'bg-white text-dark border-light'}`}>
        <Card.Header className={theme === 'dark' ? 'bg-dark text-white border-secondary' : 'bg-white text-dark border-light'}>
          <h5 className={`mb-0 ${theme === 'dark' ? 'text-white' : 'text-dark'}`}>Aksi Cepat</h5>
          <small className={theme === 'dark' ? 'text-light' : 'text-muted'}>Fungsi administratif yang sering digunakan</small>
        </Card.Header>
        <Card.Body>
          <Row className="text-center g-3">
            <Col xs={6} md={3}>
              <Button
                as={Link}
                to="/admin/patients"
                variant={theme === 'dark' ? 'outline-light' : 'outline-primary'}
                className="w-100 h-100 d-flex flex-column align-items-center justify-content-center py-4"
              >
                <i className="bi bi-people display-6 mb-2"></i>
                <span>Kelola Pasien</span>
              </Button>
            </Col>

            <Col xs={6} md={3}>
              <Button
                as={Link}
                to="/admin/doctors"
                variant={theme === 'dark' ? 'outline-light' : 'outline-success'}
                className="w-100 h-100 d-flex flex-column align-items-center justify-content-center py-4"
              >
                <i className="bi bi-person-badge display-6 mb-2"></i>
                <span>Kelola Dokter</span>
              </Button>
            </Col>

            <Col xs={6} md={3}>
              <Button
                as={Link}
                to="/admin/appointments"
                variant={theme === 'dark' ? 'outline-light' : 'outline-info'}
                className="w-100 h-100 d-flex flex-column align-items-center justify-content-center py-4"
              >
                <i className="bi bi-calendar-check display-6 mb-2"></i>
                <span>Janji Temu</span>
              </Button>
            </Col>

            <Col xs={6} md={3}>
              <Button
                as={Link}
                to="/admin/medicines"
                variant={theme === 'dark' ? 'outline-light' : 'outline-warning'}
                className="w-100 h-100 d-flex flex-column align-items-center justify-content-center py-4"
              >
                <i className="bi bi-capsule display-6 mb-2"></i>
                <span>Inventaris Obat</span>
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* System Alerts */}
      {systemAlerts.length > 0 && (
        <Card className={`shadow-sm ${theme === 'dark' ? 'bg-dark text-white border-secondary' : 'bg-white text-dark border-light'}`}>
          <Card.Body>
            <Card.Title className={`h5 mb-3 ${theme === 'dark' ? 'text-danger' : 'text-danger'}`}><i className="bi bi-exclamation-triangle-fill me-2"></i>Peringatan Sistem</Card.Title>
            <Alert variant={theme === 'dark' ? 'danger' : 'danger'} className={theme === 'dark' ? 'text-white' : ''}>
                <div className="d-flex justify-content-between align-items-center">
                  <span>{stats.lowStockMedicines} obat persediaan rendah</span>
                  <Button as={Link} to="/admin/medicines" variant={theme === 'dark' ? 'outline-light' : 'outline-danger'} size="sm">
                    Lihat Detail
                  </Button>
                </div>
            </Alert>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default AdminPanel;
