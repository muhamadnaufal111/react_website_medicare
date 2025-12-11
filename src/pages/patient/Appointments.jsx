"use client";

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Alert, Spinner, Modal, Badge, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useTheme } from '../../contexts/ThemeContexts'; 
import { useAuth } from '../../contexts/AuthContexts';

// Import komponen spesifik fitur Appointments (path disesuaikan)
import AppointmentDetailModal from '../../components/appointments/AppointmentDetailModal';
import AppointmentCancelConfirmationModal from '../../components/appointments/AppointmentCancelConfirmationModal';
import AppointmentAddEditModal from '../../components/appointments/AppointmentAddEditModal';
import AppointmentCard from '../../components/appointments/AppointmentCard';

import AOS from "aos";
import "aos/dist/aos.css";


const Appointments = () => {
    // Pastikan hooks ini dipanggil dalam komponen yang dibungkus oleh provider mereka
    const { theme } = useTheme();
    const { user } = useAuth();
    
    const [loading, setLoading] = useState(true);

    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [showCancelConfirmModal, setShowCancelConfirmModal] = useState(false);
    const [appointmentToCancel, setAppointmentToCancel] = useState(null);
    const [showAddEditModal, setShowAddEditModal] = useState(false);
    const [appointmentToEdit, setAppointmentToEdit] = useState(null);

    const [allAppointments, setAllAppointments] = useState({
        upcoming: [],
        past: [],
        cancelled: [],
    });

    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const displayAlert = (message, isSuccess = true) => {
        if (isSuccess) {
            setSuccessMessage(message);
            setErrorMessage('');
        } else {
            setErrorMessage(message);
            setSuccessMessage('');
        }
        setTimeout(() => {
            setSuccessMessage('');
            setErrorMessage('');
        }, 5000);
    };

    // Fungsi untuk mengambil data janji temu dari API
    const fetchAppointments = async () => {
        if (!user || !user.id) {
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`http://localhost:5000/appointments?userId=${user.id}&_expand=doctor`);
            if (!response.ok) throw new Error('Gagal mengambil data janji temu.');
            const data = await response.json();

            const now = new Date();
            // Atur waktu sekarang ke awal hari untuk perbandingan tanggal yang akurat
            now.setHours(0, 0, 0, 0); 
            
            const upcoming = [];
            const past = [];
            const cancelled = [];
            
            data.forEach(app => {
                const appDate = new Date(app.date); 
                appDate.setHours(0, 0, 0, 0); // Atur waktu tanggal janji temu ke awal hari

                if (app.status === 'Dibatalkan') {
                    cancelled.push(app);
                } else if (app.status === 'Selesai' || appDate < now) {
                    past.push(app);
                } else {
                    upcoming.push(app);
                }
            });

            setAllAppointments({
                // Urutkan janji temu mendatang berdasarkan tanggal terdekat (naik)
                upcoming: upcoming.sort((a, b) => new Date(a.date) - new Date(b.date)),
                // Urutkan janji temu yang lalu berdasarkan tanggal terbaru (turun)
                past: past.sort((a, b) => new Date(b.date) - new Date(a.date)),
                // Urutkan janji temu yang dibatalkan berdasarkan tanggal terbaru (turun)
                cancelled: cancelled.sort((a, b) => new Date(b.date) - new Date(a.date))
            });

        } catch (error) {
            console.error("Failed to fetch appointments:", error);
            displayAlert(`Gagal mengambil data: ${error.message}`, false);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        AOS.init();
        fetchAppointments();
    }, [user]);

    const handleViewDetails = (appointment) => {
        setSelectedAppointment(appointment);
        setShowDetailModal(true);
    };

    const handleCloseDetailModal = () => {
        setShowDetailModal(false);
        setSelectedAppointment(null);
    };

    const handlePrepareCancel = (appointment) => {
        setAppointmentToCancel(appointment);
        setShowCancelConfirmModal(true);
    };

    const handleCloseCancelConfirmModal = () => {
        setShowCancelConfirmModal(false);
        setAppointmentToCancel(null);
    };
    
    const handleSaveAppointment = async (newAppointmentData) => {
        setLoading(true);
        try {
            const url = newAppointmentData.id 
                ? `http://localhost:5000/appointments/${newAppointmentData.id}` 
                : 'http://localhost:5000/appointments';
            const method = newAppointmentData.id ? 'PUT' : 'POST';

            const payload = {
                ...newAppointmentData,
                userId: user.id,
                status: newAppointmentData.id ? newAppointmentData.status : 'Menunggu Persetujuan'
            };

            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) throw new Error('Gagal menyimpan janji temu.');
            
            await fetchAppointments(); 
            displayAlert(`Janji temu berhasil ${newAppointmentData.id ? 'diperbarui' : 'dibuat'}.`);
            console.log("Janji temu berhasil disimpan:", payload);

        } catch (error) {
            console.error("Gagal menyimpan janji temu:", error);
            displayAlert(`Gagal menyimpan janji temu: ${error.message}`, false);
        } finally {
            setLoading(false);
            setShowAddEditModal(false);
            setAppointmentToEdit(null);
        }
    };

    const handleRescheduleClick = (appointment) => {
        setAppointmentToEdit(appointment);
        setShowAddEditModal(true);
    };

    const handleConfirmCancel = async (id) => {
        setLoading(true);
        try {
            const appointmentToUpdate = allAppointments.upcoming.find(app => app.id === id);
            if (!appointmentToUpdate) throw new Error('Janji temu tidak ditemukan.');

            const response = await fetch(`http://localhost:5000/appointments/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    status: 'Dibatalkan',
                    cancelledBy: 'Pasien',
                    cancellationReason: 'Dibatalkan Oleh Pasien'
                }),
            });

            if (!response.ok) throw new Error('Gagal membatalkan janji temu.');

            await fetchAppointments();
            displayAlert('Janji temu berhasil dibatalkan.');
            console.log(`Janji temu ID ${id} berhasil dibatalkan.`);

        } catch (error) {
            console.error("Gagal membatalkan janji temu:", error);
            displayAlert(`Gagal membatalkan janji temu: ${error.message}`, false);
        } finally {
            setLoading(false);
            setShowCancelConfirmModal(false);
            setAppointmentToCancel(null);
        }
    };

    const getBadgeVariant = (status) => {
        switch (status) {
            case 'Dikonfirmasi':
                return 'bg-primary';
            case 'Menunggu Persetujuan':
                return 'bg-warning text-dark';
            case 'Selesai':
                return 'bg-success';
            case 'Ditolak':
            case 'Dibatalkan':  
                return 'bg-danger';
            default:
                return 'bg-info';
        }
    };

    return (
        <Container className={`py-5 ${theme === 'dark' ? 'text-white' : 'text-dark'}`}>
            <Row className="mb-4 align-items-center">
                <Col>
                    <h1 data-aos="fade-right" className={`mb-0 ${theme === 'dark' ? 'text-white' : 'text-dark'}`}>Janji Temu Dokter</h1>
                    <p data-aos="fade-right" className="lead text-muted">Kelola janji temu mendatang dan riwayat kunjungan Anda</p>
                </Col>
                <Col xs="auto">
                    <Button data-aos="fade-left" variant="primary" onClick={() => { setAppointmentToEdit(null); setShowAddEditModal(true); }}>
                        <i className="bi bi-plus-circle me-2"></i>Buat Janji Temu Baru
                    </Button>
                </Col>
            </Row>

            {successMessage && (
                <Alert variant="success" onClose={() => setSuccessMessage('')} dismissible>
                    {successMessage}
                </Alert>
            )}

            {errorMessage && (
                <Alert variant="danger" onClose={() => setErrorMessage('')} dismissible>
                    {errorMessage}
                </Alert>
            )}

            {loading && (
                <div className="text-center my-4">
                    <Spinner animation="border" variant={theme === 'dark' ? 'light' : 'primary'} />
                    <p className="mt-2">Loading Janji Temu...</p>
                </div>
            )}

            {!loading && (
                <>
                    <h2 data-aos="zoom-in-right" className={`mb-3 ${theme === 'dark' ? 'text-white' : 'text-dark'}`}>Janji Temu Mendatang</h2>
                    {allAppointments.upcoming.length > 0 ? (
                        allAppointments.upcoming.map((appointment) => (
                            <AppointmentCard
                                key={appointment.id}
                                appointment={appointment}
                                theme={theme}
                                onDetail={handleViewDetails}
                                onReschedule={handleRescheduleClick}
                                onCancel={handlePrepareCancel}
                                getBadgeVariant={getBadgeVariant}
                            />
                        ))
                    ) : (
                        <Alert variant={theme === 'dark' ? 'secondary' : 'info'} className="text-center">Tidak ada janji temu yang akan datang.</Alert>
                    )}

                    <h2 data-aos="zoom-in-right" className={`mt-5 mb-3 ${theme === 'dark' ? 'text-white' : 'text-dark'}`}>Janji Temu Dibatalkan</h2>
                    {allAppointments.cancelled.length > 0 ? (
                        allAppointments.cancelled.map((appointment) => (
                            <AppointmentCard
                                key={appointment.id}
                                appointment={appointment}
                                theme={theme}
                                onDetail={handleViewDetails}
                                onReschedule={handleRescheduleClick}
                                onCancel={handlePrepareCancel}
                                getBadgeVariant={getBadgeVariant}
                            />
                        ))
                    ) : (
                        <Alert variant={theme === 'dark' ? 'secondary' : 'info'} className="text-center">Tidak ada janji temu yang dibatalkan.</Alert>
                    )}

                    <h2 data-aos="zoom-in-right" className={`mt-5 mb-3 ${theme === 'dark' ? 'text-white' : 'text-dark'}`}>Janji Temu Sebelumnya</h2>
                    {allAppointments.past.length > 0 ? (
                        allAppointments.past.map((appointment) => (
                            <AppointmentCard
                                key={appointment.id}
                                appointment={appointment}
                                theme={theme}
                                onDetail={handleViewDetails}
                                onReschedule={handleRescheduleClick}
                                onCancel={handlePrepareCancel}
                                getBadgeVariant={getBadgeVariant}
                            />
                        ))
                    ) : (
                        <Alert variant={theme === 'dark' ? 'secondary' : 'info'} className="text-center">Tidak ada riwayat janji temu sebelumnya.</Alert>
                    )}
                </>
            )}

            <AppointmentDetailModal
                show={showDetailModal}
                handleClose={handleCloseDetailModal}
                appointment={selectedAppointment}
                theme={theme}
            />

            <AppointmentCancelConfirmationModal
                show={showCancelConfirmModal}
                handleClose={handleCloseCancelConfirmModal}
                handleConfirm={handleConfirmCancel}
                appointment={appointmentToCancel}
                theme={theme}
            />

            <AppointmentAddEditModal
                show={showAddEditModal}
                handleClose={() => { setShowAddEditModal(false); setAppointmentToEdit(null); }}
                appointment={appointmentToEdit}
                theme={theme}
                onSave={handleSaveAppointment}
            />
        </Container>
    );
};

export default Appointments;