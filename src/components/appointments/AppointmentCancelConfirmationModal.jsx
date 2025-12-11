import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { formatDate } from '../common/FormatDate'; // Pastikan PATH YANG BENAR

const AppointmentCancelConfirmationModal = ({ show, handleClose, handleConfirm, appointment, theme }) => {
    if (!appointment) return null;
    const getThemeClass = (darkClass, lightClass) => theme === 'dark' ? darkClass : lightClass;

    return (
        <Modal show={show} onHide={handleClose} centered dialogClassName={getThemeClass('modal-dark', '')}>
            <Modal.Header closeButton className={getThemeClass('bg-dark text-white border-secondary', 'bg-light text-dark border-light')}>
                <Modal.Title className={getThemeClass('text-white', 'text-dark')}>Batalkan Janji Temu</Modal.Title>
            </Modal.Header>
            <Modal.Body className={getThemeClass('bg-dark text-white', 'bg-white text-dark')}>
                <p>Apakah Anda yakin ingin membatalkan janji temu dengan <strong>{appointment.doctor}</strong> pada tanggal <strong>{formatDate(appointment.date)}</strong> pukul <strong>{appointment.time}</strong>?</p>
                <p className="text-danger">Tindakan ini tidak dapat dibatalkan.</p>
                {/* Catatan baru untuk pembatalan oleh pasien */}
                <p className={getThemeClass('text-info', 'text-muted')} style={{ fontSize: '0.9em', marginTop: '15px' }}>
                    *Catatan: Pembatalan ini dilakukan oleh pasien sendiri.
                </p>
            </Modal.Body>
            <Modal.Footer className={getThemeClass('bg-dark text-white border-secondary', 'bg-light text-dark border-light')}>
                <Button variant="secondary" onClick={handleClose}>
                    Tidak, Biarkan
                </Button>
                <Button variant="danger" onClick={() => handleConfirm(appointment.id)}>
                    Ya, Batalkan
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default AppointmentCancelConfirmationModal;
