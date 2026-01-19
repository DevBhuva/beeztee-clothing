import React, { useState, useEffect } from 'react';
import { FaSave, FaUndo, FaGlobe, FaEnvelope, FaPhone, FaMapMarkerAlt, FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaDollarSign, FaClock, FaCog } from 'react-icons/fa';
import { getSettings, updateSettings, resetSettings } from '../../../services/siteSettings.service';
import { showSuccess, showError } from '../../../utils/toast';
import Swal from 'sweetalert2';
import './SiteSettings.css';

const SiteSettings = () => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  
  const [formData, setFormData] = useState({
    siteName: 'Beestee',
    siteTagline: '',
    siteDescription: '',
    contactEmail: '',
    contactPhone: '',
    whatsappNumber: '',
    contactAddress: '',
    logoUrl: '',
    faviconUrl: '',
    facebookUrl: '',
    twitterUrl: '',
    instagramUrl: '',
    linkedinUrl: '',
    youtubeUrl: '',
    pinterestUrl: '',
    tiktokUrl: '',
    metaTitle: '',
    metaDescription: '',
    metaKeywords: '',
    currency: 'USD',
    currencySymbol: '$',
    timezone: 'UTC',
    dateFormat: 'YYYY-MM-DD',
    timeFormat: 'HH:mm:ss',
    maintenanceMode: false,
    maintenanceMessage: '',
    allowRegistration: true,
    termsConditionsUrl: '',
    privacyPolicyUrl: ''
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const response = await getSettings();
      if (response.success && response.data) {
        setFormData(response.data);
      }
    } catch (error) {
      showError(error.message || 'Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const response = await updateSettings(formData);
      if (response.success) {
        showSuccess('Settings updated successfully!');
        setFormData(response.data);
      }
    } catch (error) {
      showError(error.message || 'Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    const result = await Swal.fire({
      title: 'Reset All Settings?',
      text: 'Are you sure you want to reset all settings to default? This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e91e63',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, reset all!',
      cancelButtonText: 'Cancel'
    });

    if (!result.isConfirmed) {
      return;
    }
    
    setLoading(true);
    try {
      const response = await resetSettings();
      if (response.success) {
        showSuccess('Settings reset to default successfully!');
        setFormData(response.data);
      }
    } catch (error) {
      showError(error.message || 'Failed to reset settings');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'general', label: 'General', icon: FaGlobe },
    { id: 'contact', label: 'Contact', icon: FaEnvelope },
    { id: 'social', label: 'Social Media', icon: FaFacebook },
    { id: 'seo', label: 'SEO', icon: FaGlobe },
    { id: 'regional', label: 'Regional', icon: FaDollarSign },
    { id: 'system', label: 'System', icon: FaCog }
  ];

  if (loading && !formData.siteName) {
    return (
      <div className="settings-loading">
        <div className="loading-spinner"></div>
        <p>Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="site-settings-page">
      <div className="settings-header">
        <div className="settings-header-left">
          <h1 className="settings-title">Site Settings</h1>
          <p className="settings-subtitle">Manage your website configuration</p>
        </div>
        <div className="settings-header-right">
          <button
            type="button"
            className="btn-reset-settings"
            onClick={handleReset}
            disabled={saving || loading}
          >
            <FaUndo /> Reset to Default
          </button>
          <button
            type="submit"
            form="settings-form"
            className="btn-save-settings"
            disabled={saving || loading}
          >
            <FaSave /> {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="settings-container">
        <div className="settings-tabs">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon className="tab-icon" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="settings-content">
          <form id="settings-form" onSubmit={handleSubmit}>
            {/* General Settings */}
            {activeTab === 'general' && (
              <div className="settings-section">
                <h2 className="section-title">General Information</h2>
                
                <div className="form-grid">
                  <div className="form-group full-width">
                    <label htmlFor="siteName">Site Name *</label>
                    <input
                      type="text"
                      id="siteName"
                      name="siteName"
                      value={formData.siteName}
                      onChange={handleChange}
                      required
                      placeholder="Enter site name"
                    />
                  </div>

                  <div className="form-group full-width">
                    <label htmlFor="siteTagline">Site Tagline</label>
                    <input
                      type="text"
                      id="siteTagline"
                      name="siteTagline"
                      value={formData.siteTagline}
                      onChange={handleChange}
                      placeholder="Your site tagline"
                    />
                  </div>

                  <div className="form-group full-width">
                    <label htmlFor="siteDescription">Site Description</label>
                    <textarea
                      id="siteDescription"
                      name="siteDescription"
                      value={formData.siteDescription}
                      onChange={handleChange}
                      rows="4"
                      placeholder="Describe your website"
                    />
                  </div>

                  <div className="form-group full-width">
                    <label htmlFor="logoUrl">Logo URL</label>
                    <input
                      type="url"
                      id="logoUrl"
                      name="logoUrl"
                      value={formData.logoUrl}
                      onChange={handleChange}
                      placeholder="https://example.com/logo.png"
                    />
                  </div>

                  <div className="form-group full-width">
                    <label htmlFor="faviconUrl">Favicon URL</label>
                    <input
                      type="url"
                      id="faviconUrl"
                      name="faviconUrl"
                      value={formData.faviconUrl}
                      onChange={handleChange}
                      placeholder="https://example.com/favicon.ico"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Contact Settings */}
            {activeTab === 'contact' && (
              <div className="settings-section">
                <h2 className="section-title">Contact Information</h2>
                
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="contactEmail">
                      <FaEnvelope className="label-icon" /> Email Address
                    </label>
                    <input
                      type="email"
                      id="contactEmail"
                      name="contactEmail"
                      value={formData.contactEmail}
                      onChange={handleChange}
                      placeholder="contact@example.com"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="contactPhone">
                      <FaPhone className="label-icon" /> Phone Number
                    </label>
                    <input
                      type="tel"
                      id="contactPhone"
                      name="contactPhone"
                      value={formData.contactPhone}
                      onChange={handleChange}
                      placeholder="+1 234 567 8900"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="whatsappNumber">
                      <FaPhone className="label-icon" /> WhatsApp Number
                    </label>
                    <input
                      type="tel"
                      id="whatsappNumber"
                      name="whatsappNumber"
                      value={formData.whatsappNumber}
                      onChange={handleChange}
                      placeholder="+1 234 567 8900"
                    />
                  </div>

                  <div className="form-group full-width">
                    <label htmlFor="contactAddress">
                      <FaMapMarkerAlt className="label-icon" /> Address
                    </label>
                    <textarea
                      id="contactAddress"
                      name="contactAddress"
                      value={formData.contactAddress}
                      onChange={handleChange}
                      rows="3"
                      placeholder="123 Main Street, City, Country"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Social Media Settings */}
            {activeTab === 'social' && (
              <div className="settings-section">
                <h2 className="section-title">Social Media Links</h2>
                
                <div className="form-grid">
                  <div className="form-group full-width">
                    <label htmlFor="facebookUrl">
                      <FaFacebook className="label-icon" /> Facebook URL
                    </label>
                    <input
                      type="url"
                      id="facebookUrl"
                      name="facebookUrl"
                      value={formData.facebookUrl}
                      onChange={handleChange}
                      placeholder="https://facebook.com/yourpage"
                    />
                  </div>

                  <div className="form-group full-width">
                    <label htmlFor="twitterUrl">
                      <FaTwitter className="label-icon" /> Twitter URL
                    </label>
                    <input
                      type="url"
                      id="twitterUrl"
                      name="twitterUrl"
                      value={formData.twitterUrl}
                      onChange={handleChange}
                      placeholder="https://twitter.com/yourprofile"
                    />
                  </div>

                  <div className="form-group full-width">
                    <label htmlFor="instagramUrl">
                      <FaInstagram className="label-icon" /> Instagram URL
                    </label>
                    <input
                      type="url"
                      id="instagramUrl"
                      name="instagramUrl"
                      value={formData.instagramUrl}
                      onChange={handleChange}
                      placeholder="https://instagram.com/yourprofile"
                    />
                  </div>

                  <div className="form-group full-width">
                    <label htmlFor="linkedinUrl">
                      <FaLinkedin className="label-icon" /> LinkedIn URL
                    </label>
                    <input
                      type="url"
                      id="linkedinUrl"
                      name="linkedinUrl"
                      value={formData.linkedinUrl}
                      onChange={handleChange}
                      placeholder="https://linkedin.com/company/yourcompany"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="youtubeUrl">
                      <FaLinkedin className="label-icon" /> YouTube URL
                    </label>
                    <input
                      type="url"
                      id="youtubeUrl"
                      name="youtubeUrl"
                      value={formData.youtubeUrl}
                      onChange={handleChange}
                      placeholder="https://youtube.com/@yourchannel"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="pinterestUrl">
                      <FaLinkedin className="label-icon" /> Pinterest URL
                    </label>
                    <input
                      type="url"
                      id="pinterestUrl"
                      name="pinterestUrl"
                      value={formData.pinterestUrl}
                      onChange={handleChange}
                      placeholder="https://pinterest.com/yourprofile"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="tiktokUrl">
                      <FaLinkedin className="label-icon" /> TikTok URL
                    </label>
                    <input
                      type="url"
                      id="tiktokUrl"
                      name="tiktokUrl"
                      value={formData.tiktokUrl}
                      onChange={handleChange}
                      placeholder="https://tiktok.com/@yourprofile"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* SEO Settings */}
            {activeTab === 'seo' && (
              <div className="settings-section">
                <h2 className="section-title">SEO Settings</h2>
                
                <div className="form-grid">
                  <div className="form-group full-width">
                    <label htmlFor="metaTitle">Meta Title</label>
                    <input
                      type="text"
                      id="metaTitle"
                      name="metaTitle"
                      value={formData.metaTitle}
                      onChange={handleChange}
                      placeholder="Your Site - Best E-Commerce Store"
                      maxLength="200"
                    />
                    <small className="form-help">Recommended: 50-60 characters</small>
                  </div>

                  <div className="form-group full-width">
                    <label htmlFor="metaDescription">Meta Description</label>
                    <textarea
                      id="metaDescription"
                      name="metaDescription"
                      value={formData.metaDescription}
                      onChange={handleChange}
                      rows="3"
                      placeholder="Brief description of your website for search engines"
                    />
                    <small className="form-help">Recommended: 150-160 characters</small>
                  </div>

                  <div className="form-group full-width">
                    <label htmlFor="metaKeywords">Meta Keywords</label>
                    <input
                      type="text"
                      id="metaKeywords"
                      name="metaKeywords"
                      value={formData.metaKeywords}
                      onChange={handleChange}
                      placeholder="ecommerce, shopping, products"
                    />
                    <small className="form-help">Separate keywords with commas</small>
                  </div>
                </div>
              </div>
            )}

            {/* Regional Settings */}
            {activeTab === 'regional' && (
              <div className="settings-section">
                <h2 className="section-title">Regional Settings</h2>
                
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="currency">
                      <FaDollarSign className="label-icon" /> Currency
                    </label>
                    <select
                      id="currency"
                      name="currency"
                      value={formData.currency}
                      onChange={handleChange}
                    >
                      <option value="USD">USD - US Dollar</option>
                      <option value="EUR">EUR - Euro</option>
                      <option value="GBP">GBP - British Pound</option>
                      <option value="INR">INR - Indian Rupee</option>
                      <option value="JPY">JPY - Japanese Yen</option>
                      <option value="AUD">AUD - Australian Dollar</option>
                      <option value="CAD">CAD - Canadian Dollar</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="currencySymbol">Currency Symbol</label>
                    <input
                      type="text"
                      id="currencySymbol"
                      name="currencySymbol"
                      value={formData.currencySymbol}
                      onChange={handleChange}
                      placeholder="$"
                      maxLength="5"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="timezone">
                      <FaClock className="label-icon" /> Timezone
                    </label>
                    <select
                      id="timezone"
                      name="timezone"
                      value={formData.timezone}
                      onChange={handleChange}
                    >
                      <option value="UTC">UTC</option>
                      <option value="America/New_York">Eastern Time</option>
                      <option value="America/Chicago">Central Time</option>
                      <option value="America/Denver">Mountain Time</option>
                      <option value="America/Los_Angeles">Pacific Time</option>
                      <option value="Europe/London">London</option>
                      <option value="Europe/Paris">Paris</option>
                      <option value="Asia/Tokyo">Tokyo</option>
                      <option value="Asia/Kolkata">India</option>
                      <option value="Australia/Sydney">Sydney</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="dateFormat">Date Format</label>
                    <select
                      id="dateFormat"
                      name="dateFormat"
                      value={formData.dateFormat}
                      onChange={handleChange}
                    >
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="DD-MM-YYYY">DD-MM-YYYY</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="timeFormat">Time Format</label>
                    <select
                      id="timeFormat"
                      name="timeFormat"
                      value={formData.timeFormat}
                      onChange={handleChange}
                    >
                      <option value="HH:mm:ss">24 Hour (HH:mm:ss)</option>
                      <option value="hh:mm:ss A">12 Hour (hh:mm:ss AM/PM)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* System Settings */}
            {activeTab === 'system' && (
              <div className="settings-section">
                <h2 className="section-title">System Settings</h2>
                
                <div className="form-grid">
                  <div className="form-group full-width">
                    <div className="checkbox-group">
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          name="maintenanceMode"
                          checked={formData.maintenanceMode}
                          onChange={handleChange}
                        />
                        <span className="checkbox-text">
                          <strong>Maintenance Mode</strong>
                          <small>Enable this to show maintenance page to visitors</small>
                        </span>
                      </label>
                    </div>
                  </div>

                  {formData.maintenanceMode && (
                    <div className="form-group full-width">
                      <label htmlFor="maintenanceMessage">Maintenance Message</label>
                      <textarea
                        id="maintenanceMessage"
                        name="maintenanceMessage"
                        value={formData.maintenanceMessage}
                        onChange={handleChange}
                        rows="3"
                        placeholder="We are currently performing maintenance. Please check back soon."
                      />
                    </div>
                  )}

                  <div className="form-group full-width">
                    <div className="checkbox-group">
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          name="allowRegistration"
                          checked={formData.allowRegistration}
                          onChange={handleChange}
                        />
                        <span className="checkbox-text">
                          <strong>Allow User Registration</strong>
                          <small>Allow new users to register on your site</small>
                        </span>
                      </label>
                    </div>
                  </div>

                  <div className="form-group full-width">
                    <label htmlFor="termsConditionsUrl">Terms & Conditions URL</label>
                    <input
                      type="url"
                      id="termsConditionsUrl"
                      name="termsConditionsUrl"
                      value={formData.termsConditionsUrl}
                      onChange={handleChange}
                      placeholder="https://example.com/terms"
                    />
                  </div>

                  <div className="form-group full-width">
                    <label htmlFor="privacyPolicyUrl">Privacy Policy URL</label>
                    <input
                      type="url"
                      id="privacyPolicyUrl"
                      name="privacyPolicyUrl"
                      value={formData.privacyPolicyUrl}
                      onChange={handleChange}
                      placeholder="https://example.com/privacy"
                    />
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default SiteSettings;
