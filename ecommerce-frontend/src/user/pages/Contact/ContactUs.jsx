import React, { useState } from 'react';
import axios from 'axios';
import { useSiteSettings } from '../../../context/SiteSettingsContext';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import './ContactUs.css';

const ContactUs = () => {
  const { settings } = useSiteSettings();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage({ type: '', text: '' });

    try {
      const response = await axios.post('http://localhost:3000/api/contacts', formData);
      
      if (response.data.success) {
        setSubmitMessage({ 
          type: 'success', 
          text: response.data.message 
        });
        
        // Reset form
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
      }
    } catch (error) {
      setSubmitMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Something went wrong. Please try again.' 
      });
    } finally {
      setIsSubmitting(false);
      
      // Clear message after 5 seconds
      setTimeout(() => {
        setSubmitMessage({ type: '', text: '' });
      }, 5000);
    }
  };

  return (
    <>
      <Header />
      <div className="contact-us-page">
        {/* Contact Options Section */}
        <section className="contact-options">
          <div className="page-title-section">
            <h1 className="page-main-title">Contact Us</h1>
            <p className="page-subtitle">We'd love to hear from you</p>
          </div>
          <div className="container">
            <div className="options-grid">
              {settings.contactEmail && (
                <div className="contact-card" onClick={() => window.location.href = `mailto:${settings.contactEmail}`}>
                  <div className="contact-icon">
                    <i className="fas fa-envelope"></i>
                  </div>
                  <h3 className="contact-title">Email Us</h3>
                  <p className="contact-info">Send us an email and we'll respond within 24 hours</p>
                  <a href={`mailto:${settings.contactEmail}`} className="contact-action">
                    {settings.contactEmail} <i className="fas fa-arrow-right"></i>
                  </a>
                </div>
              )}
              {settings.contactPhone && (
                <div className="contact-card" onClick={() => window.location.href = `tel:${settings.contactPhone}`}>
                  <div className="contact-icon">
                    <i className="fas fa-phone"></i>
                  </div>
                  <h3 className="contact-title">Call Us</h3>
                  <p className="contact-info">Monday to Friday, 9am to 6pm</p>
                  <a href={`tel:${settings.contactPhone}`} className="contact-action">
                    {settings.contactPhone} <i className="fas fa-arrow-right"></i>
                  </a>
                </div>
              )}
              {settings.whatsappNumber && (
                <div className="contact-card" onClick={() => window.open(`https://wa.me/${settings.whatsappNumber.replace(/\D/g, '')}`, '_blank')}>
                  <div className="contact-icon">
                    <i className="fab fa-whatsapp"></i>
                  </div>
                  <h3 className="contact-title">WhatsApp</h3>
                  <p className="contact-info">Quick responses for urgent inquiries</p>
                  <a href={`https://wa.me/${settings.whatsappNumber.replace(/\D/g, '')}`} className="contact-action" target="_blank" rel="noopener noreferrer">
                    Start Chat <i className="fas fa-arrow-right"></i>
                  </a>
                </div>
              )}
            </div>
          </div>
        </section>

      {/* Contact Form Section */}
      <section className="contact-form-section">
        <div className="form-container">
          <div className="form-header">
            <h2 className="form-title">Send Us a Message</h2>
            <p className="form-subtitle">Fill out the form below and we'll get back to you as soon as possible</p>
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
              ></textarea>
              <label className="form-label" htmlFor="message">Your Message</label>
            </div>
            <button type="submit" className="submit-btn" disabled={isSubmitting}>
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </section>

      {/* Social Section */}
      <section className="social-section">
        <div className="social-container">
          <h2 className="social-title">Connect With Us</h2>
          <p className="social-description">Follow us on social media for style inspiration, new arrivals, and exclusive offers</p>
          <div className="social-links">
            {settings.facebookUrl && (
              <a href={settings.facebookUrl} className="social-link" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-facebook-f"></i>
              </a>
            )}
            {settings.instagramUrl && (
              <a href={settings.instagramUrl} className="social-link" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-instagram"></i>
              </a>
            )}
            {settings.pinterestUrl && (
              <a href={settings.pinterestUrl} className="social-link" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-pinterest"></i>
              </a>
            )}
            {settings.twitterUrl && (
              <a href={settings.twitterUrl} className="social-link" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-twitter"></i>
              </a>
            )}
            {settings.youtubeUrl && (
              <a href={settings.youtubeUrl} className="social-link" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-youtube"></i>
              </a>
            )}
            {settings.tiktokUrl && (
              <a href={settings.tiktokUrl} className="social-link" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-tiktok"></i>
              </a>
            )}
          </div>
        </div>
      </section>
    </div>
    <Footer />
    </>
  );
};

export default ContactUs;
