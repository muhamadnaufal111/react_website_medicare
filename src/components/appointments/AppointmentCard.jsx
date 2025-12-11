// src/components/appointments/AppointmentCard.jsx
import React from 'react';
import { Card, Row, Col, Button } from 'react-bootstrap';
import { formatDate } from '../common/FormatDate'; // PASTIKAN PATH INI BENAR

const AppointmentCard = ({ appointment, theme, onDetail, onReschedule, onCancel, getBadgeVariant }) => {
    // Helper untuk mendapatkan kelas CSS berdasarkan tema (gelap/terang)
    const getThemeClass = (darkClass, lightClass) => theme === 'dark' ? darkClass : lightClass;

    return (
        <Card data-aos="zoom-in-right" className={`mb-3 shadow-sm ${getThemeClass('bg-dark text-white border-secondary', 'bg-white text-dark border-light')}`}>
            <Card.Body>
                <Row className="align-items-center">
                    <Col md={7}>
                        <div className="d-flex align-items-center mb-2">
                            <i className="bi bi-person-circle me-2 fs-5" style={{ color: '#007bff' }}></i>
                            <h5 className="mb-0">
                                {appointment.doctor}
                                {/* Badge untuk Spesialisasi */}
                                <span className="badge bg-pink ms-2">{appointment.specialty}</span>
                            </h5>
                        </div>
                        {/* Detail Tanggal */}
                        <p className="mb-1"><i className="bi bi-calendar me-2" style={{ color: '#fd7e14' }}></i>{formatDate(appointment.date)}</p>
                        {/* Detail Alasan */}
                        <p className="mb-1"><i className="bi bi-chat-dots me-2" style={{ color: '#198754' }}></i>Alasan: {appointment.reason}</p>
                        {/* Detail Lokasi */}
                        <p className="mb-1"><i className="bi bi-geo-alt me-2" style={{ color: '#dc3545' }}></i>Lokasi: {appointment.location}</p>
                        {/* Catatan Pasien (opsional) */}
                        {appointment.notes && <p className="mb-0 text-muted"><small>Note: {appointment.notes}</small></p>}
                        {/* Informasi Pembatalan (jika status dibatalkan) */}
                        {appointment.status === 'Dibatalkan' && (
                            <>
                                <p className="mb-0 text-danger"><small>Dibatalkan oleh: <strong>{appointment.cancelledBy}</strong></small></p>
                                {appointment.cancellationReason && <p className="mb-0 text-danger"><small>Alasan: {appointment.cancellationReason}</small></p>}
                            </>
                        )}
                    </Col>
                    <Col md={5} className="text-md-end mt-3 mt-md-0">
                        {/* Detail Waktu */}
                        <p className="mb-1"><i className="bi bi-clock me-2"></i>{appointment.time}</p>
                        {/* Badge Status */}
                        <span className={`badge ${getBadgeVariant(appointment.status)} me-2`}>
                            {appointment.status}
                        </span>

                        {/* Tombol "Lihat Detail" - Selalu tampil */}
                        <Button variant="outline-primary" size="sm" className="me-2" onClick={() => onDetail(appointment)}>Lihat Detail</Button>

                        {/* Tombol "Jadwal Ulang" */}
                        {/* Tampil jika status "Menunggu Persetujuan" */}
                        {appointment.status === 'Menunggu Persetujuan' && (
                            <Button variant="outline-info" size="sm" className="me-2" onClick={() => onReschedule(appointment)}>Jadwal Ulang</Button>
                        )}

                        {/* Tombol "Batalkan" */}
                        {/* Tampil jika status "Menunggu Persetujuan" atau "Dikonfirmasi" */}
                        {(appointment.status === 'Menunggu Persetujuan' || appointment.status === 'Dikonfirmasi') && (
                            <Button variant="outline-danger" size="sm" onClick={() => onCancel(appointment)}>Batalkan</Button>
                        )}
                        
                        {/* Contoh status yang tombolnya tidak muncul: Dibatalkan, Selesai, dll. */}
                        {/* Untuk status "Dibatalkan" dan "Selesai", hanya tombol "Lihat Detail" yang akan muncul */}
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    );
};

export default AppointmentCard;