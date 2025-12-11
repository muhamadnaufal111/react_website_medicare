    // src/routes/AppRoutes.jsx
    import React from 'react';
    import { Routes, Route, Link } from 'react-router-dom';
    import ProtectedRoute from '../components/core/ProtectedRoute';

    // Impor halaman-halaman utama
    import Login from '../pages/auth/Login';
    import Dashboard from '../pages/patient/Dashboard';
    import HomePage from '../pages/public/HomePage';
    import Register from '../pages/auth/Register';
    import MedicineInventory from '../pages/public/MedicineInventory';

    // Impor halaman-halaman pasien
    import PatientAppointments from '../pages/patient/Appointments';
    import PatientPrescriptions from '../pages/patient/Prescriptions';

    // Impor halaman-halaman dokter
    import DoctorDashboard from '../pages/doctor/DoctorDashboard';
    import DoctorAppointments from '../pages/doctor/Appointments';
    import DoctorPrescriptions from '../pages/doctor/DoctorPrescriptions'; 
    import Schedule from '../pages/doctor/Schedule';
    import DoctorPatients from '../pages/doctor/DoctorPatients';

    // Impor komponen manajemen admin
    import AdminPanel from '../pages/admin/AdminPanel';
    import ManagePatients from '../pages/admin/ManagePatients';
    import ManageDoctors from '../pages/admin/ManageDoctors';
    import AddDoctor from '../pages/admin/AddDoctor';
    import ManageAppointments from '../pages/admin/ManageAppointments';
    import ManageMedicines from '../pages/admin/ManageMedicines';

    // Impor komponen Profil generik
    import Profile from '../pages/general/Profile';

    // Impor halaman placeholder dari general
    import {
      Settings,
      SystemSettings,
      CreateAppointment
    } from '../pages/general/Placeholders';

    // Impor NotFound dari folder errors
    import NotFound from '../pages/errors/NotFound';

    const AppRoutes = () => {
      return (
        <Routes>
          {/* Rute publik */}
          <Route path="/" element={<HomePage />} />
          <Route path="/masuk" element={<Login />} />
          <Route path="/daftar" element={<Register />} />
          <Route path="/medicines" element={<MedicineInventory />} />

          {/* Rute yang dilindungi untuk semua peran yang login */}
          {/* Rute Profil generik untuk semua peran */}
          <Route path="/profil" element={<ProtectedRoute requiredRole={["patient", "doctor", "admin"]}><Profile /></ProtectedRoute>} />
          <Route path="/pengaturan" element={<ProtectedRoute requiredRole={["patient", "doctor", "admin"]}><Settings /></ProtectedRoute>} />

          {/* Rute khusus pasien */}
          <Route path="/dashboard" element={<ProtectedRoute requiredRole="patient"><Dashboard /></ProtectedRoute>} />
          <Route path="/pasien/janji-temu" element={<ProtectedRoute requiredRole="patient"><PatientAppointments /></ProtectedRoute>} />
          <Route path="/pasien/janji-temu/baru" element={<ProtectedRoute requiredRole="patient"><CreateAppointment /></ProtectedRoute>} />
          <Route path="/pasien/resep" element={<ProtectedRoute requiredRole="patient"><PatientPrescriptions /></ProtectedRoute>} />

          {/* Rute khusus dokter */}
          <Route path="/dokter/dashboard" element={<ProtectedRoute requiredRole="doctor"><DoctorDashboard /></ProtectedRoute>} />
          <Route path="/dokter/jadwal" element={<ProtectedRoute requiredRole="doctor"><Schedule /></ProtectedRoute>} />
          <Route path="/dokter/pasien" element={<ProtectedRoute requiredRole="doctor"><DoctorPatients /></ProtectedRoute>} />
          <Route path="/dokter/janji-temu" element={<ProtectedRoute requiredRole="doctor"><DoctorAppointments /></ProtectedRoute>} />
          <Route path="/dokter/resep" element={<ProtectedRoute requiredRole="doctor"><DoctorPrescriptions /></ProtectedRoute>} />

          {/* Rute khusus admin */}
          <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><AdminPanel /></ProtectedRoute>} />
          <Route path="/admin/patients" element={<ProtectedRoute requiredRole="admin"><ManagePatients /></ProtectedRoute>} />
          <Route path="/admin/doctors" element={<ProtectedRoute requiredRole="admin"><ManageDoctors /></ProtectedRoute>} />
          <Route path="/admin/doctors/new" element={<ProtectedRoute requiredRole="admin"><AddDoctor /></ProtectedRoute>} />
          <Route path="/admin/appointments" element={<ProtectedRoute requiredRole="admin"><ManageAppointments /></ProtectedRoute>} />
          <Route path="/admin/medicines" element={<ProtectedRoute requiredRole="admin"><ManageMedicines /></ProtectedRoute>} />
          <Route path="/admin/settings" element={<ProtectedRoute requiredRole="admin"><SystemSettings /></ProtectedRoute>} />

          {/* Rute catch-all untuk 404 Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      );
    };

    export default AppRoutes;
    