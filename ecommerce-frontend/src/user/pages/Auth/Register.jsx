import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { customerRegister } from '../../../services/authService';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import './Register.css';

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [touched, setTouched] = useState({ name: false, email: false, phone: false });

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'phone') {
      setFormData(prev => ({
        ...prev,
        [name]: value.replace(/\D/g, '')
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    setError('');
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const getNameError = () => {
    if (!touched.name) return '';
    if (!formData.name.trim()) return 'Name is required';
    if (formData.name.trim().length < 2) return 'Name must be at least 2 characters';
    return '';
  };

  const getEmailError = () => {
    if (!touched.email) return '';
    if (!formData.email) return 'Email is required';
    if (!validateEmail(formData.email)) return 'Invalid email address';
    return '';
  };

  const getPhoneError = () => {
    if (!touched.phone) return '';
    if (!formData.phone) return 'Phone number is required';
    if (formData.phone.length < 10) return 'Phone number must be 10 digits';
    if (!validatePhone(formData.phone)) return 'Invalid phone number (must start with 6-9)';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ name: true, email: true, phone: true });
    setError('');

    const nameError = getNameError();
    const emailError = getEmailError();
    const phoneError = getPhoneError();

    if (nameError || emailError || phoneError) {
      setError('Please fix all errors before submitting');
      return;
    }

    setLoading(true);

    try {
      const result = await customerRegister(formData.name, formData.email, formData.phone);
      
      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(result.message);
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const nameError = getNameError();
  const emailError = getEmailError();
  const phoneError = getPhoneError();

  return (
    <>
      <Header />
      <div className="auth-page">
        <div className="auth-container">
          <div className="auth-card">
            <div className="auth-header">
              <h1>Create Account</h1>
              <p>Join Beetes Fashion & Style</p>
            </div>

            {success && (
              <div className="alert alert-success">
                <i className="fas fa-check-circle"></i>
                <span>Registration successful! Redirecting to login...</span>
              </div>
            )}

            {error && (
              <div className="alert alert-error">
                <i className="fas fa-exclamation-circle"></i>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="name">
                  Full Name <span className="required">*</span>
                </label>
                <div className={`input-group ${nameError ? 'error' : ''} ${formData.name && !nameError ? 'success' : ''}`}>
                  <i className="fas fa-user input-icon"></i>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={() => handleBlur('name')}
                    placeholder="Enter your full name"
                    disabled={loading || success}
                  />
                  {formData.name && !nameError && <i className="fas fa-check-circle success-icon"></i>}
                </div>
                {nameError && <small className="error-text">{nameError}</small>}
              </div>

              <div className="form-group">
                <label htmlFor="email">
                  Email Address <span className="required">*</span>
                </label>
                <div className={`input-group ${emailError ? 'error' : ''} ${formData.email && !emailError ? 'success' : ''}`}>
                  <i className="fas fa-envelope input-icon"></i>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={() => handleBlur('email')}
                    placeholder="Enter your email"
                    disabled={loading || success}
                  />
                  {formData.email && !emailError && <i className="fas fa-check-circle success-icon"></i>}
                </div>
                {emailError && <small className="error-text">{emailError}</small>}
              </div>

              <div className="form-group">
                <label htmlFor="phone">
                  Phone Number <span className="required">*</span>
                </label>
                <div className={`input-group ${phoneError ? 'error' : ''} ${formData.phone && !phoneError ? 'success' : ''}`}>
                  <i className="fas fa-phone input-icon"></i>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    onBlur={() => handleBlur('phone')}
                    placeholder="Enter 10-digit phone number"
                    maxLength="10"
                    disabled={loading || success}
                  />
                  {formData.phone && !phoneError && <i className="fas fa-check-circle success-icon"></i>}
                </div>
                {phoneError && <small className="error-text">{phoneError}</small>}
                {!phoneError && <small className="helper-text">Used for OTP-based login</small>}
              </div>

              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={loading || success || nameError || emailError || phoneError}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Creating Account...
                  </>
                ) : success ? (
                  <>
                    <i className="fas fa-check-circle"></i>
                    Account Created!
                  </>
                ) : (
                  <>
                    <i className="fas fa-user-plus"></i>
                    Create Account
                  </>
                )}
              </button>
            </form>

            <div className="auth-footer">
              <p>Already have an account? <Link to="/login">Login here</Link></p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Register;
