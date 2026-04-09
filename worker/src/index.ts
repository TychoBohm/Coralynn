import { Hono } from "hono";
import { cors } from "hono/cors";
import type { D1Database } from "@cloudflare/workers-types";
import {
  hashPassword,
  verifyPassword,
  createAccessToken,
  verifyAccessToken,
} from "./utils/security";
import * as db from "./utils/db";

interface Env {
  DB: D1Database;
}

const app = new Hono<{ Bindings: Env }>();

// CORS middleware
app.use("*", cors({
  origin: "*",
  allowMethods: ["GET", "POST", "PUT", "DELETE"],
  allowHeaders: ["Content-Type", "Authorization"],
}));

// Helper to get authenticated user
async function getAuthUser(req: Request, env: Env) {
  const auth = req.headers.get("Authorization");
  if (!auth?.startsWith("Bearer ")) return null;
  
  const token = auth.substring(7);
  const decoded = await verifyAccessToken(token);
  if (!decoded) return null;
  
  return await db.getUserByEmail(env.DB, decoded.email);
}

// Auth routes
app.post("/api/auth/register", async (c) => {
  try {
    const { email, password, name, phone_number } = await c.req.json();

    if (!email || !password) {
      return c.json({ detail: "Email en wachtwoord vereist" }, 400);
    }

    const existing = await db.getUserByEmail(c.env.DB, email);
    if (existing) {
      return c.json({ detail: "Email is al geregistreerd" }, 400);
    }

    const hashedPassword = await hashPassword(password);
    const id = crypto.randomUUID();

    await c.env.DB.prepare(
      `INSERT INTO users (id, email, hashed_password, name, phone_number) VALUES (?, ?, ?, ?, ?)`
    )
      .bind(id, email, hashedPassword, name || null, phone_number || null)
      .run();

    const user = await db.getUserById(c.env.DB, id);
    const token = await createAccessToken(email);

    return c.json(
      {
        id: user?.id,
        email: user?.email,
        name: user?.name,
        phone_number: user?.phone_number,
        is_superuser: user?.is_superuser,
        access_token: token,
        token_type: "bearer",
      },
      201
    );
  } catch (error) {
    console.error("Register error:", error);
    return c.json({ detail: "Registratiefout" }, 500);
  }
});

app.post("/api/auth/login", async (c) => {
  try {
    const { email, password } = await c.req.json();

    if (!email || !password) {
      return c.json({ detail: "Email en wachtwoord vereist" }, 400);
    }

    const user = await db.getUserByEmail(c.env.DB, email);
    if (!user || !(await verifyPassword(password, user.hashed_password))) {
      return c.json({ detail: "Ongeldige inloggegevens" }, 401);
    }

    const token = await createAccessToken(email);

    return c.json({
      id: user.id,
      email: user.email,
      name: user.name,
      phone_number: user.phone_number,
      is_superuser: user.is_superuser,
      access_token: token,
      token_type: "bearer",
    });
  } catch (error) {
    console.error("Login error:", error);
    return c.json({ detail: "Inlogfout" }, 500);
  }
});

app.get("/api/auth/me", async (c) => {
  try {
    const user = await getAuthUser(c.req.raw, c.env);
    if (!user) {
      return c.json({ detail: "Niet geauthenticeerd" }, 401);
    }

    return c.json({
      id: user.id,
      email: user.email,
      name: user.name,
      phone_number: user.phone_number,
      is_superuser: user.is_superuser,
      shipping_city: user.shipping_city,
      shipping_street: user.shipping_street,
      shipping_postal_code: user.shipping_postal_code,
    });
  } catch (error) {
    console.error("Get current user error:", error);
    return c.json({ detail: "Fout" }, 500);
  }
});

