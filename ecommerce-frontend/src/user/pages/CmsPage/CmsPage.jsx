import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { getPageBySlug } from '../../../services/cms.service';
import './CmsPage.css';

export default function CmsPage() {
  const { slug } = useParams();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPage();
  }, [slug]);

  const fetchPage = async () => {
    try {
      setLoading(true);
      const response = await getPageBySlug(slug);
      if (response.success) {
        setPage(response.data);
        
        // Update meta tags
        document.title = response.data.metaTitle || response.data.title;
        if (response.data.metaDescription) {
          let metaDescription = document.querySelector('meta[name="description"]');
          if (!metaDescription) {
            metaDescription = document.createElement('meta');
            metaDescription.name = 'description';
            document.head.appendChild(metaDescription);
          }
          metaDescription.content = response.data.metaDescription;
        }
      }
    } catch (err) {
      setError('Page not found');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="cms-page-container">
          <div className="loading-spinner">Loading...</div>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !page) {
    return (
      <>
        <Header />
        <div className="cms-page-container">
          <div className="error-message">
            <h1>404 - Page Not Found</h1>
            <p>The page you're looking for doesn't exist.</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="cms-page-container">
        <div className="cms-page-content">
          <h1 className="cms-page-title">{page.title}</h1>
          <div 
            className="cms-page-body" 
            dangerouslySetInnerHTML={{ __html: page.content }}
          />
        </div>
      </div>
      <Footer />
    </>
  );
}
