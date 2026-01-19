import React, { useState, useEffect } from 'react';
import reviewService from '../../../services/reviewService';
import { useAuth } from '../../../context/AuthContext';
import Swal from 'sweetalert2';
import './ReviewsSection.css';

const ReviewsSection = ({ productId, averageRating, reviewCount, isAuthenticated }) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState('recent');
  const [filterRating, setFilterRating] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [userReview, setUserReview] = useState(null);
  const [canReview, setCanReview] = useState(false);
  const [isVerifiedPurchase, setIsVerifiedPurchase] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    title: '',
    comment: '',
    images: []
  });
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId, sortBy, filterRating, page]);

  useEffect(() => {
    if (isAuthenticated && productId) {
      checkUserReview();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, productId]);

  const checkUserReview = async () => {
    try {
      // Check if user can review
      const canReviewResponse = await reviewService.canUserReview(productId);
      if (canReviewResponse.status && canReviewResponse.data) {
        setCanReview(canReviewResponse.data.canReview);
        setIsVerifiedPurchase(canReviewResponse.data.isVerifiedPurchase);
        
        if (!canReviewResponse.data.canReview && canReviewResponse.data.existingReview) {
          setUserReview(canReviewResponse.data.existingReview);
        }
      }
    } catch (error) {
      console.error('Error checking review status:', error);
    }
  };

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const params = {
        sortBy,
        rating: filterRating,
        page,
        limit: 10
      };
      
      const response = await reviewService.getProductReviews(productId, params);
      
      if (response.status && response.data) {
        setReviews(response.data.reviews || []);
        setTotalPages(response.data.pagination?.totalPages || 1);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setReviews([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!newReview.rating || newReview.rating < 1 || newReview.rating > 5) {
      newErrors.rating = 'Please select a rating';
    }
    
    if (!newReview.comment || newReview.comment.trim().length === 0) {
      newErrors.comment = 'Review comment is required';
    } else if (newReview.comment.trim().length < 10) {
      newErrors.comment = 'Review must be at least 10 characters';
    } else if (newReview.comment.trim().length > 2000) {
      newErrors.comment = 'Review must not exceed 2000 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      setErrors({ form: 'Please login to submit a review' });
      return;
    }

    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);
      setErrors({});
      setSuccessMessage('');
      
      const reviewData = {
        productId: parseInt(productId),
        rating: parseInt(newReview.rating),
        title: newReview.title.trim() || null,
        comment: newReview.comment.trim(),
        images: newReview.images || []
      };

      let response;
      if (userReview) {
        // Update existing review
        response = await reviewService.updateReview(userReview.id, reviewData);
        setSuccessMessage('Review updated successfully!');
      } else {
        // Add new review
        response = await reviewService.addReview(reviewData);
        setSuccessMessage('Review submitted successfully! Thank you for your feedback.');
      }

      if (response.status) {
        setShowReviewForm(false);
        setNewReview({ rating: 5, title: '', comment: '', images: [] });
        await fetchReviews();
        await checkUserReview();
        
        // Clear success message after 5 seconds
        setTimeout(() => setSuccessMessage(''), 5000);
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      const errorMessage = error.message || 'Failed to submit review. Please try again.';
      setErrors({ form: errorMessage });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditReview = () => {
    if (userReview) {
      setNewReview({
        rating: userReview.rating,
        title: userReview.title || '',
        comment: userReview.comment,
        images: userReview.images || []
      });
      setShowReviewForm(true);
    }
  };

  const handleDeleteReview = async () => {
    if (!userReview) return;
    
    const result = await Swal.fire({
      title: 'Delete Review?',
      text: 'Are you sure you want to delete your review? This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e91e63',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      setSubmitting(true);
      const response = await reviewService.deleteReview(userReview.id);
      
      if (response.status) {
        setSuccessMessage('Review deleted successfully');
        setUserReview(null);
        setCanReview(true);
        await fetchReviews();
        
        setTimeout(() => setSuccessMessage(''), 5000);
      }
    } catch (error) {
      console.error('Error deleting review:', error);
      setErrors({ form: 'Failed to delete review. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelEdit = () => {
    setShowReviewForm(false);
    setNewReview({ rating: 5, title: '', comment: '', images: [] });
    setErrors({});
  };

  const ratingBreakdown = [5, 4, 3, 2, 1].map(rating => {
    const count = reviews.filter(r => r.rating === rating).length;
    const percentage = reviewCount > 0 ? (count / reviewCount) * 100 : 0;
    return { rating, count, percentage };
  });

  return (
    <div className="reviews-section">
      <div className="reviews-header">
        <h2>Customer Reviews & Ratings</h2>
        {isAuthenticated && (
          <div className="review-actions-header">
            {userReview ? (
              <div className="user-review-actions">
                <button className="btn btn-secondary" onClick={handleEditReview}>
                  <i className="fas fa-edit"></i>
                  Edit Your Review
                </button>
                <button className="btn btn-danger" onClick={handleDeleteReview} disabled={submitting}>
                  <i className="fas fa-trash"></i>
                  Delete
                </button>
              </div>
            ) : canReview ? (
              <button className="btn btn-primary" onClick={() => setShowReviewForm(!showReviewForm)}>
                <i className="fas fa-star"></i>
                Write a Review
              </button>
            ) : (
              <p className="cannot-review-message">
                <i className="fas fa-info-circle"></i>
                You need to purchase this product to write a review
              </p>
            )}
          </div>
        )}
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="success-message">
          <i className="fas fa-check-circle"></i>
          {successMessage}
        </div>
      )}

      {/* Error Message */}
      {errors.form && (
        <div className="error-message">
          <i className="fas fa-exclamation-circle"></i>
          {errors.form}
        </div>
      )}

      {/* Rating Summary */}
      <div className="rating-summary">
        <div className="rating-overview">
          <div className="avg-rating">
            <span className="rating-number">
              {averageRating ? Number(averageRating).toFixed(1) : 'N/A'}
            </span>
            <div className="rating-stars">
              {[...Array(5)].map((_, i) => (
                <i key={i} className={`fas fa-star ${i < Math.floor(Number(averageRating) || 0) ? 'filled' : ''}`}></i>
              ))}
            </div>
            <span className="total-reviews">{reviewCount} reviews</span>
          </div>
        </div>

        <div className="rating-breakdown">
          {ratingBreakdown.map(({ rating, count, percentage }) => (
            <div key={rating} className="rating-bar" onClick={() => setFilterRating(rating)}>
              <span className="rating-label">{rating} <i className="fas fa-star"></i></span>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${percentage}%` }}></div>
              </div>
              <span className="rating-count">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Review Form */}
      {showReviewForm && (
        <div className="review-form-section">
          <h3>{userReview ? 'Edit Your Review' : 'Write Your Review'}</h3>
          {isVerifiedPurchase && (
            <div className="verified-purchase-badge">
              <i className="fas fa-check-circle"></i>
              Verified Purchase - Your review will be marked as a verified purchase
            </div>
          )}
          <form onSubmit={handleSubmitReview} className="review-form">
            <div className="form-group">
              <label>Rating * <span className="char-count">{newReview.rating}/5</span></label>
              <div className="star-rating-input">
                {[1, 2, 3, 4, 5].map(rating => (
                  <button
                    key={rating}
                    type="button"
                    className={`star-btn ${newReview.rating >= rating ? 'active' : ''}`}
                    onClick={() => setNewReview({ ...newReview, rating })}
                  >
                    <i className="fas fa-star"></i>
                  </button>
                ))}
              </div>
              {errors.rating && <span className="error-text">{errors.rating}</span>}
            </div>

            <div className="form-group">
              <label>Review Title (Optional)</label>
              <input
                type="text"
                className="form-control"
                value={newReview.title}
                onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
                placeholder="Brief headline for your review"
                maxLength="200"
              />
              <span className="char-count">{newReview.title.length}/200</span>
            </div>

            <div className="form-group">
              <label>Review * <span className="char-count">{newReview.comment.length}/2000</span></label>
              <textarea
                className={`form-control ${errors.comment ? 'error' : ''}`}
                rows="5"
                value={newReview.comment}
                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                placeholder="Share your experience with this product (minimum 10 characters)"
                required
                maxLength="2000"
              ></textarea>
              {errors.comment && <span className="error-text">{errors.comment}</span>}
              <span className="help-text">Minimum 10 characters required</span>
            </div>

            <div className="form-actions">
              <button type="button" className="btn btn-secondary" onClick={handleCancelEdit}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    {userReview ? 'Updating...' : 'Submitting...'}
                  </>
                ) : (
                  <>
                    <i className="fas fa-paper-plane"></i>
                    {userReview ? 'Update Review' : 'Submit Review'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filters & Sort */}
      <div className="reviews-controls">
        <div className="filter-buttons">
          <button
            className={`filter-btn ${filterRating === null ? 'active' : ''}`}
            onClick={() => setFilterRating(null)}
          >
            All Reviews
          </button>
          {[5, 4, 3, 2, 1].map(rating => (
            <button
              key={rating}
              className={`filter-btn ${filterRating === rating ? 'active' : ''}`}
              onClick={() => setFilterRating(rating)}
            >
              {rating} <i className="fas fa-star"></i>
            </button>
          ))}
        </div>

        <select className="sort-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="recent">Most Recent</option>
          <option value="helpful">Most Helpful</option>
          <option value="highest">Highest Rating</option>
          <option value="lowest">Lowest Rating</option>
        </select>
      </div>

      {/* Reviews List */}
      <div className="reviews-list">
        {loading ? (
          <div className="loading-reviews">Loading reviews...</div>
        ) : reviews.length === 0 ? (
          <div className="no-reviews">
            <i className="fas fa-comment-slash"></i>
            <p>No reviews yet. Be the first to review this product!</p>
          </div>
        ) : (
          reviews.map(review => (
            <div key={review.id} className="review-card">
              <div className="review-header">
                <div className="reviewer-info">
                  <div className="reviewer-avatar">
                    {review.user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <strong className="reviewer-name">{review.user?.name}</strong>
                    {review.isVerifiedPurchase && (
                      <span className="verified-badge">
                        <i className="fas fa-check-circle"></i>
                        Verified Purchase
                      </span>
                    )}
                  </div>
                </div>
                <div className="review-meta">
                  <div className="review-rating">
                    {[...Array(5)].map((_, i) => (
                      <i key={i} className={`fas fa-star ${i < review.rating ? 'filled' : ''}`}></i>
                    ))}
                  </div>
                  <span className="review-date">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {review.title && <h4 className="review-title">{review.title}</h4>}
              <p className="review-comment">{review.comment}</p>

              {review.images && review.images.length > 0 && (
                <div className="review-images">
                  {review.images.map((img, idx) => (
                    <img key={idx} src={img} alt={`Review ${idx + 1}`} />
                  ))}
                </div>
              )}

              <div className="review-actions">
                <button className="helpful-btn">
                  <i className="far fa-thumbs-up"></i>
                  Helpful ({review.helpfulCount || 0})
                </button>
              </div>

              {review.adminResponse && (
                <div className="admin-response">
                  <strong>Seller Response:</strong>
                  <p>{review.adminResponse}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="reviews-pagination">
          <button
            className="page-btn"
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
          >
            Previous
          </button>
          <span className="page-info">Page {page} of {totalPages}</span>
          <button
            className="page-btn"
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewsSection;
