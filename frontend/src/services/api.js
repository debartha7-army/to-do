// Same-origin API calls work on Render, while Vite proxies them to the local
// Express server during development. VITE_API_URL remains available for a
// deliberately separate API deployment.
const API_BASE = import.meta.env.VITE_API_URL || '/api';

const getHeaders = () => {
  const token = localStorage.getItem('orbit_notes_token');
  const headers = {
    'Content-Type': 'application/json'
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const handleResponse = async (response) => {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || `HTTP error ${response.status}`);
  }
  return data;
};

export const api = {
  // Auth
  async signup(email, password, displayName) {
    const res = await fetch(`${API_BASE}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, displayName })
    });
    return handleResponse(res);
  },

  async login(email, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return handleResponse(res);
  },

  async getMe() {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  // Events
  async getEvents() {
    const res = await fetch(`${API_BASE}/events`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  async createEvent(eventData) {
    const res = await fetch(`${API_BASE}/events`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(eventData)
    });
    return handleResponse(res);
  },

  // Discoveries
  async getDiscoveries(params = {}) {
    const query = new URLSearchParams();
    if (params.category && params.category !== 'All') query.append('category', params.category);
    if (params.search) query.append('search', params.search);
    if (params.source && params.source !== 'All') query.append('source', params.source);

    const queryString = query.toString() ? `?${query.toString()}` : '';
    const res = await fetch(`${API_BASE}/discoveries${queryString}`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  async createDiscovery(discoveryData) {
    const res = await fetch(`${API_BASE}/discoveries`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(discoveryData)
    });
    return handleResponse(res);
  },

  async syncFeeds() {
    const res = await fetch(`${API_BASE}/discoveries/sync`, {
      method: 'POST',
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  // Social Media Streams
  async getSocialChannels() {
    const res = await fetch(`${API_BASE}/social/channels`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  async syncSocialFeeds() {
    const res = await fetch(`${API_BASE}/social/sync`, {
      method: 'POST',
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  // Reports
  async getReports() {
    const res = await fetch(`${API_BASE}/reports`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  async createReport(reportData) {
    const res = await fetch(`${API_BASE}/reports`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(reportData)
    });
    return handleResponse(res);
  },

  async generateTodayReport() {
    const res = await fetch(`${API_BASE}/reports/generate-today`, {
      method: 'POST',
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  // Unified Delete Route: DELETE /api/:kind/:id
  async deleteItem(kind, id) {
    const res = await fetch(`${API_BASE}/${kind}/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  // Health
  async getHealth() {
    const res = await fetch(`${API_BASE}/health`);
    return handleResponse(res);
  }
};
