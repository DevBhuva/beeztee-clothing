import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { sendOTP, verifyOTP } from '../../../services/authService';
import { useAuth } from '../../../context/AuthContext';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import './Login.css';

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({ email: false, otp: false });

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, []);

  const validateEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const getEmailError = () => {
    if (!touched.email) return '';
    if (!email) return 'Email is required';
    if (!validateEmail(email)) return 'Invalid email address';
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
    setTouched({ ...touched, email: true });
    setError('');

    if (!email) {
      setError('Please enter your email');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      const result = await sendOTP(email.trim().toLowerCase());

      if (result.success) {
        setStep(2);
        setError('');
        setTouched({ email: false, otp: false });
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
    setTouched({ ...touched, otp: true });
    setError('');

    if (!otp) {
      setError('Please enter the OTP');
      return;
    }

    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);

    try {
      const result = await verifyOTP(email.trim().toLowerCase(), otp);

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
      const result = await sendOTP(email.trim().toLowerCase());

      if (result.success) {
        setOtp('');
        setError('');
      } else {
        setError(result.message);
      }
    } catch {
      setError('Failed to resend OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToEmail = () => {
    setStep(1);
    setOtp('');
    setError('');
    setTouched({ email: false, otp: false });
  };

  const emailError = getEmailError();
  const otpError = getOTPError();

  return (
    <>
      <Header />
      <div className="auth-page bh-page login-page">
        <div className="auth-container">
          <div className="auth-card">
            <div className="auth-header">
              <img src="/logo.png?v=3" alt="Beeztee" className="auth-logo" />
              <p className="auth-eyebrow">Account</p>
              <h1>Welcome back</h1>
              <p>Sign in with email OTP to continue shopping</p>
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
                  <label htmlFor="email">
                    Email Address <span className="required">*</span>
                  </label>
                  <div className={`input-group ${emailError ? 'error' : ''} ${email && !emailError ? 'success' : ''}`}>
                    <i className="fas fa-envelope input-icon"></i>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setError('');
                      }}
                      onBlur={() => setTouched({ ...touched, email: true })}
                      placeholder="Enter your email"
                      disabled={loading}
                      autoFocus
                    />
                    {email && !emailError && <i className="fas fa-check-circle success-icon"></i>}
                  </div>
                  {emailError && <small className="error-text">{emailError}</small>}
                  {!emailError && <small className="helper-text">We&apos;ll send a 6-digit OTP to your email</small>}
                </div>

                <button type="submit" className="btn btn-primary" disabled={loading || !!emailError}>
                  {loading ? (
                    <>
                      <span className="spinner"></span>
                      Sending OTP...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-paper-plane"></i>
                      Send OTP
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
                      OTP sent to <strong>{email}</strong>
                    </p>
                    <button type="button" className="link-btn" onClick={handleBackToEmail}>
                      Change Email
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
                      onBlur={() => setTouched({ ...touched, otp: true })}
                      placeholder="Enter 6-digit OTP"
                      maxLength="6"
                      disabled={loading}
                      autoFocus
                    />
                    {otp && !otpError && <i className="fas fa-check-circle success-icon"></i>}
                  </div>
                  {otpError && <small className="error-text">{otpError}</small>}
                  {!otpError && <small className="helper-text">Check your email for the OTP</small>}
                </div>

                <button type="submit" className="btn btn-primary" disabled={loading || !!otpError}>
                  {loading ? (
                    <>
                      <span className="spinner"></span>
                      Verifying...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-check-circle"></i>
                      Verify & Login
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
                Don&apos;t have an account? <Link to="/register">Register here</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Login;