app.put("/api/auth/me", async (c) => {
  try {
    const user = await getAuthUser(c.req.raw, c.env);
    if (!user) {
      return c.json({ detail: "Niet geauthenticeerd" }, 401);
    }

    const data = await c.req.json();

    await c.env.DB.prepare(
      `UPDATE users SET name = ?, phone_number = ?, shipping_city = ?, shipping_street = ?, shipping_postal_code = ? WHERE id = ?`
    )
      .bind(
        data.name ?? user.name,
        data.phone_number ?? user.phone_number,
        data.shipping_city ?? user.shipping_city,
        data.shipping_street ?? user.shipping_street,
        data.shipping_postal_code ?? user.shipping_postal_code,
        user.id
      )
      .run();

    const updated = await db.getUserById(c.env.DB, user.id);
    return c.json(updated);
  } catch (error) {
    console.error("Update user error:", error);
    return c.json({ detail: "Fout" }, 500);
  }
});

// Products routes
app.get("/api/products", async (c) => {
  try {
    const skip = parseInt(c.req.query("skip") || "0");
    const limit = parseInt(c.req.query("limit") || "100");
    const products = await db.getProducts(c.env.DB, skip, limit);
    return c.json(products);
  } catch (error) {
    console.error("Get products error:", error);
    return c.json({ detail: "Fout" }, 500);
  }
});

app.get("/api/products/:id", async (c) => {
  try {
    const product = await db.getProductById(c.env.DB, c.req.param("id"));
    if (!product) {
      return c.json({ detail: "Product niet gevonden" }, 404);
    }
    return c.json(product);
  } catch (error) {
    console.error("Get product error:", error);
    return c.json({ detail: "Fout" }, 500);
  }
});

// Wishlist routes
app.get("/api/wishlist", async (c) => {
  try {
    const user = await getAuthUser(c.req.raw, c.env);
    if (!user) {
      return c.json({ detail: "Niet geauthenticeerd" }, 401);
    }

    const wishlist = await c.env.DB.prepare(
      "SELECT p.* FROM products p JOIN wishlist_items w ON p.id = w.product_id WHERE w.user_id = ?"
    )
      .bind(user.id)
      .all<db.Product>();

    return c.json(wishlist.results || []);
  } catch (error) {
    console.error("Get wishlist error:", error);
    return c.json({ detail: "Fout" }, 500);
  }
});

app.get("/api/wishlist/ids", async (c) => {
  try {
    const user = await getAuthUser(c.req.raw, c.env);
    if (!user) {
      return c.json({ detail: "Niet geauthenticeerd" }, 401);
    }

    const result = await c.env.DB.prepare(
      "SELECT product_id FROM wishlist_items WHERE user_id = ?"
    )
      .bind(user.id)
      .all<{ product_id: string }>();

    return c.json((result.results || []).map((r) => r.product_id));
  } catch (error) {
    console.error("Get wishlist ids error:", error);
    return c.json({ detail: "Fout" }, 500);
  }
});

app.post("/api/wishlist/:product_id", async (c) => {
  try {
    const user = await getAuthUser(c.req.raw, c.env);
    if (!user) {
      return c.json({ detail: "Niet geauthenticeerd" }, 401);
    }

    const productId = c.req.param("product_id");
    const product = await db.getProductById(c.env.DB, productId);
    if (!product) {
      return c.json({ detail: "Product niet gevonden" }, 404);
    }

    const existing = await c.env.DB.prepare(
      "SELECT * FROM wishlist_items WHERE user_id = ? AND product_id = ?"
    )
      .bind(user.id, productId)
      .first();

    if (existing) {
      return c.json({ detail: "Al in wishlist" }, 400);
    }

    await c.env.DB.prepare(
      "INSERT INTO wishlist_items (id, user_id, product_id) VALUES (?, ?, ?)"
    )
      .bind(crypto.randomUUID(), user.id, productId)
      .run();

    return c.json({ message: "Toegevoegd" }, 201);
  } catch (error) {
    console.error("Add to wishlist error:", error);
    return c.json({ detail: "Fout" }, 500);
  }
});

app.delete("/api/wishlist/:product_id", async (c) => {
  try {
    const user = await getAuthUser(c.req.raw, c.env);
    if (!user) {
      return c.json({ detail: "Niet geauthenticeerd" }, 401);
    }

    const productId = c.req.param("product_id");

    await c.env.DB.prepare(
      "DELETE FROM wishlist_items WHERE user_id = ? AND product_id = ?"
    )
      .bind(user.id, productId)
      .run();

    return c.json({ message: "Verwijderd" });
  } catch (error) {
    console.error("Remove from wishlist error:", error);
    return c.json({ detail: "Fout" }, 500);
  }
});

