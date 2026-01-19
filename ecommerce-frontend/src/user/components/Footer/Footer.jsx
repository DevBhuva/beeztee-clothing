
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSiteSettings } from '../../../context/SiteSettingsContext';
import { getFooterLinks } from '../../../services/cms.service';
import './Footer.css';

export default function Footer() {
  const { settings } = useSiteSettings();
  const [footerLinks, setFooterLinks] = useState({
    quick_links: [],
    support: [],
    company: [],
    legal: []
  });

  useEffect(() => {
    fetchFooterLinks();
  }, []);

  const fetchFooterLinks = async () => {
    try {
      const response = await getFooterLinks();
      if (response.success) {
        setFooterLinks(response.data);
      }
    } catch (error) {
      console.error('Error fetching footer links:', error);
    }
  };

  const renderLink = (page) => {
    const url = page.externalUrl || `/page/${page.slug}`;
    const target = page.openInNewTab ? '_blank' : '_self';
    const rel = page.openInNewTab ? 'noopener noreferrer' : undefined;

    if (page.externalUrl) {
      return (
        <li key={page.id}>
          <a href={url} target={target} rel={rel}>
            {page.iconClass && <i className={page.iconClass}></i>}
            {page.title}
          </a>
        </li>
      );
    }

    return (
      <li key={page.id}>
        <Link to={url} target={target} rel={rel}>
          {page.iconClass && <i className={page.iconClass}></i>}
          {page.title}
        </Link>
      </li>
    );
  };

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-content">
          {/* About Section */}
          <div className="footer-section about">
            <h2 className="logo-text">{settings?.siteName || 'YourBrand'}</h2>
            <p>
              {settings?.siteDescription || 'We are dedicated to providing the best service and products for our community. Your satisfaction is our priority.'}
            </p>
            <ul className="social-icons">
              {settings?.facebookUrl && (
                <li><a href={settings.facebookUrl} target="_blank" rel="noopener noreferrer" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a></li>
              )}
              {settings?.twitterUrl && (
                <li><a href={settings.twitterUrl} target="_blank" rel="noopener noreferrer" aria-label="Twitter"><i className="fab fa-twitter"></i></a></li>
              )}
              {settings?.instagramUrl && (
                <li><a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram"><i className="fab fa-instagram"></i></a></li>
              )}
              {settings?.linkedinUrl && (
                <li><a href={settings.linkedinUrl} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><i className="fab fa-linkedin-in"></i></a></li>
              )}
            </ul>
          </div>

          

          {/* Support Section */}
          <div className="footer-section links">
            <h3>Support</h3>
            <ul>
              {footerLinks.support.map(renderLink)}
            </ul>
          </div>

          {/* Company Section */}
          {footerLinks.company.length > 0 && (
            <div className="footer-section links">
              <h3>Company</h3>
              <ul>
                {footerLinks.company.map(renderLink)}
              </ul>
            </div>
          )}

          {/* Legal Section */}
          {footerLinks.legal.length > 0 && (
            <div className="footer-section links">
              <h3>Legal</h3>
              <ul>
                {footerLinks.legal.map(renderLink)}
              </ul>
            </div>
          )}

          {/* Contact Section */}
          <div className="footer-section newsletter">
            <h3>Contact Us</h3>
            {settings?.contactEmail && (
              <p><i className="fas fa-envelope"></i> {settings.contactEmail}</p>
            )}
            {settings?.contactPhone && (
              <p><i className="fas fa-phone"></i> {settings.contactPhone}</p>
            )}
            {settings?.contactAddress && (
              <p><i className="fas fa-map-marker-alt"></i> {settings.contactAddress}</p>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} {settings?.siteName || 'YourBrand'}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
