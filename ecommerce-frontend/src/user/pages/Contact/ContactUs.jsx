import React, { useState } from 'react';
import axios from 'axios';
import { useSiteSettings } from '../../../context/SiteSettingsContext';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import './ContactUs.css';

const SUPPORT_EMAIL = 'support@beeztee.com';
const CLOTHING_EMAIL = 'beezteeclothing@gmail.com';

const ContactUs = () => {
  const { settings } = useSiteSettings();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState({ type: '', text: '' });

  const extraEmail =
    settings?.contactEmail &&
    ![SUPPORT_EMAIL, CLOTHING_EMAIL].includes(settings.contactEmail)
      ? settings.contactEmail
      : null;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage({ type: '', text: '' });

    try {
      const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
      const response = await axios.post(`${apiBase}/contacts`, formData);

      if (response.data.success || response.data.status) {
        setSubmitMessage({
          type: 'success',
          text: response.data.message || 'Message sent. We will reply within 24 hours.',
        });
        resetForm();
      }
    } catch (error) {
      const body = [
        `Name: ${formData.firstName} ${formData.lastName}`,
        `Email: ${formData.email}`,
        formData.phone ? `Phone: ${formData.phone}` : '',
        '',
        formData.message,
      ]
        .filter(Boolean)
        .join('\n');

      window.location.href = `mailto:${SUPPORT_EMAIL}?cc=${CLOTHING_EMAIL}&subject=${encodeURIComponent(
        formData.subject || 'Beeztee enquiry'
      )}&body=${encodeURIComponent(body)}`;

      setSubmitMessage({
        type: 'success',
        text: 'Opening your email app to reach support@beeztee.com and beezteeclothing@gmail.com.',
      });
      resetForm();
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitMessage({ type: '', text: '' }), 6000);
    }
  };

  return (
    <>
      <Header />
      <div className="contact-us-page">
        <section className="contact-hero">
          <p className="contact-eyebrow">Hit us up</p>
          <h1>Drop a line</h1>
          <p className="contact-lead">
            Hit us with your thoughts — we’ll be in touch before you know it.
          </p>
        </section>

        <section className="contact-options">
          <div className="container">
            <div className="options-grid">
              <a className="contact-card" href={`mailto:${SUPPORT_EMAIL}`}>
                <div className="contact-icon">
                  <i className="fas fa-headset"></i>
                </div>
                <h3 className="contact-title">Customer Support</h3>
                <p className="contact-info">Orders, returns, and product questions</p>
                <span className="contact-action">
                  {SUPPORT_EMAIL} <i className="fas fa-arrow-right"></i>
                </span>
              </a>

              <a className="contact-card" href={`mailto:${CLOTHING_EMAIL}`}>
                <div className="contact-icon">
                  <i className="fas fa-envelope"></i>
                </div>
                <h3 className="contact-title">Clothing Desk</h3>
                <p className="contact-info">Wholesale, styling, and brand enquiries</p>
                <span className="contact-action">
                  {CLOTHING_EMAIL} <i className="fas fa-arrow-right"></i>
                </span>
              </a>

              {settings?.contactPhone && (
                <a className="contact-card" href={`tel:${settings.contactPhone}`}>
                  <div className="contact-icon">
                    <i className="fas fa-phone"></i>
                  </div>
                  <h3 className="contact-title">Call Us</h3>
                  <p className="contact-info">Monday to Friday, 9am to 6pm</p>
                  <span className="contact-action">
                    {settings.contactPhone} <i className="fas fa-arrow-right"></i>
                  </span>
                </a>
              )}

              {extraEmail && (
                <a className="contact-card" href={`mailto:${extraEmail}`}>
                  <div className="contact-icon">
                    <i className="fas fa-at"></i>
                  </div>
                  <h3 className="contact-title">Also reach us</h3>
                  <p className="contact-info">Additional inbox from store settings</p>
                  <span className="contact-action">
                    {extraEmail} <i className="fas fa-arrow-right"></i>
                  </span>
                </a>
              )}
            </div>
          </div>
        </section>

        <section className="contact-form-section">
          <div className="form-container">
            <div className="form-header">
              <h2 className="form-title">Send a message</h2>
              <p className="form-subtitle">
                Your note goes to {SUPPORT_EMAIL} and {CLOTHING_EMAIL}.
              </p>
            </div>

            {submitMessage.text && (
              <div className={`submit-message ${submitMessage.type}`}>
                {submitMessage.text}
              </div>
            )}

            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <input
                  type="text"
                  className="form-input"
                  id="firstName"
                  placeholder=" "
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
                <label className="form-label" htmlFor="firstName">First Name</label>
              </div>
              <div className="form-group">
                <input
                  type="text"
                  className="form-input"
                  id="lastName"
                  placeholder=" "
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
                <label className="form-label" htmlFor="lastName">Last Name</label>
              </div>
              <div className="form-group">
                <input
                  type="email"
                  className="form-input"
                  id="email"
                  placeholder=" "
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <label className="form-label" htmlFor="email">Email Address</label>
              </div>
              <div className="form-group">
                <input
                  type="tel"
                  className="form-input"
                  id="phone"
                  placeholder=" "
                  value={formData.phone}
                  onChange={handleChange}
                />
                <label className="form-label" htmlFor="phone">Phone Number</label>
              </div>
              <div className="form-group full-width">
                <input
                  type="text"
                  className="form-input"
                  id="subject"
                  placeholder=" "
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />
                <label className="form-label" htmlFor="subject">Subject</label>
              </div>
              <div className="form-group full-width">
                <textarea
                  className="form-textarea"
                  id="message"
                  placeholder=" "
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
                <label className="form-label" htmlFor="message">Your Message</label>
              </div>
              <button type="submit" className="submit-btn" disabled={isSubmitting}>
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default ContactUs;
