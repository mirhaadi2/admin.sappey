/**
 * Admin Auth Service
 * Manages independent authentication for Admin Portal
 * Uses session-based authentication (HttpOnly cookies)
 */

import { apiMethods } from '../api/index';

const USER_KEY = 'ADMIN_user';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN';
}

export interface LoginCredentials {
  email: string;
  password: string;
}

class AdminAuthService {
  /**
   * Login - Session-based authentication
   * Sessions are HttpOnly secure cookies managed by the server
   */
  async login(credentials: LoginCredentials): Promise<{ user: AuthUser }> {
    const response = await apiMethods.post('/auth/login', {
      ...credentials,
    });

    const { user } = response.data.data;

    // Session cookie is set automatically by the server
    this.setUser(user);

    return { user };
  }

  /**
   * Logout - Destroys server session
   */
  async logout(): Promise<void> {
    try {
      // Notify backend to destroy session
      await apiMethods.post('/auth/logout', {});
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      // Clear user data from localStorage
      this.clearUser();
    }
  }

  /**
   * Get current user - Queries backend for authenticated user info
   * Handles 401 gracefully (user not authenticated)
   */
  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const response = await apiMethods.get('/auth/me');
      const user = response.data.data;
      this.setUser(user);
      return user;
    } catch (error: any) {
      // 401 is normal when user is not authenticated - don't treat as error
      if (error.response?.status === 401) {
        this.clearUser();
        return null;
      }
      // Other errors should be re-thrown
      throw error;
    }
  }

  /**
   * Store user data
   */
  private setUser(user: AuthUser): void {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  /**
   * Get stored user
   */
  getUser(): AuthUser | null {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  /**
   * Clear user data
   */
  private clearUser(): void {
    localStorage.removeItem(USER_KEY);
  }

  /**
   * Check if user is authenticated
   * With session-based auth, session validity is checked by attempting to read it
   */
  isAuthenticated(): boolean {
    // User is authenticated if we have cached user data
    // Session validation happens automatically via 401 responses
    return !!this.getUser();
  }
}

export const adminAuthService = new AdminAuthService();