app.get("/api/wishlist/check/:product_id", async (c) => {
  try {
    const user = await getAuthUser(c.req.raw, c.env);
    if (!user) return c.json(false);

    const productId = c.req.param("product_id");
    const result = await c.env.DB.prepare(
      "SELECT * FROM wishlist_items WHERE user_id = ? AND product_id = ? LIMIT 1"
    )
      .bind(user.id, productId)
      .first();

    return c.json(!!result);
  } catch (error) {
    return c.json(false);
  }
});

// Orders routes
app.get("/api/orders", async (c) => {
  try {
    const user = await getAuthUser(c.req.raw, c.env);
    if (!user) {
      return c.json({ detail: "Niet geauthenticeerd" }, 401);
    }

    const orders = await c.env.DB.prepare(
      "SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC"
    )
      .bind(user.id)
      .all();

    return c.json(orders.results || []);
  } catch (error) {
    console.error("Get orders error:", error);
    return c.json({ detail: "Fout" }, 500);
  }
});

app.get("/api/orders/:id", async (c) => {
  try {
    const user = await getAuthUser(c.req.raw, c.env);
    if (!user) {
      return c.json({ detail: "Niet geauthenticeerd" }, 401);
    }

    const order = await c.env.DB.prepare(
      "SELECT * FROM orders WHERE id = ? AND user_id = ?"
    )
      .bind(c.req.param("id"), user.id)
      .first();

    if (!order) {
      return c.json({ detail: "Niet gevonden" }, 404);
    }

    return c.json(order);
  } catch (error) {
    console.error("Get order error:", error);
    return c.json({ detail: "Fout" }, 500);
  }
});

app.post("/api/orders", async (c) => {
  try {
    const user = await getAuthUser(c.req.raw, c.env);
    if (!user) {
      return c.json({ detail: "Niet geauthenticeerd" }, 401);
    }

    const orderData = await c.req.json();
    const orderId = crypto.randomUUID();
    const orderNumber = `ORD-${Date.now()}`;

    await c.env.DB.prepare(
      `INSERT INTO orders (id, user_id, order_number, customer_name, customer_email, customer_phone, shipping_method, shipping_city, shipping_street, shipping_postal_code, subtotal, shipping_cost, total) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
      .bind(
        orderId,
        user.id,
        orderNumber,
        orderData.customer_name,
        orderData.customer_email,
        orderData.customer_phone || null,
        orderData.shipping_method,
        orderData.shipping_city || null,
        orderData.shipping_street || null,
        orderData.shipping_postal_code || null,
        orderData.subtotal,
        orderData.shipping_cost || 0,
        orderData.total
      )
      .run();

    // Add order items
    if (orderData.items?.length) {
      for (const item of orderData.items) {
        await c.env.DB.prepare(
          `INSERT INTO order_items (id, order_id, product_id, product_title, product_price, product_image_url, quantity, line_total) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
        )
          .bind(
            crypto.randomUUID(),
            orderId,
            item.product_id || null,
            item.product_title,
            item.product_price,
            item.product_image_url || null,
            item.quantity,
            item.line_total
          )
          .run();
      }
    }

    return c.json({ id: orderId, order_number: orderNumber }, 201);
  } catch (error) {
    console.error("Create order error:", error);
    return c.json({ detail: "Fout" }, 500);
  }
});

app.put("/api/orders/:id/cancel", async (c) => {
  try {
    const user = await getAuthUser(c.req.raw, c.env);
    if (!user) {
      return c.json({ detail: "Niet geauthenticeerd" }, 401);
    }

    const orderId = c.req.param("id");

    await c.env.DB.prepare("UPDATE orders SET status = ? WHERE id = ? AND user_id = ?")
      .bind("cancelled", orderId, user.id)
      .run();

    return c.json({ message: "Geannuleerd" });
  } catch (error) {
    console.error("Cancel order error:", error);
    return c.json({ detail: "Fout" }, 500);
  }
});

// Health check
app.get("/api/ping", (c) => {
  return c.json({ status: "connected" });
});

export default app;
