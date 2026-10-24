import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const SiteSettingsContext = createContext();

export const useSiteSettings = () => {
  const context = useContext(SiteSettingsContext);
  if (!context) {
    throw new Error('useSiteSettings must be used within SiteSettingsProvider');
  }
  return context;
};

export const SiteSettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    siteName: 'Beeztee',
    siteTagline: 'Your Premium E-Commerce Store',
    siteDescription: 'We exist to replace the ordinary',
    contactEmail: '',
    contactPhone: '',
    whatsappNumber: '',
    contactAddress: '',
    logoUrl: '',
    faviconUrl: '/logo.png',
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
    currency: 'INR',
    currencySymbol: '₹',
    timezone: 'UTC',
    dateFormat: 'DD-MM-YYYY',
    timeFormat: 'HH:mm:ss',
    maintenanceMode: false,
    maintenanceMessage: '',
    allowRegistration: true,
    termsConditionsUrl: '',
    privacyPolicyUrl: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/site-settings');
      if (response.data.success) {
        setSettings(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching site settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    settings,
    loading,
    refreshSettings: fetchSettings
  };

  return (
    <SiteSettingsContext.Provider value={value}>
      {children}
    </SiteSettingsContext.Provider>
  );
};
