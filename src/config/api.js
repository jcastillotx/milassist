/**
 * API configuration
 * Returns the API base URL from environment variables or defaults to localhost
 */
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
