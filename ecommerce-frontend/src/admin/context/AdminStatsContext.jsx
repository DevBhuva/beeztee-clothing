import React, { createContext, useContext, useState, useEffect } from 'react';
import { getDashboardStats, getQuickStats } from '../../services/adminService';

/**
 * Admin Stats Context
 * 
 * Provides dynamic statistics for the admin sidebar badges.
 * Fetches real data from the backend API.
 * 
 * Usage in components:
 * ```
 * import { useAdminStats } from './context/AdminStatsContext';
 * 
 * const MyComponent = () => {
 *   const { stats, updateStats, loading, error, refreshStats } = useAdminStats();
 *   
 *   // Read stats
 *   console.log(stats.totalProducts);
 *   
 *   // Manually refresh stats
 *   refreshStats();
 *   
 *   // Update stats locally (will be overwritten on next refresh)
 *   updateStats({ totalProducts: 350, newMessages: 7 });
 * };
 * ```
 */

const AdminStatsContext = createContext();

export const useAdminStats = () => {
  const context = useContext(AdminStatsContext);
  if (!context) {
    throw new Error('useAdminStats must be used within AdminStatsProvider');
  }
  return context;
};

export function AdminStatsProvider({ children }) {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    newMessages: 0,
    newFeedback: 0,
    totalCustomers: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch full dashboard stats
  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getDashboardStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (err) {
      console.error('Failed to fetch admin stats:', err);
      setError(err.message || 'Failed to load statistics');
      // Keep default values on error
    } finally {
      setLoading(false);
    }
  };

  // Fetch quick stats (lighter weight for frequent updates)
  const fetchQuickStats = async () => {
    try {
      const response = await getQuickStats();
      if (response.success) {
        setStats(prev => ({ ...prev, ...response.data }));
      }
    } catch (err) {
      console.error('Failed to fetch quick stats:', err);
    }
  };

  // Manual update function (for local updates)
  const updateStats = (newStats) => {
    setStats(prev => ({ ...prev, ...newStats }));
  };

  // Manual refresh function
  const refreshStats = () => {
    fetchStats();
  };

  // Initial fetch on mount
  useEffect(() => {
    fetchStats();
  }, []);

  // Auto-refresh quick stats every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchQuickStats();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <AdminStatsContext.Provider value={{ stats, updateStats, refreshStats, loading, error }}>
      {children}
    </AdminStatsContext.Provider>
  );
}
