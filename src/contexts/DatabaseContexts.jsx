"use client"

import { createContext, useContext, useState, useEffect } from "react"

const DatabaseContext = createContext()

export const useDatabase = () => {
  const context = useContext(DatabaseContext)
  if (!context) {
    throw new Error("useDatabase must be used within a DatabaseProvider")
  }
  return context
}

// Database Schema
const initialData = {
  users: [
    {
      id: 1,
      email: "admin@hospital.com",
      password: "admin123",
      name: "Administrator",
      role: "admin",
      phone: "081234567890",
      address: "Jl. Admin No. 1",
      createdAt: new Date().toISOString(),
    },
    {
      id: 2,
      email: "doctor@hospital.com",
      password: "doctor123",
      name: "Dr. John Doe",
      role: "doctor",
      phone: "081234567891",
      address: "Jl. Doctor No. 2",
      specialization: "Cardiologist",
      createdAt: new Date().toISOString(),
    },
    {
      id: 3,
      email: "patient@hospital.com",
      password: "patient123",
      name: "Jane Smith",
      role: "patient",
      phone: "081234567892",
      address: "Jl. Patient No. 3",
      dateOfBirth: "1990-01-01",
      gender: "female",
      createdAt: new Date().toISOString(),
    },
  ],
  doctors: [
    {
      id: 1,
      userId: 2,
      name: "Dr. John Doe",
      specialization: "Cardiologist",
      phone: "081234567891",
      email: "doctor@hospital.com",
      schedule: "Mon-Fri 08:00-17:00",
      experience: "10 years",
      education: "MD from University of Medicine",
      status: "active",
      createdAt: new Date().toISOString(),
    },
    {
      id: 2,
      userId: null,
      name: "Dr. Sarah Wilson",
      specialization: "Pediatrician",
      phone: "081234567893",
      email: "sarah@hospital.com",
      schedule: "Mon-Fri 09:00-16:00",
      experience: "8 years",
      education: "MD from Medical College",
      status: "active",
      createdAt: new Date().toISOString(),
    },
  ],
  patients: [
    {
      id: 1,
      userId: 3,
      name: "Jane Smith",
      phone: "081234567892",
      email: "patient@hospital.com",
      address: "Jl. Patient No. 3",
      dateOfBirth: "1990-01-01",
      gender: "female",
      bloodType: "A+",
      allergies: "None",
      emergencyContact: "081234567894",
      status: "active",
      createdAt: new Date().toISOString(),
    },
    {
      id: 2,
      userId: null,
      name: "Bob Johnson",
      phone: "081234567895",
      email: "bob@email.com",
      address: "Jl. Patient No. 4",
      dateOfBirth: "1985-05-15",
      gender: "male",
      bloodType: "B+",
      allergies: "Penicillin",
      emergencyContact: "081234567896",
      status: "active",
      createdAt: new Date().toISOString(),
    },
  ],
  appointments: [
    {
      id: 1,
      patientId: 1,
      doctorId: 1,
      patientName: "Jane Smith",
      doctorName: "Dr. John Doe",
      date: "2024-01-25",
      time: "10:00",
      type: "consultation",
      status: "scheduled",
      notes: "Regular checkup",
      createdAt: new Date().toISOString(),
    },
    {
      id: 2,
      patientId: 2,
      doctorId: 2,
      patientName: "Bob Johnson",
      doctorName: "Dr. Sarah Wilson",
      date: "2024-01-26",
      time: "14:00",
      type: "follow-up",
      status: "completed",
      notes: "Follow-up visit",
      createdAt: new Date().toISOString(),
    },
  ],
  medicines: [
    {
      id: 1,
      name: "Paracetamol",
      category: "Pain Relief",
      description: "Pain and fever relief medication",
      price: 5000,
      stock: 100,
      unit: "tablet",
      manufacturer: "PharmaCorp",
      expiryDate: "2025-12-31",
      status: "available",
      createdAt: new Date().toISOString(),
    },
    {
      id: 2,
      name: "Amoxicillin",
      category: "Antibiotic",
      description: "Broad-spectrum antibiotic",
      price: 15000,
      stock: 50,
      unit: "capsule",
      manufacturer: "MediPharm",
      expiryDate: "2025-06-30",
      status: "available",
      createdAt: new Date().toISOString(),
    },
  ],
  prescriptions: [
    {
      id: 1,
      patientId: 1,
      doctorId: 1,
      patientName: "Jane Smith",
      doctorName: "Dr. John Doe",
      medicines: [
        {
          medicineId: 1,
          medicineName: "Paracetamol",
          dosage: "500mg",
          frequency: "3 times daily",
          duration: "5 days",
          quantity: 15,
        },
      ],
      date: "2024-01-25",
      status: "active",
      notes: "Take after meals",
      createdAt: new Date().toISOString(),
    },
  ],
  medicalRecords: [
    {
      id: 1,
      patientId: 1,
      doctorId: 1,
      patientName: "Jane Smith",
      doctorName: "Dr. John Doe",
      date: "2024-01-25",
      diagnosis: "Common Cold",
      symptoms: "Fever, headache, runny nose",
      treatment: "Rest and medication",
      notes: "Patient recovering well",
      createdAt: new Date().toISOString(),
    },
  ],
}

