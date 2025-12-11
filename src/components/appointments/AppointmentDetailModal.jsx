// src/components/appointments/AppointmentDetailModal.jsx
import React from 'react';
import { Modal, Button, Row, Col } from 'react-bootstrap';
import { formatDate } from '../common/FormatDate'; // PASTIKAN PATH INI BENAR

const AppointmentDetailModal = ({ show, handleClose, appointment, theme }) => {
    // Jika tidak ada data appointment, jangan render modal
    if (!appointment) return null;

    // Helper untuk mendapatkan kelas CSS berdasarkan tema (gelap/terang)
    const getThemeClass = (darkClass, lightClass) => theme === 'dark' ? darkClass : lightClass;

    return (
        <Modal
            show={show} // Menentukan apakah modal terlihat
            onHide={handleClose} // Fungsi yang dipanggil saat modal ditutup
            centered // Memposisikan modal di tengah layar
            size="lg" // Ukuran modal besar
            dialogClassName={getThemeClass('modal-dark', '')} // Kelas tambahan untuk styling modal (misalnya tema gelap)
        >
            <Modal.Header
                closeButton // Tombol close di header
                className={getThemeClass('bg-dark text-white border-secondary', 'bg-light text-dark border-light')} // Styling header berdasarkan tema
            >
                <Modal.Title className={getThemeClass('text-white', 'text-dark')}>Detail Janji Temu</Modal.Title> {/* Judul modal */}
            </Modal.Header>

            <Modal.Body className={getThemeClass('bg-dark text-white', 'bg-white text-dark')}> {/* Konten body modal */}
                <Row className="g-3"> {/* Menggunakan g-3 untuk gap antara kolom */}
                    <Col md={6}> {/* Kolom pertama (setengah lebar di layar sedang ke atas) */}
                        {/* Detail Dokter */}
                        <p className="mb-1">
                            <small className={getThemeClass('text-muted', 'text-secondary')}>Dokter:</small> <br />
                            <span className="fw-medium">{appointment.doctor}</span>
                        </p>
                        {/* Detail Spesialisasi */}
                        <p className="mb-1">
                            <small className={getThemeClass('text-muted', 'text-secondary')}>Spesialisasi:</small> <br />
                            <span className="fw-medium">{appointment.specialty}</span>
                        </p>
                        {/* Detail Tanggal */}
                        <p className="mb-1">
                            <small className={getThemeClass('text-muted', 'text-secondary')}>Tanggal:</small> <br />
                            <span className="fw-medium">{formatDate(appointment.date)}</span>
                        </p>
                        {/* Detail Waktu */}
                        <p className="mb-1">
                            <small className={getThemeClass('text-muted', 'text-secondary')}>Waktu:</small> <br />
                            <span className="fw-medium">{appointment.time}</span>
                        </p>
                    </Col>

                    <Col md={6}> {/* Kolom kedua (setengah lebar di layar sedang ke atas) */}
                        {/* Detail Alasan */}
                        <p className="mb-1">
                            <small className={getThemeClass('text-muted', 'text-secondary')}>Alasan:</small> <br />
                            <span className="fw-medium">{appointment.reason}</span>
                        </p>
                        {/* Detail Lokasi */}
                        <p className="mb-1">
                            <small className={getThemeClass('text-muted', 'text-secondary')}>Lokasi:</small> <br />
                            <span className="fw-medium">{appointment.location}</span>
                        </p>
                        {/* Detail Status dengan badge warna dinamis */}
                        <p className="mb-1">
                            <small className={getThemeClass('text-muted', 'text-secondary')}>Status:</small> <br />
                            <span className={`badge ${
                                // Menentukan kelas warna badge berdasarkan status appointment
                                appointment.status === 'Upcoming' || appointment.status === 'Confirmed' ? 'bg-primary' : // Biru untuk Mendatang/Dikonfirmasi
                                appointment.status === 'Completed' ? 'bg-success' : // Hijau untuk Selesai
                                appointment.status === 'Rejected' || appointment.status === 'Cancelled' ? 'bg-danger' : // Merah untuk Ditolak/Dibatalkan
                                'bg-info' // Default (misalnya 'Menunggu Persetujuan')
                            }`}>
                                {appointment.status} {/* Menampilkan teks status */}
                            </span>
                        </p>
                        {/* Catatan Pasien (opsional, hanya tampil jika ada) */}
                        {appointment.notes && (
                            <p className="mb-1">
                                <small className={getThemeClass('text-muted', 'text-secondary')}>Note:</small> <br />
                                <span className="fw-medium">{appointment.notes}</span>
                            </p>
                        )}
                        {/* Alasan Pembatalan (opsional, hanya tampil jika ada) */}
                        {appointment.cancellationReason && (
                            <p className="mb-1">
                                <small className={getThemeClass('text-muted', 'text-secondary')}>Alasan Pembatalan:</small> <br />
                                <span className="fw-medium">{appointment.cancellationReason}</span>
                            </p>
                        )}
                    </Col>
                </Row>
            </Modal.Body>

            <Modal.Footer className={getThemeClass('bg-dark text-white border-secondary', 'bg-light text-dark border-light')}> {/* Footer modal */}
                <Button variant="secondary" onClick={handleClose}>
                    Tutup {/* Tombol Tutup */}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default AppointmentDetailModal;