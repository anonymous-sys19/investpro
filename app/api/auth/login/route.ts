import { NextResponse } from "next/server";
import { getDb, queryOne } from "@/lib/db";
import { verifyPassword, generateToken } from "@/lib/auth";
import type { User } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email y contraseña son requeridos" },
        { status: 400 },
      );
    }

    const db = await getDb();

    // Find user by email
    const user = await queryOne<User>(
      "SELECT id, email, password_hash, first_name, last_name FROM users WHERE email = ?",
      [email],
    );

    if (!user) {
      return NextResponse.json(
        { error: "Email o contraseña incorrectos" },
        { status: 401 },
      );
    }

    // Verify password
    if (!verifyPassword(password, user.password_hash)) {
      return NextResponse.json(
        { error: "Email o contraseña incorrectos" },
        { status: 401 },
      );
    }

    // Generate token
    const token = await generateToken(user.id);

    // Create response with httpOnly cookie
    const response = NextResponse.json(
      {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
        },
      },
      { status: 200 },
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
    console.error("POST /api/auth/login error:", error);
    return NextResponse.json(
      { error: "Error al iniciar sesión" },
      { status: 500 },
    );
  }
}
