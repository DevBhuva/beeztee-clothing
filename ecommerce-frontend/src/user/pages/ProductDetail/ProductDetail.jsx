import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useCart } from '../../../context/CartContext';
import { useWishlist } from '../../../context/WishlistContext';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import ImageGallery from '../../components/ProductDetail/ImageGallery';
import ProductInfo from '../../components/ProductDetail/ProductInfo';
import ProductTabs from '../../components/ProductDetail/ProductTabs';
import ReviewsSection from '../../components/ProductDetail/ReviewsSection';
import SimilarProducts from '../../components/ProductDetail/SimilarProducts';
import StickyAddToCart from '../../components/ProductDetail/StickyAddToCart';
import SizeChart from '../../components/ProductDetail/SizeChart';
import productService from '../../../services/productService';
import './ProductDetail.css';

const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const { isInWishlist: checkIsInWishlist, toggleWishlist } = useWishlist();

  // State Management
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [showSizeChart, setShowSizeChart] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [addingToWishlist, setAddingToWishlist] = useState(false);
  const [isInWishlistState, setIsInWishlistState] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);

  // Fetch Product Data
  useEffect(() => {
    fetchProductBySlug();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  // Check if in wishlist
  useEffect(() => {
    if (product && isAuthenticated) {
      setIsInWishlistState(checkIsInWishlist(product.id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product, isAuthenticated]);

  // Sticky add to cart on scroll
  useEffect(() => {
    const handleScroll = () => {
      const addToCartSection = document.querySelector('.product-actions');
      if (addToCartSection) {
        const rect = addToCartSection.getBoundingClientRect();
        setShowStickyBar(rect.bottom < 0);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchProductBySlug = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await productService.getProductBySlug(slug);
      
      console.log('Product Response:', response);
      
      // Handle response structure properly
      if (response?.data?.status && response?.data?.data) {
        setProduct(response.data.data);
        
        // Set default variant
        if (response.data.data.variants && response.data.data.variants.length > 0) {
          const defaultVariant = response.data.data.variants.find(v => v.isDefault) || response.data.data.variants[0];
          setSelectedVariant(defaultVariant);
          setSelectedSize(defaultVariant.size);
          setSelectedColor(defaultVariant.color);
        }
      } else if (response?.data) {
        // Fallback if data is directly in response.data
        setProduct(response.data);
        
        if (response.data.variants && response.data.variants.length > 0) {
          const defaultVariant = response.data.variants.find(v => v.isDefault) || response.data.variants[0];
          setSelectedVariant(defaultVariant);
          setSelectedSize(defaultVariant.size);
          setSelectedColor(defaultVariant.color);
        }
      } else {
        setError('Product not found');
      }
    } catch (err) {
      console.error('Error fetching product:', err);
      setError('Failed to load product details');
    } finally {
      setLoading(false);
    }
  };

  const handleVariantChange = (size, color) => {
    const variant = product.variants.find(
      v => (!size || v.size === size) && (!color || v.color === color)
    );

    if (variant) {
      setSelectedVariant(variant);
      setSelectedSize(size || variant.size);
      setSelectedColor(color || variant.color);

      // Track variant change
      if (window.gtag) {
        window.gtag('event', 'select_item', {
          items: [{
            id: product.id,
            name: product.name,
            variant: `${size}-${color}`
          }]
        });
      }
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/product/${slug}` } });
      return;
    }

    // Check if variant selection is required
    const hasVariants = product.variants && product.variants.length > 0;
    if (hasVariants && (!selectedSize && !selectedColor)) {
      alert('Please select size and color');
      return;
    }

    try {
      setAddingToCart(true);
      
      const success = await addToCart(
        product.id,
        quantity,
        selectedVariant?.id || null,
        selectedSize,
        selectedColor
      );

      if (success) {
        // Track add to cart event
        if (window.gtag) {
          window.gtag('event', 'add_to_cart', {
            items: [{
              id: product.id,
              name: product.name,
              price: selectedVariant?.salePrice || selectedVariant?.price || product.salePrice || product.basePrice,
              quantity: quantity
            }]
          });
        }
      }
    } catch (error) {
      console.error('Add to cart error:', error);
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/product/${slug}` } });
      return;
    }

    if (!selectedVariant || selectedVariant.stockQuantity < quantity) {
      alert('Please select a valid variant with sufficient stock');
      return;
    }

    // Add to cart first
    const result = productService.addToCart({
      ...product,
      selectedVariant,
      selectedSize,
      selectedColor
    }, quantity);

    if (result.success) {
      // Track buy now event
      if (window.gtag) {
        window.gtag('event', 'begin_checkout', {
          items: [{
            id: product.id,
            name: product.name,
            price: selectedVariant.salePrice || selectedVariant.price || product.salePrice,
            quantity: quantity
          }]
        });
      }
      
      // Navigate to checkout
      navigate('/checkout');
    } else {
      alert(result.message || 'Failed to process order');
    }
  };

  const handleWishlistToggle = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/product/${slug}` } });
      return;
    }

    try {
      setAddingToWishlist(true);
      const success = await toggleWishlist(product.id);
      
      if (success) {
        setIsInWishlistState(!isInWishlistState);
        
        // Track wishlist event
        if (window.gtag && !isInWishlistState) {
          window.gtag('event', 'add_to_wishlist', {
            items: [{
              id: product.id,
              name: product.name
            }]
          });
        }
      }
    } catch (error) {
      console.error('Wishlist toggle error:', error);
    } finally {
      setAddingToWishlist(false);
    }
  };

  const handleShare = async (platform) => {
    const url = window.location.href;
    const text = `Check out ${product.name}`;

    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`,
      pinterest: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&description=${encodeURIComponent(text)}`
    };

    if (platform === 'copy') {
      try {
        await navigator.clipboard.writeText(url);
        alert('Link copied to clipboard!');
      // eslint-disable-next-line no-unused-vars
      } catch (err) {
        alert('Failed to copy link');
      }
    } else if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
  };

  const getCurrentPrice = () => {
    if (selectedVariant) {
      return Number(selectedVariant.salePrice || selectedVariant.price || product.salePrice || product.basePrice || 0);
    }
    return Number(product?.salePrice || product?.basePrice || 0);
  };

  const getOriginalPrice = () => {
    if (selectedVariant && selectedVariant.price) {
      return Number(selectedVariant.price);
    }
    return Number(product?.basePrice || 0);
  };

  const calculateDiscount = () => {
    const current = getCurrentPrice();
    const original = getOriginalPrice();
    if (current < original) {
      return Math.round(((original - current) / original) * 100);
    }
    return 0;
  };

  const isInStock = () => {
    if (selectedVariant) {
      return selectedVariant.stockQuantity > 0;
    }
    return product?.stockQuantity > 0;
  };

  const getStockQuantity = () => {
    if (selectedVariant) {
      return selectedVariant.stockQuantity;
    }
    return product?.stockQuantity || 0;
  };

  // Breadcrumbs
  const breadcrumbs = product ? [
    { name: 'Home', link: '/' },
    { name: 'Shop', link: '/shop' },
    { name: product.category?.name || 'Category', link: `/shop?categories=${product.categoryId}` },
    { name: product.name, link: '' }
  ] : [];

  if (loading) {
    return (
      <>
        <Header />
        <div className="product-detail-skeleton">
          <div className="skeleton-container">
            <div className="skeleton-gallery"></div>
            <div className="skeleton-info"></div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !product) {
    return (
      <>
        <Header />
        <div className="product-error">
          <div className="error-container">
            <i className="fas fa-exclamation-triangle"></i>
            <h2>Product Not Found</h2>
            <p>{error || 'The product you are looking for does not exist.'}</p>
            <Link to="/shop" className="btn btn-primary">
              Continue Shopping
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      
      {/* Breadcrumbs */}
      <div className="pd-breadcrumbs-section">
        <div className="pd-container">
          <nav className="pd-breadcrumbs">
            {breadcrumbs.map((item, index) => (
              <React.Fragment key={index}>
                {item.link ? (
                  <Link to={item.link} className="pd-breadcrumb-link">
                    {item.name}
                  </Link>
                ) : (
                  <span className="pd-breadcrumb-current">{item.name}</span>
                )}
                {index < breadcrumbs.length - 1 && <span className="pd-breadcrumb-separator"> / </span>}
              </React.Fragment>
            ))}
          </nav>
        </div>
      </div>

      {/* Product Detail Section */}
      <div className="product-detail-page">
        <div className="pd-container">
          <div className="pd-main-grid">
            
            {/* Image Gallery */}
            <div className="pd-gallery-wrapper">
              <ImageGallery
                images={product.images || []}
                selectedImage={selectedImage}
                onImageSelect={setSelectedImage}
                productName={product.name}
              />
            </div>

            {/* Product Info */}
            <div className="pd-info-wrapper">
              <ProductInfo
                product={product}
                selectedVariant={selectedVariant}
                selectedSize={selectedSize}
                selectedColor={selectedColor}
                quantity={quantity}
                isInWishlist={isInWishlistState}
                isInStock={isInStock()}
                stockQuantity={getStockQuantity()}
                currentPrice={getCurrentPrice()}
                originalPrice={getOriginalPrice()}
                discount={calculateDiscount()}
                onVariantChange={handleVariantChange}
                onQuantityChange={setQuantity}
                onAddToCart={handleAddToCart}
                onBuyNow={handleBuyNow}
                onWishlistToggle={handleWishlistToggle}
                onShare={handleShare}
                onShowSizeChart={() => setShowSizeChart(true)}
                addingToCart={addingToCart}
                addingToWishlist={addingToWishlist}
                isAuthenticated={isAuthenticated}
              />


              {/* Trust Badges */}
              <div className="pd-trust-badges">
                <div className="pd-trust-badge">
                  <i className="fas fa-shield-alt"></i>
                  <span>100% Secure Payment</span>
                </div>
                <div className="pd-trust-badge">
                  <i className="fas fa-truck"></i>
                  <span>Free Shipping Above ₹499</span>
                </div>
                <div className="pd-trust-badge">
                  <i className="fas fa-undo"></i>
                  <span>Easy 7 Days Return</span>
                </div>
              </div>
            </div>
          </div>

          {/* Product Tabs (Description, Specifications, Reviews, Q&A) */}
          <ProductTabs
            product={product}
            selectedVariant={selectedVariant}
          />

          {/* Reviews Section */}
          <ReviewsSection
            productId={product.id}
            averageRating={product.averageRating}
            reviewCount={product.reviewCount}
            isAuthenticated={isAuthenticated}
          />

          {/* Similar Products */}
          <SimilarProducts
            categoryId={product.categoryId}
            currentProductId={product.id}
          />
        </div>
      </div>

      {/* Sticky Add to Cart Bar (Mobile) */}
      {showStickyBar && (
        <StickyAddToCart
          product={product}
          currentPrice={getCurrentPrice()}
          isInStock={isInStock()}
          onAddToCart={handleAddToCart}
          onBuyNow={handleBuyNow}
          addingToCart={addingToCart}
        />
      )}

      {/* Size Chart Modal */}
      {showSizeChart && (
        <SizeChart
          category={product.category?.name}
          onClose={() => setShowSizeChart(false)}
        />
      )}

      <Footer />

      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org/",
          "@type": "Product",
          "name": product.name,
          "image": product.images?.map(img => `http://localhost:3000${img.imagePath}`),
          "description": product.description,
          "sku": product.sku,
          "brand": {
            "@type": "Brand",
            "name": product.brand?.name || "Beetes"
          },
          "offers": {
            "@type": "Offer",
            "url": window.location.href,
            "priceCurrency": "INR",
            "price": getCurrentPrice(),
            "availability": isInStock() ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            "seller": {
              "@type": "Organization",
              "name": "Beetes Fashion"
            }
          },
          "aggregateRating": product.averageRating > 0 ? {
            "@type": "AggregateRating",
            "ratingValue": product.averageRating,
            "reviewCount": product.reviewCount
          } : undefined
        })}
      </script>
    </>
  );
};

export default ProductDetail;
