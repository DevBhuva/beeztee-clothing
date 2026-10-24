import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { sendRegisterOTP, verifyRegisterOTP } from '../../../services/authService';
import { useAuth } from '../../../context/AuthContext';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import './Register.css';

function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    phone: false,
    otp: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'phone') {
      setFormData((prev) => ({
        ...prev,
        [name]: value.replace(/\D/g, ''),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
    setError('');
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const validatePhone = (phone) => /^[6-9]\d{9}$/.test(phone);
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

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

  const getOTPError = () => {
    if (!touched.otp) return '';
    if (!otp) return 'OTP is required';
    if (otp.length !== 6) return 'OTP must be 6 digits';
    return '';
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setTouched({ name: true, email: true, phone: true, otp: false });
    setError('');

    const nameOk = formData.name.trim().length >= 2;
    const emailOk = validateEmail(formData.email);
    const phoneOk = validatePhone(formData.phone);

    if (!nameOk || !emailOk || !phoneOk) {
      setError('Please fix all errors before continuing');
      return;
    }

    setLoading(true);
    try {
      const result = await sendRegisterOTP(formData.name, formData.email, formData.phone);
      if (result.success) {
        setStep(2);
        setOtp('');
        setError('');
      } else {
        setError(result.message);
      }
    } catch {
      setError('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setTouched((prev) => ({ ...prev, otp: true }));
    setError('');

    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      const result = await verifyRegisterOTP(formData.email, otp);
      if (result.success) {
        login(result.user);
        navigate('/');
      } else {
        setError(result.message);
      }
    } catch {
      setError('OTP verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setError('');
    setLoading(true);
    try {
      const result = await sendRegisterOTP(formData.name, formData.email, formData.phone);
      if (result.success) {
        setOtp('');
      } else {
        setError(result.message);
      }
    } catch {
      setError('Failed to resend OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const nameError = getNameError();
  const emailError = getEmailError();
  const phoneError = getPhoneError();
  const otpError = getOTPError();

  return (
    <>
      <Header />
      <div className="auth-page bh-page register-page">
        <div className="auth-container">
          <div className="auth-card">
            <div className="auth-header">
              <p className="auth-eyebrow">Be the family</p>
              <h1>Create account</h1>
              <p>
                {step === 1
                  ? 'We’ll email a code to your inbox.'
                  : 'Enter the OTP we sent to your email.'}
              </p>
            </div>

            {error && (
              <div className="alert alert-error">
                <i className="fas fa-exclamation-circle"></i>
                <span>{error}</span>
              </div>
            )}

            {step === 1 && (
              <form onSubmit={handleSendOTP} className="auth-form">
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
                      disabled={loading}
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
                      disabled={loading}
                    />
                    {formData.email && !emailError && <i className="fas fa-check-circle success-icon"></i>}
                  </div>
                  {emailError && <small className="error-text">{emailError}</small>}
                  {!emailError && <small className="helper-text">OTP will be sent to this email</small>}
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
                      disabled={loading}
                    />
                    {formData.phone && !phoneError && <i className="fas fa-check-circle success-icon"></i>}
                  </div>
                  {phoneError && <small className="error-text">{phoneError}</small>}
                  {!phoneError && <small className="helper-text">For order and delivery updates only</small>}
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading || !!nameError || !!emailError || !!phoneError}
                >
                  {loading ? (
                    <>
                      <span className="spinner"></span>
                      Sending OTP...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-paper-plane"></i>
                      Send Email OTP
                    </>
                  )}
                </button>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleVerifyOTP} className="auth-form">
                <div className="otp-sent-info">
                  <i className="fas fa-envelope"></i>
                  <div>
                    <p>
                      OTP sent to <strong>{formData.email}</strong>
                    </p>
                    <button
                      type="button"
                      className="link-btn"
                      onClick={() => {
                        setStep(1);
                        setOtp('');
                        setError('');
                        setTouched((prev) => ({ ...prev, otp: false }));
                      }}
                    >
                      Change details
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="otp">
                    Enter OTP <span className="required">*</span>
                  </label>
                  <div className={`input-group ${otpError ? 'error' : ''} ${otp && !otpError ? 'success' : ''}`}>
                    <i className="fas fa-lock input-icon"></i>
                    <input
                      type="text"
                      id="otp"
                      value={otp}
                      onChange={(e) => {
                        setOtp(e.target.value.replace(/\D/g, ''));
                        setError('');
                      }}
                      onBlur={() => handleBlur('otp')}
                      placeholder="Enter 6-digit OTP"
                      maxLength="6"
                      disabled={loading}
                      autoFocus
                    />
                    {otp && !otpError && <i className="fas fa-check-circle success-icon"></i>}
                  </div>
                  {otpError && <small className="error-text">{otpError}</small>}
                  {!otpError && <small className="helper-text">Check your email inbox for the OTP</small>}
                </div>

                <button type="submit" className="btn btn-primary" disabled={loading || !!otpError}>
                  {loading ? (
                    <>
                      <span className="spinner"></span>
                      Verifying...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-user-check"></i>
                      Verify & Join
                    </>
                  )}
                </button>

                <div className="resend-section">
                  <p>Didn&apos;t receive OTP?</p>
                  <button type="button" className="link-btn" onClick={handleResendOTP} disabled={loading}>
                    <i className="fas fa-redo"></i>
                    Resend OTP
                  </button>
                </div>
              </form>
            )}

            <div className="auth-footer">
              <p>
                Already have an account? <Link to="/login">Login here</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Register;
