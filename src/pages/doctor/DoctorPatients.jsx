// src/pages/doctor/DoctorPatients.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContexts'; // Pastikan path benar
import Spinner from '../../components/common/Spinner'; // Pastikan path Spinner benar

const DoctorPatients = () => {
  const { theme } = useTheme();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Data mock pasien (ganti dengan fetch dari backend nanti)
  const mockPatients = [
    { id: 'P001', nama: 'Budi Santoso', kontak: '081234567890', tanggalKunjunganTerakhir: '2025-07-20', diagnosaTerakhir: 'Influenza', status: 'Aktif' },
    { id: 'P002', nama: 'Siti Aminah', kontak: '081211223344', tanggalKunjunganTerakhir: '2025-07-18', diagnosaTerakhir: 'Hipertensi', status: 'Perawatan' },
    { id: 'P003', nama: 'Agus Wijaya', kontak: '081255667788', tanggalKunjunganTerakhir: '2025-07-15', diagnosaTerakhir: 'Diabetes Mellitus', status: 'Aktif' },
    { id: 'P004', nama: 'Dewi Lestari', kontak: '081299887766', tanggalKunjunganTerakhir: '2025-07-10', diagnosaTerakhir: 'Asma', status: 'Perawatan' },
    { id: 'P005', nama: 'Joko Susanto', kontak: '081233445566', tanggalKunjunganTerakhir: '2025-07-05', diagnosaTerakhir: 'Gastritis', status: 'Aktif' },
  ];

  useEffect(() => {
    // Simulasikan pengambilan data dari API
    const fetchPatients = async () => {
      setLoading(true);
      return new Promise(resolve => {
        setTimeout(() => {
          setPatients(mockPatients);
          setLoading(false);
          resolve();
        }, 1000); // Simulasikan loading 1 detik
      });
    };

    fetchPatients();
  }, []);

  const filteredPatients = patients.filter(patient =>
    patient.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.diagnosaTerakhir.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const cardClass = theme === 'dark' ? 'bg-darker-gray text-white' : 'bg-white text-dark';
  const tableClass = theme === 'dark' ? 'table-dark' : '';
  const inputClass = theme === 'dark' ? 'form-control bg-secondary text-white border-dark' : 'form-control';

  return (
    <div className={`container-fluid py-4 ${theme === 'dark' ? 'bg-dark text-white' : 'bg-light text-dark'}`} style={{ minHeight: 'calc(100vh - 56px)' }}>
      <h2 className="mb-4">Daftar Pasien Saya</h2>

      <div className={`card shadow mb-4 ${cardClass}`}>
        <div className="card-body">
          <h5 className="card-title">Cari Pasien</h5>
          <input
            type="text"
            className={inputClass}
            placeholder="Cari berdasarkan nama atau diagnosa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className={`card shadow ${cardClass}`}>
        <div className="card-body">
          <h5 className="card-title mb-3">Semua Pasien Anda</h5>
          {loading ? (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
              <Spinner />
            </div>
          ) : filteredPatients.length === 0 ? (
            <p className="text-center">Tidak ada pasien yang ditemukan.</p>
          ) : (
            <div className="table-responsive">
              <table className={`table table-hover ${tableClass}`}>
                <thead>
                  <tr>
                    <th>Nama Pasien</th>
                    <th>Kontak</th>
                    <th>Diagnosa Terakhir</th>
                    <th>Kunjungan Terakhir</th>
                    <th>Status</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPatients.map((patient) => (
                    <tr key={patient.id}>
                      <td>{patient.nama}</td>
                      <td>{patient.kontak}</td>
                      <td>{patient.diagnosaTerakhir}</td>
                      <td>{patient.tanggalKunjunganTerakhir}</td>
                      <td>
                        <span className={`badge ${patient.status === 'Aktif' ? 'bg-success' : 'bg-info'}`}>
                          {patient.status}
                        </span>
                      </td>
                      <td>
                        <Link to={`/pasien/detail/${patient.id}`} className="btn btn-sm btn-info me-2">
                          <i className="bi bi-eye"></i> Detail
                        </Link>
                        {/* Contoh tombol lain, misalnya untuk membuat resep */}
                        <Link to={`/dokter/resep/baru/${patient.id}`} className="btn btn-sm btn-primary">
                          <i className="bi bi-pencil"></i> Resep
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorPatients;
