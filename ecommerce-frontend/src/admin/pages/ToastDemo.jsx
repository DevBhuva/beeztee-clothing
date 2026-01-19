import React from 'react';
import { showSuccess, showError, showWarning, showInfo, showConfirmDialog, showLoading, closeLoading } from '../../utils/toast';
import '../../utils/toast.css';

const ToastDemo = () => {
  const handleTestSuccess = () => {
    showSuccess('Operation completed successfully!');
  };

  const handleTestError = () => {
    showError('Something went wrong. Please try again.');
  };

  const handleTestWarning = () => {
    showWarning('Please check your input and try again.');
  };

  const handleTestInfo = () => {
    showInfo('This is an informational message.');
  };

  const handleTestConfirm = async () => {
    const result = await showConfirmDialog({
      title: 'Are you sure?',
      text: 'This action cannot be undone!',
      confirmButtonText: 'Yes, do it!',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      showSuccess('Action confirmed!');
    } else {
      showInfo('Action cancelled');
    }
  };

  const handleTestLoading = () => {
    showLoading('Processing your request...');
    setTimeout(() => {
      closeLoading();
      showSuccess('Done!');
    }, 3000);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Toast Notification Demo</h1>
        <p style={styles.subtitle}>Click any button to test the notification system</p>
        
        <div style={styles.grid}>
          <button style={{...styles.button, ...styles.successBtn}} onClick={handleTestSuccess}>
            ✓ Success Toast
          </button>
          
          <button style={{...styles.button, ...styles.errorBtn}} onClick={handleTestError}>
            ✗ Error Toast
          </button>
          
          <button style={{...styles.button, ...styles.warningBtn}} onClick={handleTestWarning}>
            ⚠ Warning Toast
          </button>
          
          <button style={{...styles.button, ...styles.infoBtn}} onClick={handleTestInfo}>
            ℹ Info Toast
          </button>
          
          <button style={{...styles.button, ...styles.confirmBtn}} onClick={handleTestConfirm}>
            ? Confirm Dialog
          </button>
          
          <button style={{...styles.button, ...styles.loadingBtn}} onClick={handleTestLoading}>
            ⟳ Loading Toast
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
    padding: '20px'
  },
  card: {
    background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
    padding: '40px',
    borderRadius: '20px',
    boxShadow: '0 16px 48px rgba(0, 0, 0, 0.5)',
    border: '1px solid rgba(212, 175, 55, 0.3)',
    maxWidth: '600px',
    width: '100%'
  },
  title: {
    fontSize: '32px',
    fontWeight: 'bold',
    background: 'linear-gradient(135deg, #d4af37 0%, #e91e63 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    marginBottom: '10px',
    textAlign: 'center'
  },
  subtitle: {
    color: '#888',
    textAlign: 'center',
    marginBottom: '30px'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '15px'
  },
  button: {
    padding: '15px 25px',
    fontSize: '16px',
    fontWeight: '600',
    border: 'none',
    borderRadius: '50px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    color: 'white',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  successBtn: {
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
  },
  errorBtn: {
    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
  },
  warningBtn: {
    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
  },
  infoBtn: {
    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
  },
  confirmBtn: {
    background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)'
  },
  loadingBtn: {
    background: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)'
  }
};

export default ToastDemo;
