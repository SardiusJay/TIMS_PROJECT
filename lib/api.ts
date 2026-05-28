import axios, { AxiosInstance, AxiosError } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === 'true' || !process.env.NEXT_PUBLIC_API_URL;

interface StoredTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

class APIClient {
  private client: AxiosInstance;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private tokenExpiresAt: number = 0;
  private isRefreshing: boolean = false;
  private failedQueue: Array<{
    resolve: (value: any) => void;
    reject: (reason?: any) => void;
  }> = [];

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Interceptor to inject token
    this.client.interceptors.request.use((config) => {
      if (this.accessToken) {
        config.headers.Authorization = `Bearer ${this.accessToken}`;
      }
      return config;
    });

    // Interceptor to handle 401 and refresh
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          return this.handle401(error);
        }
        return Promise.reject(error);
      }
    );

    this.loadTokensFromStorage();
  }

  private loadTokensFromStorage(): void {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('tims_tokens');
        if (stored) {
          const tokens: StoredTokens = JSON.parse(stored);
          this.accessToken = tokens.accessToken;
          this.refreshToken = tokens.refreshToken;
          this.tokenExpiresAt = tokens.expiresAt;

          // Check if token is expired
          if (this.tokenExpiresAt < Date.now()) {
            this.clearTokens();
          }
        }
      } catch (e) {
        console.error('[v0] Failed to load tokens from storage:', e);
        this.clearTokens();
      }
    }
  }

  private saveTokensToStorage(): void {
    if (typeof window !== 'undefined' && this.accessToken && this.refreshToken) {
      try {
        const tokens: StoredTokens = {
          accessToken: this.accessToken,
          refreshToken: this.refreshToken,
          expiresAt: this.tokenExpiresAt,
        };
        localStorage.setItem('tims_tokens', JSON.stringify(tokens));
      } catch (e) {
        console.error('[v0] Failed to save tokens to storage:', e);
      }
    }
  }

  private async handle401(error: AxiosError): Promise<any> {
    const originalRequest = error.config as any;

    if (this.isRefreshing) {
      return new Promise((resolve, reject) => {
        this.failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return this.client(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    this.isRefreshing = true;

    try {
      if (!this.refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
        refreshToken: this.refreshToken,
      });

      const { accessToken, refreshToken } = response.data;

      this.setTokens(accessToken, refreshToken);
      this.processQueue(null, accessToken);

      originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      return this.client(originalRequest);
    } catch (err) {
      this.processQueue(err, null);
      this.clearTokens();
      return Promise.reject(err);
    } finally {
      this.isRefreshing = false;
    }
  }

  private processQueue(error: any, token: string | null): void {
    this.failedQueue.forEach((prom) => {
      if (error) {
        prom.reject(error);
      } else {
        prom.resolve(token);
      }
    });
    this.failedQueue = [];
  }

  setTokens(accessToken: string, refreshToken: string): void {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    // Assume 15-min expiry for access token
    this.tokenExpiresAt = Date.now() + 15 * 60 * 1000;
    this.saveTokensToStorage();
  }

  clearTokens(): void {
    this.accessToken = null;
    this.refreshToken = null;
    this.tokenExpiresAt = 0;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('tims_tokens');
    }
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  isAuthenticated(): boolean {
    return !!this.accessToken && this.tokenExpiresAt > Date.now();
  }

  async get<T>(url: string, config?: any): Promise<T> {
    // Handle demo mode for auth/me endpoint
    if (DEMO_MODE && url === '/auth/me') {
      return this.getCurrentDemoUser() as Promise<T>;
    }
    
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  private getCurrentDemoUser(): any {
    // Return the user from the stored token if available
    if (typeof window !== 'undefined' && this.accessToken?.includes('demo-access')) {
      return {
        id: '1',
        email: 'admin@example.com',
        name: 'Admin User',
        role: 'admin',
        phone: '+1-555-0100',
        createdAt: new Date().toISOString(),
      };
    }
    throw { response: { status: 401, data: { message: 'Not authenticated' } } };
  }

  async post<T>(url: string, data?: any, config?: any): Promise<T> {
    // Handle demo mode for auth endpoints
    if (DEMO_MODE && url === '/auth/login') {
      return await this.handleDemoLogin(data) as Promise<T>;
    }
    
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  private async handleDemoLogin(credentials: any): Promise<any> {
    // Demo users for testing
    const demoUsers: Record<string, { password: string; user: any }> = {
      'admin@example.com': {
        password: 'password123',
        user: {
          id: '1',
          email: 'admin@example.com',
          name: 'Admin User',
          role: 'admin',
          phone: '+1-555-0100',
          createdAt: new Date().toISOString(),
        },
      },
      'supervisor@example.com': {
        password: 'password123',
        user: {
          id: '2',
          email: 'supervisor@example.com',
          name: 'Site Supervisor',
          role: 'supervisor',
          phone: '+1-555-0101',
          createdAt: new Date().toISOString(),
        },
      },
      'engineer@example.com': {
        password: 'password123',
        user: {
          id: '3',
          email: 'engineer@example.com',
          name: 'Field Engineer',
          role: 'engineer',
          phone: '+1-555-0102',
          createdAt: new Date().toISOString(),
        },
      },
    };

    const account = demoUsers[credentials.email];
    if (!account || account.password !== credentials.password) {
      throw {
        response: {
          status: 401,
          data: { message: 'Invalid email or password' },
        },
      };
    }

    return {
      accessToken: `demo-access-${Date.now()}`,
      refreshToken: `demo-refresh-${Date.now()}`,
      user: account.user,
    };
  }

  async put<T>(url: string, data?: any, config?: any): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  async patch<T>(url: string, data?: any, config?: any): Promise<T> {
    const response = await this.client.patch<T>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: any): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }
}

export const apiClient = new APIClient();
