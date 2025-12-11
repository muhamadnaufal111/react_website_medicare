// src/contexts/AuthContexts.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

// Inisialisasi AuthContext dengan nilai default null
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // State untuk menyimpan data user yang sedang login
  // Inisialisasi awal dari localStorage atau null jika tidak ada
  // Set loading ke true secara default untuk menunjukkan bahwa kita sedang memuat user dari localStorage
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Default true saat startup

  // Hook useNavigate untuk navigasi programatik
  const navigate = useNavigate();

  // useEffect untuk memuat data user dari localStorage saat komponen pertama kali di-mount
  // Ini penting agar user tetap terautentikasi setelah refresh halaman
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (e) {
        console.error("Gagal memparsing user dari localStorage:", e);
        // Jika ada kesalahan parsing (data rusak), hapus dari localStorage
        localStorage.removeItem('currentUser');
      }
    }
    setLoading(false); // Setelah selesai mencoba memuat user, set loading ke false
  }, []); // Array dependensi kosong agar efek ini hanya berjalan sekali saat mount

  // Fungsi login
  const login = async (username, password) => {
    setLoading(true); // Mulai loading saat proses login
    try {
      // Ambil semua data user dari json-server
      const response = await fetch('http://localhost:5000/users');
      if (!response.ok) {
        throw new Error('Gagal mengambil data pengguna dari server.');
      }
      const users = await response.json();

      // Cari user yang cocok berdasarkan username dan password
      const foundUser = users.find(u => u.username === username && u.password === password);

      if (foundUser) {
        // Jika user ditemukan, simpan di localStorage dan state user
        localStorage.setItem('currentUser', JSON.stringify(foundUser));
        setUser(foundUser);
        console.log('Login berhasil:', foundUser);

        // Navigasi berdasarkan peran (role) user
        if (foundUser.role === 'admin') {
          navigate('/admin'); // Rute spesifik untuk admin
        } else if (foundUser.role === 'doctor') {
          navigate('/dokter/dashboard'); // Rute spesifik untuk dokter
        } else if (foundUser.role === 'patient') {
          navigate('/dashboard'); // Rute spesifik untuk pasien
        } else {
          // Fallback jika role tidak dikenal, arahkan ke halaman utama atau login
          console.warn('Peran pengguna tidak dikenal:', foundUser.role);
          navigate('/');
        }
        return { success: true }; // Mengembalikan indikasi keberhasilan
      } else {
        // Jika user tidak ditemukan, lempar error
        throw new Error('Username atau password salah.');
      }
    } catch (error) {
      // Tangani error selama proses login
      console.error('Login error:', error);
      return { success: false, message: error.message }; // Mengembalikan pesan error
    } finally {
      setLoading(false); // Hentikan loading terlepas dari berhasil atau gagal
    }
  };

  // Fungsi register
  const register = async ({name, email, password, role}) => {
    console.log('Data yang diterima oleh register:', { name, email, password, role });
    setLoading(true);
    try {
      // --- Langkah 1: Periksa apakah email (yang digunakan sebagai username) sudah terdaftar ---
      const usersResponse = await fetch(`http://localhost:5000/users?username=${email}`);
      if (!usersResponse.ok) {
          throw new Error('Gagal memeriksa ketersediaan email.');
      }
      const existingUsers = await usersResponse.json();
      if (existingUsers.length > 0) {
        throw new Error('Email sudah terdaftar. Gunakan email lain atau login.');
      }

      // --- Langkah 2: Buat entri user baru di endpoint /users ---
      const newUserResponse = await fetch('http://localhost:5000/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
          role,
          username: email, // Gunakan email sebagai username
        }),
      });

      if (!newUserResponse.ok) {
        const errorData = await newUserResponse.json();
        throw new Error(errorData.message || 'Gagal mendaftar pengguna.');
      }

      const newUser = await newUserResponse.json(); // Ambil data user yang baru dibuat
      console.log('Pendaftaran berhasil:', newUser);

      // --- Langkah 3: Buat entri profil kosong baru di endpoint /profiles ---
      const profileData = {
        userId: newUser.id, // Referensi ke ID user yang baru dibuat
        role: newUser.role,
        name: newUser.name,
        email: newUser.email,
        phone: '',
        address: '',
        joinedSince: new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }),
        profilePicUrl: `https://via.placeholder.com/128/cccccc/000000?text=${newUser.name ? newUser.name.charAt(0).toUpperCase() : '?'}`
      };

      // Tambahkan properti spesifik berdasarkan role
      if (newUser.role === 'patient') {
        profileData.dob = '';
        profileData.gender = '';
        profileData.occupation = '';
        profileData.medicalHistory = '';
        profileData.emergencyContact = '';
        profileData.allergies = '';
        profileData.totalVisits = 0;
        profileData.activePrescriptions = 0;
        profileData.upcomingAppointments = 0;
        profileData.lastVisitDate = '';
      } else if (newUser.role === 'doctor') {
        profileData.specialty = 'Umum'; // Default atau minta input dari form register
        profileData.licenseNumber = '';
        profileData.clinicAddress = '';
        profileData.scheduleInfo = '';
        profileData.totalPatients = 0;
        profileData.consultationsToday = 0;
        profileData.upcomingOperations = 0;
      } else if (newUser.role === 'admin') {
        // Admin mungkin tidak punya banyak properti spesifik di profil awal
      }

      const profileResponse = await fetch('http://localhost:5000/profiles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });

      if (!profileResponse.ok) {
        // Jika gagal membuat profil, log error tapi jangan hentikan pendaftaran user
        console.error('Gagal membuat profil untuk user baru:', await profileResponse.json());
      }
      return { success: true };
    } catch (error) {
      console.error('Register error:', error);
      return { success: false, message: error.message };
    } finally {
      setLoading(false); // Hentikan loading
    }
  };

  // Fungsi logout
  const logout = () => {
    localStorage.removeItem('currentUser'); // Hapus data user dari localStorage
    setUser(null); // Set user state ke null
    navigate('/masuk'); // Arahkan kembali ke halaman login
  };

  // Objek value yang akan disediakan oleh AuthContext
  const value = {
    user,
    loading,
    login,
    register,
    logout,
  };

  // Render provider yang membungkus children dengan nilai context
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook untuk memudahkan penggunaan AuthContext
export const useAuth = () => useContext(AuthContext);