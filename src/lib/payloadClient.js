// Payload CMS API Client for MilAssist Frontend
const PAYLOAD_API_URL = import.meta.env.VITE_PAYLOAD_API_URL || 'http://localhost:3000/api';

class PayloadClient {
  constructor() {
    this.baseURL = PAYLOAD_API_URL;
    this.token = localStorage.getItem('payload-token');
  }

  // Authentication methods
  async login(credentials) {
    try {
      const response = await fetch(`${this.baseURL}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (data.token) {
        this.token = data.token;
        localStorage.setItem('payload-token', data.token);
        localStorage.setItem('payload-user', JSON.stringify(data.user));
      }

      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async logout() {
    this.token = null;
    localStorage.removeItem('payload-token');
    localStorage.removeItem('payload-user');
  }

  async register(userData) {
    try {
      const response = await fetch(`${this.baseURL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      return await response.json();
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  // OAuth methods
  async loginWithGoogle() {
    window.location.href = `${this.baseURL}/oauth/google`;
  }

  async loginWithMicrosoft() {
    window.location.href = `${this.baseURL}/oauth/microsoft`;
  }

  // Generic API methods
  async request(endpoint, options = {}) {
    const url = endpoint.startsWith('http') ? endpoint : `${this.baseURL}${endpoint}`;

    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    if (this.token) {
      config.headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, config);

      if (response.status === 401) {
        // Token expired, logout
        this.logout();
        window.location.href = '/login';
        return;
      }

      return await response.json();
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  }

  // Collection methods
  async getCollection(collection, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/${collection}${queryString ? `?${queryString}` : ''}`;
    return this.request(endpoint);
  }

  async getDocument(collection, id) {
    return this.request(`/${collection}/${id}`);
  }

  async createDocument(collection, data) {
    return this.request(`/${collection}`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateDocument(collection, id, data) {
    return this.request(`/${collection}/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteDocument(collection, id) {
    return this.request(`/${collection}/${id}`, {
      method: 'DELETE',
    });
  }

  // AI methods
  async chatWithAI(message, context = {}) {
    return this.request('/ai/chat', {
      method: 'POST',
      body: JSON.stringify({
        message,
        context,
        conversationHistory: [], // TODO: Implement conversation history
      }),
    });
  }

  async analyzeText(text, analysisType = 'sentiment') {
    return this.request('/ai/analyze', {
      method: 'POST',
      body: JSON.stringify({
        text,
        analysisType,
      }),
    });
  }

  // File upload
  async uploadFile(file, collection = 'media') {
    const formData = new FormData();
    formData.append('file', file);

    return this.request(`/${collection}`, {
      method: 'POST',
      headers: {
        // Don't set Content-Type, let browser set it with boundary
        ...this.token && { Authorization: `Bearer ${this.token}` },
      },
      body: formData,
    });
  }

  // User methods
  getCurrentUser() {
    const user = localStorage.getItem('payload-user');
    return user ? JSON.parse(user) : null;
  }

  isAuthenticated() {
    return !!this.token;
  }

  hasRole(role) {
    const user = this.getCurrentUser();
    return user && user.role === role;
  }

  // Task methods
  async getTasks(filters = {}) {
    return this.getCollection('tasks', filters);
  }

  async createTask(taskData) {
    return this.createDocument('tasks', taskData);
  }

  async updateTask(id, updates) {
    return this.updateDocument('tasks', id, updates);
  }

  // Invoice methods
  async getInvoices(filters = {}) {
    return this.getCollection('invoices', filters);
  }

  async createInvoice(invoiceData) {
    return this.createDocument('invoices', invoiceData);
  }

  // Message methods
  async getMessages(filters = {}) {
    return this.getCollection('messages', filters);
  }

  async sendMessage(messageData) {
    return this.createDocument('messages', messageData);
  }

  // Document methods
  async getDocuments(filters = {}) {
    return this.getCollection('documents', filters);
  }

  async uploadDocument(file, metadata) {
    const uploadResult = await this.uploadFile(file, 'documents');
    if (metadata) {
      return this.updateDocument('documents', uploadResult.doc.id, metadata);
    }
    return uploadResult;
  }

  // Trip methods
  async getTrips(filters = {}) {
    return this.getCollection('trips', filters);
  }

  async createTrip(tripData) {
    return this.createDocument('trips', tripData);
  }

  // Settings
  async getSettings() {
    return this.getCollection('settings');
  }

  async updateSettings(updates) {
    const settings = await this.getSettings();
    if (settings.docs && settings.docs.length > 0) {
      return this.updateDocument('settings', settings.docs[0].id, updates);
    } else {
      return this.createDocument('settings', updates);
    }
  }
}

// Create singleton instance
const payloadClient = new PayloadClient();

export default payloadClient;
