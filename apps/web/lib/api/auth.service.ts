import { apiClient } from './client';
import { UserProfile } from '../types';

export interface LoginResponse {
  accessToken: string;
  user: UserProfile;
}

export interface RegisterDto {
  phone: string;
  password: string;
  email?: string;
  firstName: string;
  lastName: string;
  role?: string;
  villageId?: string;
}

export interface VerifyOtpDto {
  phone: string;
  otp: string;
}

export interface ResetPasswordDto {
  phone: string;
  otp: string;
  newPassword: string;
}

export const authService = {
  async login(identifier: string, password: string): Promise<LoginResponse> {
    const res = await apiClient<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ identifier, phone: identifier, password }),
    });
    if (res?.accessToken && typeof window !== 'undefined') {
      localStorage.setItem('isonga_token', res.accessToken);
    }
    return res;
  },

  async register(data: RegisterDto): Promise<UserProfile> {
    return apiClient<UserProfile>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async requestOtp(phone: string): Promise<{ message: string }> {
    return apiClient<{ message: string }>('/auth/request-otp', {
      method: 'POST',
      body: JSON.stringify({ phone }),
    });
  },

  async verifyOtp(data: VerifyOtpDto): Promise<{ verified: boolean; message: string }> {
    return apiClient<{ verified: boolean; message: string }>('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async resetPassword(data: ResetPasswordDto): Promise<{ message: string }> {
    return apiClient<{ message: string }>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async getMe(): Promise<UserProfile> {
    return apiClient<UserProfile>('/auth/me');
  },

  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('isonga_token');
      localStorage.removeItem('isonga_user');
    }
  },
};

