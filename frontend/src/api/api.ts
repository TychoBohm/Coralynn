// api.ts - centrale plek voor backend API-aanroepen
// Pas BASE_URL aan naar jouw backend endpoint
const BASE_URL = 'http://localhost:8000';

export async function fetchFromApi(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  return response.json();
}

// Voorbeeld: ophalen van producten
export async function getProducts() {
  return fetchFromApi('/products');
}

// Voorbeeld: inloggen
export async function login(data: { username: string; password: string }) {
  return fetchFromApi('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
