import { NextResponse } from "next/server";
import { getDb, saveDb, generateId, queryAll } from "@/lib/db";
import { verifyToken } from "@/lib/auth";
import type { Entity, Contribution } from "@/lib/db";

export async function GET(request: Request) {
  try {
    // Get user from token
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

    const verified = await verifyToken(token);
    if (!verified) {
      return NextResponse.json({ error: "Token inválido" }, { status: 401 });
    }

    const db = await getDb();
    // Only get entities for this user
    const entities = await queryAll<Entity>(
      "SELECT * FROM entities WHERE user_id = ? ORDER BY created_at DESC",
      [verified.userId],
    );
    const contributions = await queryAll<Contribution>(
      "SELECT * FROM contributions ORDER BY created_at DESC",
    );

    const result = entities.map((entity) => ({
      ...entity,
      contributions: contributions.filter((c) => c.entity_id === entity.id),
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error("GET /api/entities error:", error);
    return NextResponse.json(
      { error: "Failed to fetch entities" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    // Get user from token
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

    const verified = await verifyToken(token);
    if (!verified) {
      return NextResponse.json({ error: "Token inválido" }, { status: 401 });
    }

    const body = await request.json();
    const { bankName, initialCapital, annualInterest, savingsGoal, createdAt } =
      body;

    if (
      !bankName ||
      initialCapital == null ||
      annualInterest == null ||
      savingsGoal == null
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const db = await getDb();
    const id = generateId();
    const date = createdAt || new Date().toISOString();

    await db.execute({
      sql: "INSERT INTO entities (id, user_id, bank_name, initial_capital, annual_interest, savings_goal, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
      args: [
        id,
        verified.userId,
        bankName,
        Number(initialCapital),
        Number(annualInterest),
        Number(savingsGoal),
        date,
      ],
    });
    await saveDb();

    const entity = (
      await queryAll<Entity>("SELECT * FROM entities WHERE id = ?", [id])
    )[0];

    return NextResponse.json({ ...entity, contributions: [] }, { status: 201 });
  } catch (error) {
    console.error("POST /api/entities error:", error);
    return NextResponse.json(
      { error: "Failed to create entity" },
      { status: 500 },
    );
  }
}
