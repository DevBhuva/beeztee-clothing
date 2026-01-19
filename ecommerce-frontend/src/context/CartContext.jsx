import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [cartSummary, setCartSummary] = useState({
    subtotal: 0,
    tax: 0,
    grandTotal: 0,
    totalQuantity: 0
  });

  const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

  // Get auth token from localStorage
  const getAuthHeaders = () => {
    const token = localStorage.getItem('authToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // Fetch cart from backend
  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      const headers = getAuthHeaders();
      
      if (!headers.Authorization) {
        // User not logged in
        setCartItems([]);
        setCartCount(0);
        setCartSummary({ subtotal: 0, tax: 0, grandTotal: 0, totalQuantity: 0 });
        return;
      }

      const response = await axios.get(`${API_URL}/cart`, { headers });
      
      if (response.data.status) {
        setCartItems(response.data.data.items);
        setCartSummary(response.data.data.summary);
        setCartCount(response.data.data.items.length);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      if (error.response?.status !== 401) {
        toast.error('Failed to load cart');
      }
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  // Add item to cart
  const addToCart = async (productId, quantity = 1, variantId = null, size = null, color = null) => {
    try {
      setLoading(true);
      const headers = getAuthHeaders();

      if (!headers.Authorization) {
        toast.error('Please login to add items to cart');
        return false;
      }

      const response = await axios.post(
        `${API_URL}/cart/add`,
        { productId, quantity, variantId, size, color },
        { headers }
      );

      if (response.data.status) {
        toast.success(response.data.message);
        await fetchCart(); // Refresh cart
        return true;
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      const message = error.response?.data?.message || 'Failed to add item to cart';
      toast.error(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Update cart item quantity
  const updateCartItem = async (cartItemId, quantity) => {
    if (quantity < 1) {
      toast.error('Quantity must be at least 1');
      return false;
    }

    try {
      setLoading(true);
      const headers = getAuthHeaders();

      const response = await axios.put(
        `${API_URL}/cart/update/${cartItemId}`,
        { quantity },
        { headers }
      );

      if (response.data.status) {
        toast.success(response.data.message);
        await fetchCart(); // Refresh cart
        return true;
      }
    } catch (error) {
      console.error('Error updating cart:', error);
      const message = error.response?.data?.message || 'Failed to update cart';
      toast.error(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Remove item from cart
  const removeFromCart = async (cartItemId) => {
    try {
      setLoading(true);
      const headers = getAuthHeaders();

      const response = await axios.delete(
        `${API_URL}/cart/remove/${cartItemId}`,
        { headers }
      );

      if (response.data.status) {
        toast.success(response.data.message);
        await fetchCart(); // Refresh cart
        return true;
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
      const message = error.response?.data?.message || 'Failed to remove item';
      toast.error(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Clear entire cart
  const clearCart = async () => {
    try {
      setLoading(true);
      const headers = getAuthHeaders();

      const response = await axios.delete(`${API_URL}/cart/clear`, { headers });

      if (response.data.status) {
        toast.success(response.data.message);
        setCartItems([]);
        setCartCount(0);
        setCartSummary({ subtotal: 0, tax: 0, grandTotal: 0, totalQuantity: 0 });
        return true;
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast.error('Failed to clear cart');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Fetch cart count
  const fetchCartCount = async () => {
    try {
      const headers = getAuthHeaders();
      
      if (!headers.Authorization) {
        setCartCount(0);
        return;
      }

      const response = await axios.get(`${API_URL}/cart/count`, { headers });
      
      if (response.data.status) {
        setCartCount(response.data.data.count);
      }
    } catch (error) {
      console.error('Error fetching cart count:', error);
    }
  };

  // Load cart on mount and when auth changes
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      fetchCart();
    }
  }, [fetchCart]);

  const value = {
    cartItems,
    loading,
    cartCount,
    cartSummary,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    fetchCart,
    fetchCartCount
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export default CartContext;
