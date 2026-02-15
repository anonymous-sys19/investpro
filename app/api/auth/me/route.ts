import { NextResponse } from "next/server";
import { getDb, queryOne } from "@/lib/db";
import { verifyToken } from "@/lib/auth";
import type { User } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const cookieHeader = request.headers.get("cookie");
    if (!cookieHeader) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const cookies = cookieHeader.split(";").reduce(
      (acc, cookie) => {
        const [key, value] = cookie.trim().split("=");
        acc[key] = decodeURIComponent(value || "");
        return acc;
      },
      {} as Record<string, string>,
    );

    const token = cookies.auth_token;
    if (!token) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    // Verify token
    const verified = await verifyToken(token);
    if (!verified) {
      return NextResponse.json({ error: "Token inválido" }, { status: 401 });
    }

    const db = await getDb();
    const user = await queryOne<User>(
      "SELECT id, email, first_name, last_name FROM users WHERE id = ?",
      [verified.userId],
    );

    if (!user) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
      },
    });
  } catch (error) {
    console.error("GET /api/auth/me error:", error);
    return NextResponse.json(
      { error: "Error al obtener información del usuario" },
      { status: 500 },
    );
  }
}
