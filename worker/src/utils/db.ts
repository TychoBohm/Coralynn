import type { D1Database } from "@cloudflare/workers-types";

export interface User {
  id: string;
  email: string;
  hashed_password: string;
  phone_number?: string;
  name?: string;
  is_superuser: number;
  shipping_city?: string;
  shipping_street?: string;
  shipping_postal_code?: string;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  title: string;
  description?: string;
  price: number;
  display_order?: number;
  created_at: string;
  updated_at: string;
  images?: ProductImage[];
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  sort_order?: number;
}

export async function getUserByEmail(
  db: D1Database,
  email: string
): Promise<User | null> {
  const result = await db
    .prepare("SELECT * FROM users WHERE email = ? LIMIT 1")
    .bind(email)
    .first<User>();
  return result || null;
}

export async function getUserById(
  db: D1Database,
  id: string
): Promise<User | null> {
  const result = await db
    .prepare("SELECT * FROM users WHERE id = ? LIMIT 1")
    .bind(id)
    .first<User>();
  return result || null;
}

export async function getProducts(
  db: D1Database,
  skip = 0,
  limit = 100
): Promise<Product[]> {
  const products = await db
    .prepare("SELECT * FROM products ORDER BY display_order ASC LIMIT ? OFFSET ?")
    .bind(limit, skip)
    .all<Product>();

  // Fetch images for each product
  for (const product of products.results || []) {
    const images = await db
      .prepare("SELECT * FROM product_images WHERE product_id = ? ORDER BY sort_order ASC")
      .bind(product.id)
      .all<ProductImage>();
    product.images = images.results || [];
  }

  return products.results || [];
}

export async function getProductById(
  db: D1Database,
  id: string
): Promise<Product | null> {
  const product = await db
    .prepare("SELECT * FROM products WHERE id = ? LIMIT 1")
    .bind(id)
    .first<Product>();

  if (!product) return null;

  const images = await db
    .prepare("SELECT * FROM product_images WHERE product_id = ? ORDER BY sort_order ASC")
    .bind(id)
    .all<ProductImage>();
  product.images = images.results || [];

  return product;
}
