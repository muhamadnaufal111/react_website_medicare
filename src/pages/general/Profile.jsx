// src/pages/general/Profile.jsx (MODIFIKASI PENUH)
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContexts'; // Path Anda
import { useTheme } from '../../contexts/ThemeContexts'; // Path Anda
import { Link } from 'react-router-dom';

const Profile = () => {
  const { user, loading: authLoading } = useAuth();
  const { theme } = useTheme();

  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [profilePicFile, setProfilePicFile] = useState(null);
  const [profilePicUrl, setProfilePicUrl] = useState(null);
  const fileInputRef = useRef(null);

  const getThemeClass = (darkClass, lightClass) => {
    return theme === 'dark' ? darkClass : lightClass;
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!authLoading && user) {
        setIsLoading(true);
        setError(null);
        try {
          // --- MENGAMBIL DATA DARI JSON-SERVER /PROFILES ---
          const response = await fetch(`http://localhost:5000/profiles?userId=${user.id}`);
          if (!response.ok) {
            throw new Error('Gagal mengambil data profil.');
          }
          const profiles = await response.json();

          if (profiles.length > 0) {
            const fetchedProfile = profiles[0]; // Ambil profil pertama yang cocok
            setProfileData(fetchedProfile);
            setProfilePicUrl(fetchedProfile.profilePicUrl); // Set URL gambar dari data
          } else {
            setError('Profil tidak ditemukan untuk user ini. Harap login kembali atau hubungi admin.');
          }
        } catch (err) {
          console.error('Gagal memuat profil:', err);
          setError('Gagal memuat profil: ' + err.message);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchUserProfile();
  }, [user, authLoading]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicUrl(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setProfilePicFile(null);
      // Jika tidak ada file yang dipilih, kembalikan ke URL gambar asli (jika ada)
      setProfilePicUrl(profileData?.profilePicUrl || null);
    }
  };

  const handleUploadClick = () => {
    if (isEditing && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      let finalProfilePicUrl = profilePicUrl;

      if (profilePicFile) {
        console.log('Mulai unggah foto:', profilePicFile.name);
        // Simulate image upload (in real app, use FormData and actual API upload)
        finalProfilePicUrl = `https://picsum.photos/id/${Math.floor(Math.random() * 100)}/128/128?random=${Date.now()}`;
        console.log('Foto berhasil diunggah (dummy URL):', finalProfilePicUrl);
      }

      const updatedDataToSend = {
        ...profileData,
        profilePicUrl: finalProfilePicUrl
      };

      // --- MENGIRIM DATA PROFIL KE JSON-SERVER DENGAN PATCH/PUT ---
      // Gunakan PATCH jika Anda hanya ingin mengirim field yang diubah
      // Gunakan PUT jika Anda ingin mengirim seluruh objek dan menimpa yang lama
      const updateResponse = await fetch(`http://localhost:5000/profiles/${profileData.id}`, { // Menggunakan ID dari profil itu sendiri, bukan userId
        method: 'PUT', // Atau 'PATCH'
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedDataToSend),
      });

      if (!updateResponse.ok) {
        throw new Error('Gagal memperbarui profil di server.');
      }

      const savedProfile = await updateResponse.json();
      console.log('Profil berhasil diperbarui di server:', savedProfile);
      setProfileData(savedProfile); // Perbarui state dengan data yang disimpan server
      setProfilePicUrl(savedProfile.profilePicUrl);
      setIsEditing(false);
      // alert('Profil berhasil diperbarui!'); // Ganti dengan notifikasi yang lebih baik
    } catch (err) {
      console.error('Gagal memperbarui profil:', err);
      setError('Gagal memperbarui profil: ' + err.message);
    } finally {
      setIsLoading(false);
      setProfilePicFile(null);
    }
  };

  // ... (sisanya kode JSX Anda) ...
  if (authLoading || isLoading) {
    return (
      <div className={`container py-5 text-center ${getThemeClass('bg-dark text-light', 'bg-light text-dark')} min-vh-100`}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p>Memuat profil...</p>
      </div>
    );
  }

  if (error || !profileData) {
    return (
      <div className={`container py-5 text-center ${getThemeClass('text-danger bg-dark', 'text-danger bg-light')} min-vh-100`}>
        <p>{error || 'Data profil tidak tersedia.'}</p>
      </div>
    );
  }

  const renderField = (label, value) => (
    <div className="mb-3">
      <small className={getThemeClass('text-muted', 'text-secondary')}>{label}</small>
      <p className={getThemeClass('text-light', 'text-dark') + ' fw-medium'}>{value}</p>
    </div>
  );

  const renderInputField = (label, name, type = 'text', value, disabled = false, isTextArea = false) => (
    <div className="mb-3">
      <label htmlFor={name} className={`form-label ${getThemeClass('text-muted', 'text-secondary')}`}>{label}</label>
      {isTextArea ? (
        <textarea
          id={name}
          name={name}
          value={value || ''} // Tambahkan || '' untuk menghindari undefined/null
          onChange={handleChange}
          rows="3"
          className={`form-control ${getThemeClass('bg-dark text-light border-secondary', 'bg-light text-dark border-secondary')}`}
          disabled={disabled}
        ></textarea>
      ) : (
        <input
          type={type}
          id={name}
          name={name}
          value={value || ''} // Tambahkan || ''
          onChange={handleChange}
          className={`form-control ${getThemeClass('bg-dark text-light border-secondary', 'bg-light text-dark border-secondary')}`}
          disabled={disabled}
        />
      )}
    </div>
  );

  return (
    <div className={`${getThemeClass('bg-dark text-light', 'bg-light text-dark')} py-5 min-vh-100`}>
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className={`display-4 fw-bold ${getThemeClass('text-light', 'text-dark')}`}>Profil Saya</h1>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="btn btn-primary d-flex align-items-center"
          >
            <svg className="bi bi-pencil-square me-2" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2.75-2.75L13.793.63a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2.75-2.75L7.793 5.854 10.543 8.6l-.708.708-2.75-2.75L6.63 9.366a.5.5 0 0 1-.707 0L3.65 7.707a.5.5 0 0 1 0-.707l2.75-2.75L5.854 2.207a.5.5 0 0 1 .707 0l1.293 1.293 2.071 2.071-.708.708zM3 14h4v-1H3v1z"/></svg>
            {isEditing ? 'Batal Edit' : 'Edit Profil'}
          </button>
        </div>

        <p className={getThemeClass('text-muted', 'text-secondary') + ' mb-5'}>Kelola informasi pribadi dan medis Anda.</p>

        <form onSubmit={handleSubmit}>
          <div className="row g-4">
            <div className="col-md-8">
              {/* Basic Information */}
              <div className={`card ${getThemeClass('bg-dark text-light border-secondary', 'bg-light text-dark border-light')} mb-4`}>
                <div className="card-body">
                  <h3 className={`card-title h5 ${getThemeClass('text-light', 'text-dark')} mb-3 d-flex align-items-center`}>
                    <svg className={`bi bi-person-fill me-2 ${getThemeClass('text-info', 'text-primary')}`} width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/></svg>
                    Informasi Dasar
                  </h3>
                  <p className={`card-subtitle ${getThemeClass('text-muted', 'text-secondary')} mb-4`}>Informasi pribadi dan kontak.</p>
                  <div className="row">
                    {isEditing ? (
                      <>
                        <div className="col-md-6">{renderInputField('Nama Lengkap', 'name', 'text', profileData.name)}</div>
                        <div className="col-md-6">{renderInputField('Email', 'email', 'email', profileData.email, true)}</div>
                        <div className="col-md-6">{renderInputField('Nomor Telepon', 'phone', 'text', profileData.phone)}</div>
                        <div className="col-md-6">{renderInputField('Tanggal Lahir', 'dob', 'text', profileData.dob)}</div>
                        <div className="col-md-6">{renderInputField('Alamat', 'address', 'text', profileData.address)}</div>
                        <div className="col-md-6">{renderInputField('Jenis Kelamin', 'gender', 'text', profileData.gender)}</div>
                        <div className="col-md-6">{renderInputField('Pekerjaan', 'occupation', 'text', profileData.occupation)}</div>
                        {profileData.role === 'doctor' && (
                          <>
                            <div className="col-md-6">{renderInputField('Spesialisasi', 'specialization', 'text', profileData.specialization)}</div>
                            <div className="col-md-6">{renderInputField('No. Izin Praktik', 'licenseNumber', 'text', profileData.licenseNumber)}</div>
                            <div className="col-md-6">{renderInputField('Alamat Klinik', 'clinicAddress', 'text', profileData.clinicAddress)}</div>
                            <div className="col-md-12">{renderInputField('Info Jadwal', 'scheduleInfo', 'text', profileData.scheduleInfo, false, true)}</div>
                          </>
                        )}
                      </>
                    ) : (
                      <>
                        <div className="col-md-6">{renderField('Nama Lengkap', profileData.name)}</div>
                        <div className="col-md-6">{renderField('Email', profileData.email)}</div>
                        <div className="col-md-6">{renderField('Nomor Telepon', profileData.phone)}</div>
                        <div className="col-md-6">{renderField('Tanggal Lahir', profileData.dob)}</div>
                        <div className="col-md-6">{renderField('Alamat', profileData.address)}</div>
                        <div className="col-md-6">{renderField('Jenis Kelamin', profileData.gender)}</div>
                        <div className="col-md-6">{renderField('Pekerjaan', profileData.occupation)}</div>
                        {profileData.role === 'doctor' && (
                          <>
                            <div className="col-md-6">{renderField('Spesialisasi', profileData.specialization)}</div>
                            <div className="col-md-6">{renderField('No. Izin Praktik', profileData.licenseNumber)}</div>
                            <div className="col-md-6">{renderField('Alamat Klinik', profileData.clinicAddress)}</div>
                            <div className="col-md-12">{renderField('Info Jadwal', profileData.scheduleInfo)}</div>
                          </>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Medical Information (Patient only) */}
              {profileData.role === 'patient' && (
                <div className={`card ${getThemeClass('bg-dark text-light border-secondary', 'bg-light text-dark border-light')} mb-4`}>
                  <div className="card-body">
                    <h3 className={`card-title h5 ${getThemeClass('text-light', 'text-dark')} mb-3 d-flex align-items-center`}>
                      <svg className={`bi bi-heart-fill me-2 ${getThemeClass('text-danger', 'text-danger')}`} width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.736 8 15-7.534 4.736 3.562-3.248 8 1.314z"/></svg>
                      Informasi Medis
                    </h3>
                    <p className={`card-subtitle ${getThemeClass('text-muted', 'text-secondary')} mb-4`}>Informasi kesehatan dan medis.</p>
                    {isEditing ? (
                      <>
                        {renderInputField('Kontak Darurat', 'emergencyContact', 'text', profileData.emergencyContact)}
                        {renderInputField('Riwayat Alergi', 'allergies', 'text', profileData.allergies, false, true)}
                        {renderInputField('Riwayat Medis Lengkap', 'medicalHistory', 'text', profileData.medicalHistory, false, true)}
                      </>
                    ) : (
                      <>
                        {renderField('Kontak Darurat', profileData.emergencyContact)}
                        {renderField('Riwayat Alergi', profileData.allergies)}
                        {renderField('Riwayat Medis Lengkap', profileData.medicalHistory)}
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="col-md-4">
              {/* Profile Photo */}
              <div className={`card ${getThemeClass('bg-dark text-light border-secondary', 'bg-light text-dark border-light')} mb-4 text-center`}>
                <div className="card-body">
                  <h3 className={`card-title h5 ${getThemeClass('text-light', 'text-dark')} mb-3`}>Foto Profil</h3>
                  <div className={`rounded-circle ${getThemeClass('bg-secondary', 'bg-light-subtle')} d-flex align-items-center justify-content-center mx-auto mb-3 overflow-hidden`} style={{ width: '128px', height: '128px' }}>
                    {profilePicUrl ? (
                      <img
                        src={profilePicUrl}
                        alt="Foto Profil"
                        className="img-fluid"
                        style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                      />
                    ) : (
                      <svg className={`bi bi-person-fill ${getThemeClass('text-light', 'text-dark')}`} width="3em" height="3em" fill="currentColor" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/></svg>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                  />
                  <button
                    className={`btn ${getThemeClass('btn-secondary', 'btn-outline-secondary')} btn-sm`}
                    onClick={handleUploadClick}
                    disabled={!isEditing}
                  >
                    {profilePicUrl ? 'Ubah Foto' : 'Unggah Foto'}
                  </button>
                </div>
              </div>

              {/* Account Statistics */}
              <div className={`card ${getThemeClass('bg-dark text-light border-secondary', 'bg-light text-dark border-light')} mb-4`}>
                <div className="card-body">
                  <h3 className={`card-title h5 ${getThemeClass('text-light', 'text-dark')} mb-3`}>Statistik Akun</h3>
                  <div className="mb-3">
                    <small className={getThemeClass('text-muted', 'text-secondary')}>
                      <i className={`bi bi-calendar-plus me-2 ${getThemeClass('text-info', 'text-primary')}`}></i>Bergabung sejak:
                    </small>
                    <p className={getThemeClass('text-light', 'text-dark') + ' fw-medium'}>{profileData.joinedSince}</p>
                  </div>
                  {profileData.role === 'patient' && (
                    <>
                      {renderField('Total Kunjungan:', profileData.totalVisits)}
                      {renderField('Resep aktif:', profileData.activePrescriptions)}
                      {renderField('Janji temu mendatang:', profileData.upcomingAppointments)}
                    </>
                  )}
                  {profileData.role === 'doctor' && (
                    <>
                      {renderField('Total Pasien:', profileData.totalPatients)}
                      {renderField('Konsultasi Hari Ini:', profileData.consultationsToday)}
                      {renderField('Operasi Mendatang:', profileData.upcomingOperations)}
                    </>
                  )}
                </div>
              </div>

              {/* Security */}
              <div className={`card ${getThemeClass('bg-dark text-light border-secondary', 'bg-light text-dark border-light')} mb-4`}>
                <div className="card-body">
                  <h3 className={`card-title h5 ${getThemeClass('text-light', 'text-dark')} mb-3`}>Keamanan</h3>
                  <div className={`list-group list-group-flush ${getThemeClass('bg-dark', 'bg-light')}`}>
                    <Link to="/pengaturan-keamanan/ubah-password" className={`list-group-item list-group-item-action ${getThemeClass('bg-dark text-info border-secondary', 'bg-light text-primary border-light')} py-2`}>
                      Ubah Password
                    </Link>
                    <Link to="/pengaturan-keamanan/verifikasi-email" className={`list-group-item list-group-item-action ${getThemeClass('bg-dark text-info border-secondary', 'bg-light text-primary border-light')} py-2`}>
                      Verifikasi Email
                    </Link>
                    <Link to="/pengaturan-keamanan/riwayat-login" className={`list-group-item list-group-item-action ${getThemeClass('bg-dark text-info border-secondary', 'bg-light text-primary border-light')} py-2`}>
                      Riwayat Login
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {isEditing && (
            <div className={`d-flex justify-content-end mt-4 p-3 rounded shadow-sm ${getThemeClass('bg-dark border border-secondary', 'bg-light border border-light')}`}>
              <button
                type="button"
                onClick={() => {
                    setIsEditing(false);
                    setProfilePicFile(null);
                    setProfilePicUrl(profileData.profilePicUrl || null);
                }}
                className="btn btn-secondary me-3"
              >
                Batal
              </button>
              <button
                type="submit"
                className="btn btn-success"
              >
                {isLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Profile;