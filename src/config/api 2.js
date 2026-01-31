/**
 * API Configuration
 * Centralized API URL management with environment variable support
 */

// Get API URL from environment or default to localhost
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Feature flags
export const FEATURES = {
  PAYMENTS: import.meta.env.VITE_ENABLE_PAYMENTS === 'true',
  DOCUMENTS: import.meta.env.VITE_ENABLE_DOCUMENTS === 'true',
  EMAIL_INTEGRATION: import.meta.env.VITE_ENABLE_EMAIL_INTEGRATION === 'true',
  VIDEO_INTEGRATION: import.meta.env.VITE_ENABLE_VIDEO_INTEGRATION === 'true',
  CALENDAR_INTEGRATION: import.meta.env.VITE_ENABLE_CALENDAR_INTEGRATION === 'true',
  TRAVEL: import.meta.env.VITE_ENABLE_TRAVEL === 'true',
};

// API helper function
export const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_URL}${endpoint}`;
  const token = localStorage.getItem('token');
  
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`API request failed: ${endpoint}`, error);
    throw error;
  }
};

export default API_URL;
