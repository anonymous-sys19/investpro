import crypto from "crypto";
import { jwtVerify, SignJWT } from "jose";

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-secret-key-change-in-production",
);

// Hash password with crypto (simple method for SQLite)
export function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

// Verify password
export function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}

// Generate JWT token (7 days expiration)
export async function generateToken(userId: string): Promise<string> {
  const token = await new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(SECRET);

  return token;
}

// Verify JWT token
export async function verifyToken(
  token: string,
): Promise<{ userId: string } | null> {
  try {
    const verified = await jwtVerify(token, SECRET);
    return { userId: verified.payload.userId as string };
  } catch (err) {
    return null;
  }
}

// Get user from request cookies
export function getUserIdFromCookie(request: Request): string | null {
  const cookieHeader = request.headers.get("cookie");
  if (!cookieHeader) return null;

  const cookies = cookieHeader.split(";").reduce(
    (acc, cookie) => {
      const [key, value] = cookie.trim().split("=");
      acc[key] = decodeURIComponent(value || "");
      return acc;
    },
    {} as Record<string, string>,
  );

  return cookies.auth_token || null;
}

// Validate email format
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validate password strength (at least 6 characters)
export function isValidPassword(password: string): boolean {
  return password.length >= 6;
}
