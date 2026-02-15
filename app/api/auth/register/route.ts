import { NextResponse } from "next/server";
import { getDb, saveDb, generateId, queryOne } from "@/lib/db";
import {
  hashPassword,
  generateToken,
  isValidEmail,
  isValidPassword,
} from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { email, password, firstName, lastName } = await request.json();

    // Validations
    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { error: "Todos los campos son requeridos" },
        { status: 400 },
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "El email no es válido" },
        { status: 400 },
      );
    }

    if (!isValidPassword(password)) {
      return NextResponse.json(
        { error: "La contraseña debe tener al menos 6 caracteres" },
        { status: 400 },
      );
    }

    const db = await getDb();

    // Check if email already exists
    const existingUser = await queryOne<{ id: string }>(
      "SELECT id FROM users WHERE email = ?",
      [email],
    );

    if (existingUser) {
      return NextResponse.json(
        { error: "Este email ya está registrado" },
        { status: 400 },
      );
    }

    // Create new user
    const userId = generateId();
    const passwordHash = hashPassword(password);
    const createdAt = new Date().toISOString();

    await db.execute({
      sql: "INSERT INTO users (id, email, password_hash, first_name, last_name, created_at) VALUES (?, ?, ?, ?, ?, ?)",
      args: [userId, email, passwordHash, firstName, lastName, createdAt],
    });

    await saveDb();

    // Generate token
    const token = await generateToken(userId);

    // Create response with httpOnly cookie
    const response = NextResponse.json(
      {
        user: {
          id: userId,
          email,
          firstName,
          lastName,
        },
      },
      { status: 201 },
    );

    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("POST /api/auth/register error:", error);
    return NextResponse.json(
      { error: "Error al registrar el usuario" },
      { status: 500 },
    );
  }
}
