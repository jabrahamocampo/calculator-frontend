// src/components/Toast.jsx
import React from 'react';
import '../styles/Toast.css';

const Toast = ({ message, type = 'info', onClose }) => {
  return (
    <div className={`toast toast-${type}`}>
      {message}
      <button className="toast-close" onClick={onClose}>
        ×
      </button>
    </div>
  );
};

export default Toast;
