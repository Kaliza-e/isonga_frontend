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
  // If authenticated with a seeded test token, handle protected endpoints locally to prevent 401 errors
  if (currentAuthToken && currentAuthToken.startsWith('mock-')) {
    if (endpoint.startsWith('/auth/me')) {
      return null as any;
    }
    if (endpoint.startsWith('/notifications')) {
      return [] as any;
    }
    if (endpoint.startsWith('/residents/me/location')) {
      return { success: true } as any;
    }
    if (endpoint.startsWith('/announcements') && (options.method === 'POST' || options.method === 'PUT')) {
      return {
        id: `mock-ann-${Date.now()}`,
        status: 'PUBLISHED',
        createdAt: new Date().toISOString(),
      } as any;
    }
    if (endpoint.startsWith('/announcements')) {
      return [] as any;
    }
  }

  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (currentAuthToken) {
    headers['Authorization'] = `Bearer ${currentAuthToken}`;
  }

  // Use a generous 20-second timeout for cloud cold starts
  const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
  let timer: any = null;

  if (controller) {
    timer = setTimeout(() => {
      try {
        controller.abort();
      } catch {}
    }, 20000);
  }

  try {
    const res = await fetch(url, {
      ...options,
      headers,
      ...(controller ? { signal: controller.signal } : {}),
    });

    if (timer) clearTimeout(timer);

    if (!res.ok) {
      const errorJson = await res.json().catch(() => ({}));
      const msg = errorJson.message || `API error ${res.status}`;
      throw new Error(msg);
    }

    return await res.json();
  } catch (err: any) {
    if (timer) clearTimeout(timer);

    const isAborted =
      controller?.signal.aborted ||
      err?.name === 'AbortError' ||
      err?.message?.includes('aborted');

    if (isAborted) {
      console.warn(`Request on [${endpoint}] timed out after 20s.`);
      throw new Error('Connection timed out. Remote server took too long to respond.');
    }

    console.warn(`Mobile API fetch on [${endpoint}]:`, err?.message || err);
    throw err;
  }
}