export const DatabaseProvider = ({ children }) => {
  const [data, setData] = useState(() => {
    // Load data from localStorage or use initial data
    const savedData = localStorage.getItem("hospitalDB")
    return savedData ? JSON.parse(savedData) : initialData
  })

  const [patients, setPatients] = useState(data.patients)
  const [doctors, setDoctors] = useState(data.doctors)
  const [appointments, setAppointments] = useState(data.appointments)
  const [medicines, setMedicines] = useState(data.medicines)

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem("hospitalDB", JSON.stringify(data))
  }, [data])

  // Generic CRUD operations
  const create = (table, item) => {
    const newItem = {
      ...item,
      id: Date.now(), // Simple ID generation
      createdAt: new Date().toISOString(),
    }
    setData((prev) => ({
      ...prev,
      [table]: [...prev[table], newItem],
    }))
    return newItem
  }

  const read = (table, id = null) => {
    if (id) {
      return data[table].find((item) => item.id === id)
    }
    return data[table] || []
  }

  const update = (table, id, updates) => {
    setData((prev) => ({
      ...prev,
      [table]: prev[table].map((item) =>
        item.id === id ? { ...item, ...updates, updatedAt: new Date().toISOString() } : item,
      ),
    }))
  }

  const remove = (table, id) => {
    setData((prev) => ({
      ...prev,
      [table]: prev[table].filter((item) => item.id !== id),
    }))
  }

  // Specific database operations
  const findUser = (email, password) => {
    return data.users.find((user) => user.email === email && user.password === password)
  }

  const findUserByEmail = (email) => {
    return data.users.find((user) => user.email === email)
  }

  const getAppointmentsByPatient = (patientId) => {
    return data.appointments.filter((apt) => apt.patientId === patientId)
  }

  const getAppointmentsByDoctor = (doctorId) => {
    return data.appointments.filter((apt) => apt.doctorId === doctorId)
  }

  const getPrescriptionsByPatient = (patientId) => {
    return data.prescriptions.filter((presc) => presc.patientId === patientId)
  }

  const getMedicalRecordsByPatient = (patientId) => {
    return data.medicalRecords.filter((record) => record.patientId === patientId)
  }

  // Statistics
  const getStats = () => {
    return {
      totalPatients: data.patients.length,
      totalDoctors: data.doctors.length,
      totalAppointments: data.appointments.length,
      totalMedicines: data.medicines.length,
      todayAppointments: data.appointments.filter((apt) => apt.date === new Date().toISOString().split("T")[0]).length,
      pendingAppointments: data.appointments.filter((apt) => apt.status === "scheduled").length,
      completedAppointments: data.appointments.filter((apt) => apt.status === "completed").length,
      availableMedicines: data.medicines.filter((med) => med.status === "available").length,
    }
  }

  const value = {
    data,
    patients,
    setPatients,
    doctors,
    setDoctors,
    appointments,
    setAppointments,
    medicines,
    setMedicines,
    create,
    read,
    update,
    remove,
    findUser,
    findUserByEmail,
    getAppointmentsByPatient,
    getAppointmentsByDoctor,
    getPrescriptionsByPatient,
    getMedicalRecordsByPatient,
    getStats,
  }

  return <DatabaseContext.Provider value={value}>{children}</DatabaseContext.Provider>
}
