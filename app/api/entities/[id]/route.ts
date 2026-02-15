import { NextResponse } from "next/server";
import { getDb, saveDb, queryAll } from "@/lib/db";
import type { Entity, Contribution } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = await getDb();
    const entity = queryAll<Entity>(db, "SELECT * FROM entities WHERE id = ?", [id])[0];

    if (!entity) {
      return NextResponse.json({ error: "Entity not found" }, { status: 404 });
    }

    const contributions = queryAll<Contribution>(
      db,
      "SELECT * FROM contributions WHERE entity_id = ? ORDER BY created_at DESC",
      [id]
    );

    return NextResponse.json({ ...entity, contributions });
  } catch (error) {
    console.error("GET /api/entities/[id] error:", error);
    return NextResponse.json({ error: "Failed to fetch entity" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = await getDb();
    db.run("DELETE FROM contributions WHERE entity_id = ?", [id]);
    db.run("DELETE FROM entities WHERE id = ?", [id]);
    saveDb(db);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/entities/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete entity" }, { status: 500 });
  }
}
