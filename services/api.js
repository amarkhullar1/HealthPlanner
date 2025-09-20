import { auth } from '../firebase';

const API_BASE_URL = 'http://localhost:8000'; // Change this to your deployed URL

class ApiService {
  async getAuthHeaders() {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('No authenticated user');
    }
    
    const token = await user.getIdToken();
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  async makeRequest(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = await this.getAuthHeaders();
    
    const config = {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.detail || 'API request failed');
      }
      
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Verify token with backend
  async verifyToken() {
    return this.makeRequest('/verify-token', {
      method: 'POST',
    });
  }

  // Save health data
  async saveHealthData(healthData) {
    return this.makeRequest('/health-data', {
      method: 'POST',
      body: JSON.stringify(healthData),
    });
  }

  // Get health data
  async getHealthData() {
    return this.makeRequest('/health-data', {
      method: 'GET',
    });
  }

  // Save user profile
  async saveUserProfile(profileData) {
    return this.makeRequest('/user-profile', {
      method: 'POST',
      body: JSON.stringify(profileData),
    });
  }

  // Get user profile
  async getUserProfile() {
    return this.makeRequest('/user-profile', {
      method: 'GET',
    });
  }

  // Health check
  async healthCheck() {
    return this.makeRequest('/health', {
      method: 'GET',
    });
  }
}

export default new ApiService();
