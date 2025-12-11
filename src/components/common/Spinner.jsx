// src/components/Spinner.jsx
import React from 'react';
import { useTheme } from '../../contexts/ThemeContexts'; // Sesuaikan path jika berbeda

const Spinner = () => {
  const { theme } = useTheme();
  const spinnerColorClass = theme === 'dark' ? 'text-light' : 'text-primary'; // Sesuaikan warna sesuai tema

  return (
    <div className="d-flex justify-content-center">
      <div className={`spinner-border ${spinnerColorClass}`} role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};

export default Spinner;
