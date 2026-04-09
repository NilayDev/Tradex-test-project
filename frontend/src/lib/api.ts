const API_BASE_URL = 'http://localhost:3001/api';

export const api = {
  // Strategies
  async getAllStrategies() {
    const response = await fetch(`${API_BASE_URL}/strategies`);
    if (!response.ok) throw new Error('Failed to fetch strategies');
    return response.json();
  },

  async getStrategyById(id: number) {
    const response = await fetch(`${API_BASE_URL}/strategies/${id}`);
    if (!response.ok) throw new Error('Failed to fetch strategy');
    return response.json();
  },

  async createStrategy(strategy: any) {
    const response = await fetch(`${API_BASE_URL}/strategies`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(strategy),
    });
    if (!response.ok) throw new Error('Failed to create strategy');
    return response.json();
  },

  // Auth
  async signup(data: { name: string; email: string; password: string }) {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Signup failed');
    }
    return response.json();
  },

  async login(data: { email: string; password: string }) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }
    return response.json();
  },

  async getProfile(token: string) {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to fetch profile');
    return response.json();
  },

  // Discussions
  async getAllDiscussions(token: string) {
    const response = await fetch(`${API_BASE_URL}/discussions`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to fetch discussions');
    return response.json();
  },

  async createDiscussion(token: string, data: any) {
    const response = await fetch(`${API_BASE_URL}/discussions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create discussion');
    return response.json();
  },
};
