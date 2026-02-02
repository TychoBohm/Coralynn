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
  name?: string;
}

export interface User {
  id: string;
  email: string;
  phone_number: string | null;
  name: string | null;
  is_superuser: boolean;
  shipping_city: string | null;
  shipping_street: string | null;
  shipping_postal_code: string | null;
  created_at: string;
  updated_at: string | null;
}

export interface UserUpdateData {
  phone_number?: string | null;
  name?: string | null;
  shipping_city?: string | null;
  shipping_street?: string | null;
  shipping_postal_code?: string | null;
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

// update user profiel
export async function updateUser(data: UserUpdateData): Promise<User> {
  return fetchFromApi('/api/auth/me', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

// logout
export function logout() {
  removeToken();
}

// check of user ingelogd is
export function isLoggedIn(): boolean {
  return getToken() !== null;
}

// product types
export interface ProductImage {
  id: string;
  image_url: string;
  sort_order: number;
}

export interface Product {
  id: string;
  title: string;
  description: string | null;
  price: number;
  created_at: string;
  updated_at: string | null;
  images: ProductImage[];
}

// haal alle producten op
export async function getProducts(): Promise<Product[]> {
  return fetchFromApi('/api/products');
}

// haal 1 product op
export async function getProduct(id: string): Promise<Product> {
  return fetchFromApi(`/api/products/${id}`);
}

// maak nieuw product (alleen superuser)
export interface ProductCreate {
  title: string;
  description?: string;
  price: number;
  images?: string[];
}

export async function createProduct(data: ProductCreate): Promise<Product> {
  return fetchFromApi('/api/products', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// update product (alleen superuser)
export interface ProductUpdate {
  title?: string;
  description?: string;
  price?: number;
}

export async function updateProduct(id: string, data: ProductUpdate): Promise<Product> {
  return fetchFromApi(`/api/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

// verwijder product (alleen superuser)
export async function deleteProduct(id: string): Promise<void> {
  return fetchFromApi(`/api/products/${id}`, {
    method: 'DELETE',
  });
}

// voeg image toe aan product (alleen superuser)
export async function addProductImage(productId: string, imageUrl: string, sortOrder: number = 0): Promise<ProductImage> {
  return fetchFromApi(`/api/products/${productId}/images`, {
    method: 'POST',
    body: JSON.stringify({ image_url: imageUrl, sort_order: sortOrder }),
  });
}

// verwijder image van product (alleen superuser)
export async function deleteProductImage(productId: string, imageId: string): Promise<void> {
  return fetchFromApi(`/api/products/${productId}/images/${imageId}`, {
    method: 'DELETE',
  });
}

// herorden producten (alleen superuser)
export async function reorderProducts(productIds: string[]): Promise<{ message: string }> {
  return fetchFromApi('/api/products/reorder', {
    method: 'PUT',
    body: JSON.stringify({ ids: productIds }),
  });
}

// herorden afbeeldingen van product (alleen superuser)
export async function reorderProductImages(productId: string, imageIds: string[]): Promise<{ message: string }> {
  return fetchFromApi(`/api/products/${productId}/images/reorder`, {
    method: 'PUT',
    body: JSON.stringify({ ids: imageIds }),
  });
}

// upload afbeelding
export async function uploadImage(file: File): Promise<{ filename: string; url: string }> {
  const token = getToken();
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${BASE_URL}/api/uploads`, {
    method: 'POST',
    headers: token ? { 'Authorization': `Bearer ${token}` } : {},
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || `Upload error: ${response.status}`);
  }

  return response.json();
}

// ============ WISHLIST FUNCTIES ============

// haal wishlist op (producten)
export async function getWishlist(): Promise<Product[]> {
  return fetchFromApi('/api/wishlist');
}

// haal alle product ids in wishlist op
export async function getWishlistIds(): Promise<string[]> {
  return fetchFromApi('/api/wishlist/ids');
}

// voeg product toe aan wishlist
export async function addToWishlist(productId: string): Promise<{ message: string }> {
  return fetchFromApi(`/api/wishlist/${productId}`, {
    method: 'POST',
  });
}

// verwijder product uit wishlist
export async function removeFromWishlist(productId: string): Promise<{ message: string }> {
  return fetchFromApi(`/api/wishlist/${productId}`, {
    method: 'DELETE',
  });
}

// check of product in wishlist staat
export async function checkInWishlist(productId: string): Promise<{ in_wishlist: boolean }> {
  return fetchFromApi(`/api/wishlist/check/${productId}`);
}

// ============ ORDER FUNCTIES ============

export interface OrderItemCreate {
  product_id?: string;
  product_title: string;
  product_price: number;
  product_image_url?: string;
  size?: string;
  quantity: number;
}

export interface OrderCreate {
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  shipping_method: 'bezorgen' | 'ophalen';
  shipping_city?: string;
  shipping_street?: string;
  shipping_postal_code?: string;
  items: OrderItemCreate[];
}

export interface OrderItem {
  id: string;
  product_id?: string;
  product_title: string;
  product_price: number;
  product_image_url?: string;
  size?: string;
  quantity: number;
  line_total: number;
}

export interface Order {
  id: string;
  order_number: string;
  user_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  shipping_method: string;
  shipping_city?: string;
  shipping_street?: string;
  shipping_postal_code?: string;
  subtotal: number;
  shipping_cost: number;
  total: number;
  status: string;
  created_at: string;
  updated_at?: string;
  items: OrderItem[];
}

// maak nieuwe bestelling aan
export async function createOrder(orderData: OrderCreate): Promise<Order> {
  return fetchFromApi('/api/orders', {
    method: 'POST',
    body: JSON.stringify(orderData),
  });
}

// haal alle bestellingen van ingelogde gebruiker op
export async function getMyOrders(): Promise<Order[]> {
  return fetchFromApi('/api/orders');
}

// haal specifieke bestelling op
export async function getOrder(orderId: string): Promise<Order> {
  return fetchFromApi(`/api/orders/${orderId}`);
}
