/**
 * API Service - Conecta con el backend NestJS
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

interface ApiConfig {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'PUT';
  headers?: Record<string, string>;
  body?: any;
  token?: string;
}

class ApiService {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('api_token', token);
  }

  getToken(): string | null {
    return this.token || localStorage.getItem('api_token');
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('api_token');
  }

  private async request(
    endpoint: string,
    config: ApiConfig = {}
  ): Promise<any> {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...config.headers,
    };

    const token = config.token || this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const options: RequestInit = {
      method: config.method || 'GET',
      headers,
    };

    if (config.body) {
      options.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, options);

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `HTTP Error ${response.status}`);
      }

      if (response.status === 204) {
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error(`API Error [${config.method || 'GET'} ${endpoint}]:`, error);
      throw error;
    }
  }

  // Auth endpoints
  async login(email: string, password: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: { email, password },
    });
  }

  async register(email: string, password: string, firstName: string, lastName: string) {
    return this.request('/auth/register', {
      method: 'POST',
      body: { email, password, firstName, lastName },
    });
  }

  async getProfile() {
    return this.request('/auth/profile');
  }

  async getCaptcha() {
    return this.request('/auth/captcha');
  }

  // Destinations endpoints
  async getDestinations() {
    return this.request('/destinations');
  }

  async getDestinationById(id: string) {
    return this.request(`/destinations/${id}`);
  }

  async createDestination(destData: any) {
    return this.request('/destinations', {
      method: 'POST',
      body: destData,
    });
  }

  async updateDestination(id: string, destData: any) {
    return this.request(`/destinations/${id}`, {
      method: 'PATCH',
      body: destData,
    });
  }

  async deleteDestination(id: string) {
    return this.request(`/destinations/${id}`, {
      method: 'DELETE',
    });
  }

  async restoreDestination(id: string) {
    return this.request(`/destinations/${id}/restore`, {
      method: 'PATCH',
      body: {},
    });
  }

  // Providers endpoints
  async getProviders() {
    return this.request('/providers');
  }

  async getProviderById(id: string) {
    return this.request(`/providers/${id}`);
  }

  async createProvider(provData: any) {
    return this.request('/providers', {
      method: 'POST',
      body: provData,
    });
  }

  async updateProvider(id: string, provData: any) {
    return this.request(`/providers/${id}`, {
      method: 'PATCH',
      body: provData,
    });
  }

  async deleteProvider(id: string) {
    return this.request(`/providers/${id}`, {
      method: 'DELETE',
    });
  }

  // Bookings endpoints
  async getBookings() {
    return this.request('/bookings');
  }

  async getBookingById(id: string) {
    return this.request(`/bookings/${id}`);
  }

  async createBooking(bookingData: any) {
    return this.request('/bookings', {
      method: 'POST',
      body: bookingData,
    });
  }

  async updateBooking(id: string, bookingData: any) {
    return this.request(`/bookings/${id}`, {
      method: 'PATCH',
      body: bookingData,
    });
  }

  async deleteBooking(id: string) {
    return this.request(`/bookings/${id}`, {
      method: 'DELETE',
    });
  }

  async confirmBooking(id: string) {
    return this.request(`/bookings/${id}/confirm`, {
      method: 'POST',
      body: {},
    });
  }

  // Reports endpoints
  async getStatistics() {
    return this.request('/reports/statistics');
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }
}

export const apiService = new ApiService();
