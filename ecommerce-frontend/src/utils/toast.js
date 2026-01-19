import Swal from 'sweetalert2';

// Toast configuration matching admin panel theme
const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer);
    toast.addEventListener('mouseleave', Swal.resumeTimer);
  },
  customClass: {
    popup: 'custom-toast-popup',
    title: 'custom-toast-title',
    timerProgressBar: 'custom-toast-timer'
  },
  background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
  color: '#ffffff',
  iconColor: '#d4af37'
});

// Success toast
export const showSuccess = (message) => {
  Toast.fire({
    icon: 'success',
    title: message,
    iconColor: '#10b981'
  });
};

// Error toast
export const showError = (message) => {
  Toast.fire({
    icon: 'error',
    title: message,
    iconColor: '#ef4444'
  });
};

// Warning toast
export const showWarning = (message) => {
  Toast.fire({
    icon: 'warning',
    title: message,
    iconColor: '#f59e0b'
  });
};

// Info toast
export const showInfo = (message) => {
  Toast.fire({
    icon: 'info',
    title: message,
    iconColor: '#3b82f6'
  });
};

// Confirmation dialog (not a toast, but useful for delete confirmations)
export const showConfirmDialog = async (options = {}) => {
  const {
    title = 'Are you sure?',
    text = 'You won\'t be able to revert this!',
    confirmButtonText = 'Yes, delete it!',
    cancelButtonText = 'Cancel'
  } = options;

  return await Swal.fire({
    title,
    text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#6b7280',
    confirmButtonText,
    cancelButtonText,
    background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
    color: '#ffffff',
    customClass: {
      popup: 'custom-swal-popup',
      confirmButton: 'custom-swal-confirm',
      cancelButton: 'custom-swal-cancel'
    }
  });
};

// Loading toast
export const showLoading = (message = 'Loading...') => {
  Swal.fire({
    title: message,
    allowOutsideClick: false,
    allowEscapeKey: false,
    didOpen: () => {
      Swal.showLoading();
    },
    background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
    color: '#ffffff'
  });
};

// Close loading
export const closeLoading = () => {
  Swal.close();
};

// Export as object for convenience
export const showToast = {
  success: showSuccess,
  error: showError,
  warning: showWarning,
  info: showInfo
};
