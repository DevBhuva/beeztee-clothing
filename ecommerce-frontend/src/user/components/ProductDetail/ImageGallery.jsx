import React, { useState } from 'react';
import './ImageGallery.css';

const ImageGallery = ({ images, selectedImage, onImageSelect, productName }) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [showLightbox, setShowLightbox] = useState(false);

  const baseURL = 'http://localhost:3000';

  const getImageUrl = (image) => {
    if (!image) return 'https://via.placeholder.com/600x750?text=No+Image';
    return `${baseURL}${image.imagePath}`;
  };

  const handleMouseMove = (e) => {
    if (!isZoomed) return;

    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;

    setZoomPosition({ x, y });
  };

  const currentImage = images[selectedImage] || images[0];

  return (
    <div className="image-gallery">
      {/* Main Image with Zoom */}
      <div
        className="main-image-container"
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
        onMouseMove={handleMouseMove}
        onClick={() => setShowLightbox(true)}
      >
        <img
          src={getImageUrl(currentImage)}
          alt={productName}
          className="main-image"
          style={
            isZoomed
              ? {
                  transform: 'scale(2)',
                  transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                  cursor: 'zoom-in'
                }
              : {}
          }
        />
        
        {images.length > 1 && (
          <button className="zoom-hint">
            <i className="fas fa-search-plus"></i>
            <span>Click to enlarge</span>
          </button>
        )}

        {currentImage?.isPrimary && (
          <span className="primary-badge">Main Image</span>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="thumbnails-container">
          <div className="thumbnails-scroll">
            {images.map((image, index) => (
              <div
                key={index}
                className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                onClick={() => onImageSelect(index)}
              >
                <img
                  src={getImageUrl(image)}
                  alt={`${productName} - ${index + 1}`}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lightbox Modal */}
      {showLightbox && (
        <div className="lightbox-overlay" onClick={() => setShowLightbox(false)}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={() => setShowLightbox(false)}>
              <i className="fas fa-times"></i>
            </button>

            <button
              className="lightbox-nav prev"
              onClick={() => onImageSelect(Math.max(0, selectedImage - 1))}
              disabled={selectedImage === 0}
            >
              <i className="fas fa-chevron-left"></i>
            </button>

            <img
              src={getImageUrl(currentImage)}
              alt={productName}
              className="lightbox-image"
            />

            <button
              className="lightbox-nav next"
              onClick={() => onImageSelect(Math.min(images.length - 1, selectedImage + 1))}
              disabled={selectedImage === images.length - 1}
            >
              <i className="fas fa-chevron-right"></i>
            </button>

            <div className="lightbox-counter">
              {selectedImage + 1} / {images.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
