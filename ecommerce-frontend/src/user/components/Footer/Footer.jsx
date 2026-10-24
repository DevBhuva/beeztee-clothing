import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSiteSettings } from '../../../context/SiteSettingsContext';
import { getFooterLinks } from '../../../services/cms.service';
import Marquee from '../Marquee/Marquee';
import { BEEZTEE_INSTAGRAM } from '../Instagram/InstagramFeed';
import './Footer.css';

const brandLogo = '/logo.png';
const SUPPORT_EMAIL = 'support@beeztee.com';
const CLOTHING_EMAIL = 'beezteeclothing@gmail.com';

const DEFAULT_SHOP = [
  { to: '/', label: 'Hub' },
  { to: '/shop', label: 'Vault' },
  { to: '/sale', label: 'Archive' },
  { to: '/shop?categories=1', label: 'For Him' },
  { to: '/shop?categories=2', label: 'For Her' },
];

const DEFAULT_SUPPORT = [
  { to: '/contact', label: 'Hit us up' },
  { to: '/orders', label: 'Orders' },
  { to: '/profile', label: 'Account' },
  { to: '/register', label: 'Be the family' },
];

const DEFAULT_BRAND = [
  { to: '/about', label: 'Ethos' },
  { to: '/#journal', label: 'Inner Circle' },
  { to: '/page/shipping', label: 'Shipping' },
  { to: '/page/privacy', label: 'Privacy' },
  { to: '/page/terms', label: 'Terms' },
];

function cmsToItems(pages = []) {
  return pages.map((page) => ({
    to: page.externalUrl || `/page/${page.slug}`,
    label: page.title,
    external: Boolean(page.externalUrl),
    newTab: page.openInNewTab,
    key: page.id || page.slug || page.title,
  }));
}

function mergeLinks(base, extra) {
  const seen = new Set(base.map((item) => item.label.toLowerCase()));
  const extras = extra.filter((item) => {
    const key = item.label.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  return [...base, ...extras];
}

function FooterLink({ item }) {
  if (item.external || /^https?:\/\//.test(item.to)) {
    return (
      <a href={item.to} target={item.newTab === false ? '_self' : '_blank'} rel="noopener noreferrer">
        {item.label}
      </a>
    );
  }
  return <Link to={item.to}>{item.label}</Link>;
}

export default function Footer() {
  const { settings } = useSiteSettings();
  const [footerLinks, setFooterLinks] = useState({
    quick_links: [],
    support: [],
    company: [],
    legal: [],
  });

  useEffect(() => {
    getFooterLinks()
      .then((response) => {
        if (response.success && response.data) setFooterLinks(response.data);
      })
      .catch(() => {});
  }, []);

  const brandName = settings?.siteName || 'Beeztee';
  const instagramUrl = settings?.instagramUrl || BEEZTEE_INSTAGRAM;
  const facebookUrl = settings?.facebookUrl || 'https://www.facebook.com/beezteeclothing';
  const extraEmail =
    settings?.contactEmail && ![SUPPORT_EMAIL, CLOTHING_EMAIL].includes(settings.contactEmail)
      ? settings.contactEmail
      : null;

  const shopLinks = mergeLinks(DEFAULT_SHOP, cmsToItems(footerLinks.quick_links));
  const supportLinks = mergeLinks(DEFAULT_SUPPORT, cmsToItems(footerLinks.support));
  const brandLinks = mergeLinks(DEFAULT_BRAND, [
    ...cmsToItems(footerLinks.company),
    ...cmsToItems(footerLinks.legal),
  ]);

  const socials = [
    { href: instagramUrl, label: 'Instagram', icon: 'fab fa-instagram' },
    { href: facebookUrl, label: 'Facebook', icon: 'fab fa-facebook-f' },
  ];

  if (settings?.whatsappNumber) {
    socials.push({
      href: `https://wa.me/${String(settings.whatsappNumber).replace(/\D/g, '')}`,
      label: 'WhatsApp',
      icon: 'fab fa-whatsapp',
    });
  }

  return (
    <>
      <Marquee />
      <footer className="site-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section about">
              <Link to="/" className="footer-brand" aria-label={brandName}>
                <img src={brandLogo} alt={brandName} className="footer-logo-img" />
              </Link>
              <p>
                {settings?.siteDescription &&
                settings.siteDescription !== 'Shop the best products at amazing prices'
                  ? settings.siteDescription
                  : 'We exist to replace the ordinary'}
              </p>
              <ul className="social-icons">
                {socials.map((social) => (
                  <li key={social.label}>
                    <a href={social.href} target="_blank" rel="noopener noreferrer" aria-label={social.label}>
                      <i className={social.icon}></i>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-section links">
              <h3>The rotation</h3>
              <ul>
                {shopLinks.map((item) => (
                  <li key={item.key || item.label}>
                    <FooterLink item={item} />
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-section links">
              <h3>FAQ & Chat</h3>
              <ul>
                {supportLinks.map((item) => (
                  <li key={item.key || item.label}>
                    <FooterLink item={item} />
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-section links">
              <h3>The brand</h3>
              <ul>
                {brandLinks.map((item) => (
                  <li key={item.key || item.label}>
                    <FooterLink item={item} />
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-section newsletter">
              <h3>Hit us up</h3>
              <a className="footer-contact" href={`mailto:${SUPPORT_EMAIL}`}>
                <i className="fas fa-envelope" aria-hidden="true" />
                <span>{SUPPORT_EMAIL}</span>
              </a>
              <a className="footer-contact" href={`mailto:${CLOTHING_EMAIL}`}>
                <i className="fas fa-envelope" aria-hidden="true" />
                <span>{CLOTHING_EMAIL}</span>
              </a>
              {extraEmail && (
                <a className="footer-contact" href={`mailto:${extraEmail}`}>
                  <i className="fas fa-envelope" aria-hidden="true" />
                  <span>{extraEmail}</span>
                </a>
              )}
              {settings?.contactPhone && (
                <a className="footer-contact" href={`tel:${settings.contactPhone}`}>
                  <i className="fas fa-phone" aria-hidden="true" />
                  <span>{settings.contactPhone}</span>
                </a>
              )}
              <a
                className="footer-contact"
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fab fa-instagram" aria-hidden="true" />
                <span>@beezteeclothing</span>
              </a>
            </div>
          </div>

          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} {brandName}. All rights reserved.</p>
            <div className="footer-bottom-links">
              <Link to="/page/privacy">Privacy</Link>
              <Link to="/page/terms">Terms</Link>
              <Link to="/contact">Hit us up</Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
