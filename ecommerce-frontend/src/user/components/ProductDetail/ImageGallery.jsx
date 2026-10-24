import React, { useState } from 'react';
import { resolveImagePath, getProductFallback } from '../../../utils/productImage';
import './ImageGallery.css';

const ImageGallery = ({ images = [], selectedImage = 0, onImageSelect, productName, productId }) => {
  const [showLightbox, setShowLightbox] = useState(false);
  const [broken, setBroken] = useState({});

  const safeImages =
    Array.isArray(images) && images.length > 0
      ? images
      : [{ imagePath: getProductFallback(productId || 0), isPrimary: true }];

  const getImageUrl = (image, index = 0) => {
    if (broken[index]) return getProductFallback((productId || 0) + index + 1);
    if (!image) return getProductFallback(productId || 0);
    return resolveImagePath(image.imagePath || image.imageUrl, (productId || 0) + index);
  };

  const activeIndex = Math.min(selectedImage, safeImages.length - 1);
  const currentImage = safeImages[activeIndex] || safeImages[0];

  return (
    <div className="image-gallery">
      <div
        className="main-image-container"
        onClick={() => setShowLightbox(true)}
      >
        <img
          src={getImageUrl(currentImage, activeIndex)}
          alt={productName}
          className="main-image"
          onError={() =>
            setBroken((prev) => ({ ...prev, [activeIndex]: true }))
          }
        />

        {safeImages.length > 1 && (
          <button type="button" className="zoom-hint">
            <i className="fas fa-search-plus"></i>
            <span>Click to enlarge</span>
          </button>
        )}

        {false && currentImage?.isPrimary && (
          <span className="primary-badge">Main Image</span>
        )}
      </div>

      {safeImages.length > 1 && (
        <div className="thumbnails-container">
          <div className="thumbnails-scroll">
            {safeImages.map((image, index) => (
              <button
                type="button"
                key={image.id || index}
                className={`thumbnail ${activeIndex === index ? 'active' : ''}`}
                onClick={() => onImageSelect?.(index)}
              >
                <img
                  src={getImageUrl(image, index)}
                  alt={`${productName} - ${index + 1}`}
                  onError={() =>
                    setBroken((prev) => ({ ...prev, [index]: true }))
                  }
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {showLightbox && (
        <div className="lightbox-overlay" onClick={() => setShowLightbox(false)}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="lightbox-close" onClick={() => setShowLightbox(false)}>
              <i className="fas fa-times"></i>
            </button>

            <button
              type="button"
              className="lightbox-nav prev"
              onClick={() => onImageSelect?.(Math.max(0, activeIndex - 1))}
              disabled={activeIndex === 0}
            >
              <i className="fas fa-chevron-left"></i>
            </button>

            <img
              src={getImageUrl(currentImage, activeIndex)}
              alt={productName}
              className="lightbox-image"
              onError={() =>
                setBroken((prev) => ({ ...prev, [activeIndex]: true }))
              }
            />

            <button
              type="button"
              className="lightbox-nav next"
              onClick={() => onImageSelect?.(Math.min(safeImages.length - 1, activeIndex + 1))}
              disabled={activeIndex === safeImages.length - 1}
            >
              <i className="fas fa-chevron-right"></i>
            </button>

            <div className="lightbox-counter">
              {activeIndex + 1} / {safeImages.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
