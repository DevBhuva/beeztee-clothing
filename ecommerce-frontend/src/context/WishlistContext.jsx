import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);

  const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

  // Get auth token from localStorage
  const getAuthHeaders = () => {
    const token = localStorage.getItem('authToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // Fetch wishlist from backend
  const fetchWishlist = useCallback(async () => {
    try {
      setLoading(true);
      const headers = getAuthHeaders();
      
      if (!headers.Authorization) {
        // User not logged in
        setWishlistItems([]);
        setWishlistCount(0);
        return;
      }

      const response = await axios.get(`${API_URL}/wishlist`, { headers });
      
      if (response.data.status) {
        setWishlistItems(response.data.data.items);
        setWishlistCount(response.data.data.count);
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      if (error.response?.status !== 401) {
        toast.error('Failed to load wishlist');
      }
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  // Check if product is in wishlist
  const isInWishlist = (productId) => {
    return wishlistItems.some(item => item.productId === productId);
  };

  // Get wishlist item by product ID
  const getWishlistItem = (productId) => {
    return wishlistItems.find(item => item.productId === productId);
  };

  // Add item to wishlist
  const addToWishlist = async (productId) => {
    try {
      setLoading(true);
      const headers = getAuthHeaders();

      if (!headers.Authorization) {
        toast.error('Please login to add items to wishlist');
        return false;
      }

      const response = await axios.post(
        `${API_URL}/wishlist/add`,
        { productId },
        { headers }
      );

      if (response.data.status) {
        toast.success(response.data.message);
        await fetchWishlist(); // Refresh wishlist
        return true;
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      const message = error.response?.data?.message || 'Failed to add item to wishlist';
      toast.error(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Remove item from wishlist by ID
  const removeFromWishlist = async (wishlistItemId) => {
    try {
      setLoading(true);
      const headers = getAuthHeaders();

      const response = await axios.delete(
        `${API_URL}/wishlist/remove/${wishlistItemId}`,
        { headers }
      );

      if (response.data.status) {
        toast.success(response.data.message);
        await fetchWishlist(); // Refresh wishlist
        return true;
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      const message = error.response?.data?.message || 'Failed to remove item';
      toast.error(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Remove item from wishlist by product ID
  const removeFromWishlistByProductId = async (productId) => {
    try {
      setLoading(true);
      const headers = getAuthHeaders();

      const response = await axios.delete(
        `${API_URL}/wishlist/remove-product/${productId}`,
        { headers }
      );

      if (response.data.status) {
        toast.success(response.data.message);
        await fetchWishlist(); // Refresh wishlist
        return true;
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      const message = error.response?.data?.message || 'Failed to remove item';
      toast.error(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Toggle wishlist (add if not exists, remove if exists)
  const toggleWishlist = async (productId) => {
    const existingItem = getWishlistItem(productId);
    
    if (existingItem) {
      return await removeFromWishlist(existingItem.id);
    } else {
      return await addToWishlist(productId);
    }
  };

  // Move item from wishlist to cart
  const moveToCart = async (wishlistItemId, quantity = 1, variantId = null, size = null, color = null) => {
    try {
      setLoading(true);
      const headers = getAuthHeaders();

      const response = await axios.post(
        `${API_URL}/wishlist/move-to-cart/${wishlistItemId}`,
        { quantity, variantId, size, color },
        { headers }
      );

      if (response.data.status) {
        toast.success(response.data.message);
        await fetchWishlist(); // Refresh wishlist
        return true;
      }
    } catch (error) {
      console.error('Error moving to cart:', error);
      const message = error.response?.data?.message || 'Failed to move item to cart';
      toast.error(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Clear entire wishlist
  const clearWishlist = async () => {
    try {
      setLoading(true);
      const headers = getAuthHeaders();

      const response = await axios.delete(`${API_URL}/wishlist/clear`, { headers });

      if (response.data.status) {
        toast.success(response.data.message);
        setWishlistItems([]);
        setWishlistCount(0);
        return true;
      }
    } catch (error) {
      console.error('Error clearing wishlist:', error);
      toast.error('Failed to clear wishlist');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Fetch wishlist count
  const fetchWishlistCount = async () => {
    try {
      const headers = getAuthHeaders();
      
      if (!headers.Authorization) {
        setWishlistCount(0);
        return;
      }

      const response = await axios.get(`${API_URL}/wishlist/count`, { headers });
      
      if (response.data.status) {
        setWishlistCount(response.data.data.count);
      }
    } catch (error) {
      console.error('Error fetching wishlist count:', error);
    }
  };

  // Load wishlist on mount and when auth changes
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      fetchWishlist();
    }
  }, [fetchWishlist]);

  const value = {
    wishlistItems,
    loading,
    wishlistCount,
    isInWishlist,
    getWishlistItem,
    addToWishlist,
    removeFromWishlist,
    removeFromWishlistByProductId,
    toggleWishlist,
    moveToCart,
    clearWishlist,
    fetchWishlist,
    fetchWishlistCount
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

export default WishlistContext;
