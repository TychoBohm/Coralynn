// Simplified JWT and password utilities
const SECRET_KEY = "coralynn-secret-key-change-in-production";

export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + SECRET_KEY);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  const newHash = await hashPassword(password);
  return newHash === hash;
}

export async function createAccessToken(email: string): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const exp = now + 24 * 60 * 60; // 24 hours

  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = btoa(JSON.stringify({ sub: email, iat: now, exp }));
  const message = `${header}.${payload}`;

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(SECRET_KEY),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message));
  const sig64 = btoa(String.fromCharCode(...new Uint8Array(signature)));
  return `${message}.${sig64}`;
}

export async function verifyAccessToken(
  token: string
): Promise<{ email: string } | null> {
  try {
    const [headerB64, payloadB64, sigB64] = token.split(".");
    if (!headerB64 || !payloadB64 || !sigB64) return null;

    const message = `${headerB64}.${payloadB64}`;
    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(SECRET_KEY),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );

    const isValid = await crypto.subtle.verify(
      "HMAC",
      key,
      Uint8Array.from(atob(sigB64), (c) => c.charCodeAt(0)),
      new TextEncoder().encode(message)
    );

    if (!isValid) return null;

    const payload = JSON.parse(atob(payloadB64));
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;

    return { email: payload.sub };
  } catch {
    return null;
  }
}
