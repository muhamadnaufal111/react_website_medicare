// src/components/appointments/AppointmentAddEditModal.jsx
import React, { useRef } from 'react'; // Import useRef
import { Modal, Button } from 'react-bootstrap';
import AppointmentForm from './forms/AppointmentForm'; // PATH YANG BENAR

const AppointmentAddEditModal = ({ show, handleClose, appointment, theme, onSave }) => {
    // useRef untuk mengakses metode submitForm dari AppointmentForm
    const appointmentFormRef = useRef(null);

    // Fungsi ini akan dipanggil oleh AppointmentForm setelah validasi berhasil
    const handleFormSubmit = (data) => {
        // 'data' di sini adalah data yang sudah divalidasi oleh react-hook-form
        onSave(data); // Kirim data yang sudah divalidasi ke onSave prop dari parent (AppointmentsPage)
        handleClose(); // Tutup modal setelah disimpan
    };

    const getThemeClass = (darkClass, lightClass) => theme === 'dark' ? darkClass : lightClass;

    const handleModalSubmitClick = () => {
        // Panggil metode submitForm yang diekspos oleh AppointmentForm melalui ref
        if (appointmentFormRef.current) {
            appointmentFormRef.current.submitForm();
        }
    };

    return (
        <Modal show={show} onHide={handleClose} centered size="lg" dialogClassName={getThemeClass('modal-dark', '')}>
            <Modal.Header closeButton className={getThemeClass('bg-dark text-white border-secondary', 'bg-light text-dark border-light')}>
                <Modal.Title className={getThemeClass('text-white', 'text-dark')}>
                    {appointment ? 'Edit Janji Temu' : 'Buat Janji Temu Baru'}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className={getThemeClass('bg-dark text-white', 'bg-white text-dark')}>
                {/* Teruskan ref ke AppointmentForm */}
                <AppointmentForm
                    ref={appointmentFormRef} // Meneruskan ref di sini
                    initialData={appointment}
                    theme={theme}
                    // onFormChange={...} // Jika Anda membutuhkan ini, biarkan. Jika tidak, bisa dihapus.
                    onSubmit={handleFormSubmit} // Ini adalah handler untuk data yang sudah divalidasi
                />
            </Modal.Body>
            <Modal.Footer className={getThemeClass('bg-dark text-white border-secondary', 'bg-light text-dark border-light')}>
                <Button variant="danger" onClick={handleClose}>
                    Batal
                </Button>
                <Button variant="primary" onClick={handleModalSubmitClick}>
                    {appointment ? 'Simpan Perubahan' : 'Buat Janji Temu'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default AppointmentAddEditModal;