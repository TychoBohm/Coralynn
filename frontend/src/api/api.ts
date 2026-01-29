// api.ts - backend api calls
const BASE_URL = 'http://localhost:8000';

// haal token uit localstorage
export function getToken(): string | null {
  return localStorage.getItem('token');
}

// sla token op
export function setToken(token: string) {
  localStorage.setItem('token', token);
}

// verwijder token (logout)
export function removeToken() {
  localStorage.removeItem('token');
}

// basis fetch functie
export async function fetchFromApi(endpoint: string, options: RequestInit = {}) {
  const token = getToken();
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  
  // voeg token toe als die er is
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    headers,
    ...options,
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || `API error: ${response.status}`);
  }
  
  return response.json();
}

// auth types
export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  phone_number?: string;
  address?: string;
}

export interface User {
  id: string;
  email: string;
  phone_number: string | null;
  address: string | null;
  created_at: string;
  updated_at: string | null;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

// login
export async function login(data: LoginData): Promise<TokenResponse> {
  const response = await fetchFromApi('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  // sla token op na login
  setToken(response.access_token);
  return response;
}

// registreer
export async function register(data: RegisterData): Promise<User> {
  return fetchFromApi('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// haal huidige user op
export async function getCurrentUser(): Promise<User> {
  return fetchFromApi('/api/auth/me');
}

// logout
export function logout() {
  removeToken();
}

// check of user ingelogd is
export function isLoggedIn(): boolean {
  return getToken() !== null;
}
