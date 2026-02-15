import { NextResponse } from "next/server";
import { getDb, saveDb, generateId, queryAll } from "@/lib/db";
import type { Contribution } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { entityId, amount, note, createdAt } = body;

    if (!entityId || amount == null) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    console.log("[v0] POST /api/contributions - body:", JSON.stringify(body));
    const db = await getDb();

    const entity = await queryAll("SELECT id FROM entities WHERE id = ?", [
      entityId,
    ]);
    console.log("[v0] Entity lookup result:", JSON.stringify(entity));
    if (entity.length === 0) {
      return NextResponse.json({ error: "Entity not found" }, { status: 404 });
    }

    const id = generateId();
    const date = createdAt || new Date().toISOString();
    const noteValue = note || "";

    console.log("[v0] Inserting contribution:", {
      id,
      entityId,
      amount: Number(amount),
      noteValue,
      date,
    });

    await db.execute({
      sql: "INSERT INTO contributions (id, entity_id, amount, note, created_at) VALUES (?, ?, ?, ?, ?)",
      args: [id, entityId, Number(amount), noteValue, date],
    });
    await saveDb();

    const contributions = await queryAll<Contribution>(
      "SELECT * FROM contributions WHERE id = ?",
      [id],
    );
    const contribution = contributions[0];
    console.log("[v0] Created contribution:", JSON.stringify(contribution));

    return NextResponse.json(contribution, { status: 201 });
  } catch (error) {
    console.error("POST /api/contributions error:", error);
    return NextResponse.json(
      { error: "Failed to create contribution" },
      { status: 500 },
    );
  }
}

// DELETE - Eliminar un aporte
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Missing contribution id" },
        { status: 400 },
      );
    }

    const db = await getDb();
    await db.execute({
      sql: "DELETE FROM contributions WHERE id = ?",
      args: [id],
    });
    await saveDb();

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("DELETE /api/contributions error:", error);
    return NextResponse.json(
      { error: "Failed to delete contribution" },
      { status: 500 },
    );
  }
}

// PUT - Editar un aporte
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, amount, note, createdAt } = body;

    if (!id || amount == null) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const db = await getDb();

    const existing = await queryAll<Contribution>(
      "SELECT * FROM contributions WHERE id = ?",
      [id],
    );
    if (existing.length === 0) {
      return NextResponse.json(
        { error: "Contribution not found" },
        { status: 404 },
      );
    }

    const date = createdAt || existing[0].created_at;
    const noteValue = note || "";

    await db.execute({
      sql: "UPDATE contributions SET amount = ?, note = ?, created_at = ? WHERE id = ?",
      args: [Number(amount), noteValue, date, id],
    });
    await saveDb();

    const updated = await queryAll<Contribution>(
      "SELECT * FROM contributions WHERE id = ?",
      [id],
    );
    return NextResponse.json(updated[0], { status: 200 });
  } catch (error) {
    console.error("PUT /api/contributions error:", error);
    return NextResponse.json(
      { error: "Failed to update contribution" },
      { status: 500 },
    );
  }
}
