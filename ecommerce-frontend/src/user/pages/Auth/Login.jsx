import { useState } from 'react';
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
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({ phone: false, otp: false });

  const validatePhone = (phoneNumber) => {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phoneNumber);
  };

  const getPhoneError = () => {
    if (!touched.phone) return '';
    if (!phone) return 'Phone number is required';
    if (phone.length < 10) return 'Phone number must be 10 digits';
    if (!validatePhone(phone)) return 'Invalid phone number (must start with 6-9)';
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
    setTouched({ ...touched, phone: true });
    setError('');

    if (!phone) {
      setError('Please enter your phone number');
      return;
    }

    if (!validatePhone(phone)) {
      setError('Please enter a valid 10-digit phone number starting with 6-9');
      return;
    }

    setLoading(true);

    try {
      const result = await sendOTP(phone);
      
      if (result.success) {
        setStep(2);
        setError('');
        setTouched({ phone: false, otp: false });
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
      const result = await verifyOTP(phone, otp);
      
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
      const result = await sendOTP(phone);
      
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

  const handleBackToPhone = () => {
    setStep(1);
    setOtp('');
    setError('');
    setTouched({ phone: false, otp: false });
  };

  const phoneError = getPhoneError();
  const otpError = getOTPError();

  return (
    <>
      <Header />
      <div className="auth-page">
        <div className="auth-container">
          <div className="auth-card">
            <div className="auth-header">
              <h1>Welcome Back!</h1>
              <p>Login with OTP to continue shopping</p>
            </div>

            {error && (
              <div className="alert alert-error">
                <i className="fas fa-exclamation-circle"></i>
                <span>{error}</span>
              </div>
            )}

            {step === 1 && (
              <form onSubmit={handleSendOTP} className="auth-form">
               <div className={`input-group ${phoneError ? 'error' : ''} ${phone && !phoneError ? 'success' : ''}`}>
  <i className="fas fa-phone input-icon"></i>

  <input
    type="tel"
    id="phone"
    value={phone}
    onChange={(e) => {
      setPhone(e.target.value.replace(/\D/g, ''));
      setError('');
    }}
    onBlur={() => setTouched({ ...touched, phone: true })}
    placeholder="Enter 10-digit mobile number"
    maxLength="10"
    disabled={loading}
    autoFocus
  />

  {phone && !phoneError && <i className="fas fa-check-circle success-icon"></i>}
</div>

{phoneError && <small className="error-text">{phoneError}</small>}
{!phoneError && <small className="helper-text">We'll send you a 6-digit OTP</small>}


                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={loading || !!phoneError}
                >
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
                  <i className="fas fa-mobile-alt"></i>
                  <div>
                    <p>OTP sent to <strong>+91 {phone}</strong></p>
                    <button type="button" className="link-btn" onClick={handleBackToPhone}>
                      Change Number
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
                  {!otpError && <small className="helper-text">Check your phone for the OTP</small>}
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={loading || !!otpError}
                >
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
                  <p>Didn't receive OTP?</p>
                  <button type="button" className="link-btn" onClick={handleResendOTP} disabled={loading}>
                    <i className="fas fa-redo"></i>
                    Resend OTP
                  </button>
                </div>
              </form>
            )}

            <div className="auth-footer">
              <p>Don't have an account? <Link to="/register">Register here</Link></p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Login;
