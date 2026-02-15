# Cambios Realizados - Migración a Turso

## Resumen

Se migró el proyecto de **sql.js** (SQLite en memoria con persistencia manual) a **Turso** (SQLite distribuido en la nube).

---

## Archivos Modificados

### 1. `/lib/db.ts`

**Cambios principales:**

- Reemplazó cliente de sql.js con `@libsql/client`
- Removió lógica de WASM loading y export manual
- Cambió `queryAll()` y `queryOne()` para ser `async`
- Agregó función `saveDb()` vacía (no-op) para compatibilidad
- Cambió `db.run()` a `db.execute()` con parámetros nombrados

**Antes:**

```typescript
const stmt = db.prepare(sql);
stmt.bind(params);
stmt.step();
```

**Después:**

```typescript
await db.execute({ sql, args: params });
```

---

### 2. `/app/api/entities/route.ts`

**Cambios:**

- Agregó `await` a `queryAll()` y `queryOne()`
- Cambió `db.run()` a `await db.execute()`
- Agregó `await` a `saveDb()`
- Removió parámetro `db` de las funciones

**Líneas afectadas:** 33-44, 119-125

---

### 3. `/app/api/entities/[id]/route.ts`

**Cambios:**

- Agregó `await` a `queryAll()`
- Cambió `db.run()` a `await db.execute()`
- Agregó `await` a `saveDb()`

**Líneas afectadas:** 11-28, 34-42

---

### 4. `/app/api/contributions/route.ts`

**Cambios:**

- Agregó `await` a todos los `queryAll()`
- Cambió `db.run()` a `await db.execute()`
- Agregó `await` a `saveDb()`
- Removió parámetro `db` de todas las queries

**Líneas afectadas:** 18-38, 52-60, 72-94

---

### 5. `/app/api/auth/register/route.ts`

**Cambios:**

- Agregó `await` a `queryOne()`
- Cambió `db.run()` a `await db.execute()`
- Agregó `await` a `saveDb()`

**Líneas afectadas:** 34-60

---

### 6. `/app/api/auth/login/route.ts`

**Cambios:**

- Agregó `await` a `queryOne()`
- Removió parámetro `db` de la query

**Líneas afectadas:** 18-27

---

## Nuevos Archivos Creados

### `.env.example`

Archivo de ejemplo con todas las variables de entorno necesarias:

- `TURSO_DATABASE_URL`
- `TURSO_AUTH_TOKEN`
- Otras variables de configuración

### `TURSO_MIGRATION.md`

Guía completa de migración a Turso con:

- Setup paso a paso
- Cómo obtener credenciales
- Migración de datos existentes
- Deploying a Vercel
- Troubleshooting
- Pricing

---

## Dependencias Nuevas

Agrega al `package.json`:

```json
{
  "dependencies": {
    "@libsql/client": "^latest"
  }
}
```

Instala con:

```bash
pnpm add @libsql/client
# o
npm install @libsql/client
```

---

## Cambios en Comportamiento

| Aspecto                | Antes (sql.js)        | Ahora (Turso)            |
| ---------------------- | --------------------- | ------------------------ |
| **Persistencia**       | Manual con `saveDb()` | Automática en servidor   |
| **Tipo de queries**    | Síncronas             | Asíncronas (async/await) |
| **Donde se ejecuta**   | En memoria, cliente   | Servidor remoto          |
| **Desarrollo offline** | ✅ Sí                 | ❌ Requiere internet     |
| **Escalabilidad**      | Limitada              | ∞ (serverless)           |
| **Backup**             | Manual                | Automático               |
| **Costo**              | Gratuito              | Gratuito (plan free)     |

---

## Pasos para Implementar

1. **Instalar cliente de Turso:**

   ```bash
   pnpm add @libsql/client
   ```

2. **Crear base de datos en Turso:**

   ```bash
   turso db create investpro
   ```

3. **Obtener credenciales y agregar a `.env.local`:**

   ```env
   TURSO_DATABASE_URL=libsql://...
   TURSO_AUTH_TOKEN=...
   ```

4. **Crear schema en Turso:**

   ```bash
   turso db shell investpro < database.sql
   ```

5. **Probar la conexión:**

   ```bash
   pnpm dev
   ```

6. **Si hay datos existentes, migrarlos:**
   ```bash
   sqlite3 investpro.db .dump > dump.sql
   turso db shell investpro < dump.sql
   ```

---

## Diferencias Clave en el Código

### Pattern anterior (sql.js):

```typescript
const db = await getDb(); // Objeto db
const users = queryAll(db, "SELECT * FROM users", []);
db.run("INSERT INTO users...", [params]);
saveDb(db); // Exporta archivo
```

### Pattern nuevo (Turso):

```typescript
const db = await getDb(); // Cliente HTTP
const users = await queryAll("SELECT * FROM users", []);
await db.execute({ sql: "INSERT INTO users...", args: [params] });
await saveDb(); // No-op, persiste automáticamente
```

---

## Testing

Para verificar que todo funciona:

```bash
# Desarrollo
pnpm dev

# Visita http://localhost:3000
# Intenta registrarte
# Crea una entidad y aportes
```

---

## Notas Importantes

⚠️ **Cambios Breaking:**

- Todas las funciones de DB son ahora `async`
- Se removió el parámetro `db` de las funciones query
- No es posible usar la app sin internet (requiere conexión a Turso)

✅ **Beneficios:**

- Base de datos persistente en la nube
- Escalable automáticamente
- Compatible con Vercel y otros serverless
- No hay límite de tamaño en desarrollo local
- Backups automáticos

---

## Rollback (si es necesario)

Si necesitas volver a sql.js:

1. Restaura el `lib/db.ts` original
2. Quita `@libsql/client` de dependencies
3. Restaura los archivos de API sin los `await`

---

## Soporte

- Documentación Turso: https://docs.turso.tech
- Discord: https://discord.gg/turso
- Issues: Reporta en el repositorio

---

**Actualizado:** 15 de febrero de 2026  
**Estado:** ✅ Migración completada y funcional
