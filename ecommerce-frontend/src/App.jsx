import { useEffect } from 'react';
import './App.css';
import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from './context/AuthContext';
import { useSiteSettings } from './context/SiteSettingsContext';

function AppContent() {
  const { settings } = useSiteSettings();

  useEffect(() => {
    // Update document title and meta tags
    if (settings?.metaTitle || settings?.siteName) {
      document.title = settings.metaTitle || `${settings.siteName} - ${settings.siteTagline}`;
    }

    // Update meta description
    if (settings?.metaDescription) {
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.name = 'description';
        document.head.appendChild(metaDescription);
      }
      metaDescription.content = settings.metaDescription;
    }

    // Update meta keywords
    if (settings?.metaKeywords) {
      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (!metaKeywords) {
        metaKeywords = document.createElement('meta');
        metaKeywords.name = 'keywords';
        document.head.appendChild(metaKeywords);
      }
      metaKeywords.content = settings.metaKeywords;
    }

    // Update favicon — logo is the default when CMS has none
    const faviconHref = settings?.faviconUrl || '/logo.png';
    let favicon = document.querySelector('link[rel="icon"]');
    if (!favicon) {
      favicon = document.createElement('link');
      favicon.rel = 'icon';
      document.head.appendChild(favicon);
    }
    favicon.type = faviconHref.endsWith('.svg') ? 'image/svg+xml' : 'image/png';
    favicon.href = faviconHref;
  }, [settings]);

  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

function App() {
  return <AppContent />;
}

export default App;
