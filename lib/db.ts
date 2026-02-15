import { createClient } from "@libsql/client";

// Configuración del cliente de Turso
const client = createClient({
  url: process.env.TURSO_DATABASE_URL || "file:investpro.db",
  authToken: process.env.TURSO_AUTH_TOKEN,
});

/**
 * En Turso no necesitamos cargar WASM ni exportar archivos manualmente.
 * El "client" ya es nuestra conexión persistente.
 */
export async function getDb() {
  return client;
}

export function generateId(): string {
  return crypto.randomUUID();
}

/**
 * Mantenemos el nombre y firma de tus funciones para no romper el dashboard
 * Nota: Ahora son async porque Turso trabaja sobre red.
 */
export async function runSql(sql: string, params: any[] = []) {
  try {
    await client.execute({ sql, args: params });
  } catch (error) {
    console.error("Error ejecutando SQL:", error);
    throw error;
  }
}

export async function queryAll<T>(
  sql: string,
  params: any[] = [],
): Promise<T[]> {
  try {
    const result = await client.execute({ sql, args: params });
    // Convertimos las filas de Turso al formato de objeto que esperaba tu app
    return result.rows as unknown as T[];
  } catch (error) {
    console.error("Error en queryAll:", error);
    return [];
  }
}

export async function queryOne<T>(
  sql: string,
  params: any[] = [],
): Promise<T | undefined> {
  const results = await queryAll<T>(sql, params);
  return results[0];
}

/**
 * saveDb: No-op para compatibilidad con Turso
 * Con Turso, los datos se guardan automáticamente en la base de datos.
 * No necesitamos exportar/importar archivos como en sql.js.
 */
export async function saveDb(): Promise<void> {
  // En Turso, los cambios se persisten automáticamente.
  // Esta función existe solo para mantener compatibilidad con el código existente.
}

// --- TIPOS (Se mantienen exactamente igual) ---
export interface User {
  id: string;
  email: string;
  password_hash: string;
  first_name: string;
  last_name: string;
  premium: boolean;
  premium_expires: string | null;
  created_at: string;
}

export interface Entity {
  id: string;
  user_id: string;
  bank_name: string;
  initial_capital: number;
  annual_interest: number;
  savings_goal: number;
  created_at: string;
}

export interface Contribution {
  id: string;
  entity_id: string;
  amount: number;
  note: string | null;
  created_at: string;
}

export interface EntityWithContributions extends Entity {
  contributions: Contribution[];
}
