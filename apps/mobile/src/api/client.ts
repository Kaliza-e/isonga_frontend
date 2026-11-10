import { Platform } from 'react-native';
import Constants from 'expo-constants';

declare const process: { env: Record<string, string | undefined> };

function resolveApiBaseUrl(): string {
  if (process.env.EXPO_PUBLIC_API_URL) {
    const raw = process.env.EXPO_PUBLIC_API_URL.trim().replace(/\/+$/, '');
    return raw.endsWith('/api/v1') ? raw : `${raw}/api/v1`;
  }

  // When running on physical phone or emulator via Expo Go, hostUri contains the dev machine IP
  const hostUri = Constants.expoConfig?.hostUri || (Constants as any).manifest?.debuggerHost;
  if (hostUri && Platform.OS !== 'web') {
    const devHost = hostUri.split(':')[0];
    if (devHost && devHost !== 'localhost' && devHost !== '127.0.0.1') {
      return `http://${devHost}:3000/api/v1`;
    }
  }

  return Platform.OS === 'android'
    ? 'http://10.0.2.2:3000/api/v1'
    : 'http://localhost:3000/api/v1';
}

export const API_BASE_URL = resolveApiBaseUrl();

let currentAuthToken: string | null = null;

export function setMobileAuthToken(token: string | null) {
  currentAuthToken = token;
}

export function getMobileAuthToken() {
  return currentAuthToken;
}

export async function mobileApiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (currentAuthToken) {
    headers['Authorization'] = `Bearer ${currentAuthToken}`;
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!res.ok) {
      const errorJson = await res.json().catch(() => ({}));
      throw new Error(errorJson.message || `API error ${res.status}`);
    }

    return await res.json();
  } catch (err: any) {
    console.warn(`Mobile API fetch warning on [${endpoint}]:`, err?.message || err);
    throw err;
  }
}

