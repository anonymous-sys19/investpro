# Migración a Turso - Guía Completa

## ¿Qué es Turso?

**Turso** es una base de datos SQLite distribuida en la nube, construida por los creadores de libSQL. Es perfecta para aplicaciones Next.js porque:

- ✅ SQLite (compatible con tu código actual)
- ✅ Servidor remoto (sin gestionar infraestructura)
- ✅ Persistencia automática
- ✅ Plan gratuito generoso
- ✅ Edge-ready para Vercel/Cloudflare

## Setup de Turso (5 minutos)

### 1. Crear cuenta en Turso

1. Ve a [turso.tech](https://turso.tech)
2. Haz clic en "Sign Up"
3. Usa GitHub, Google o email para registrarte

### 2. Crear una base de datos

```bash
# Instalar CLI de Turso
curl --proto '=https' --tlsv1.2 -sSf https://releases.turso.tech/install.sh | bash

# Iniciar sesión
turso auth login

# Crear base de datos
turso db create investpro
```

### 3. Obtener credenciales

```bash
# Ver URL de la base de datos
turso db show investpro

# Generar token de autenticación
turso db tokens create investpro
```

Copiarás dos valores:

- **TURSO_DATABASE_URL**: Algo como `libsql://investpro-usuario.turso.io`
- **TURSO_AUTH_TOKEN**: Un token largo de autenticación

### 4. Configurar variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```env
TURSO_DATABASE_URL=libsql://investpro-usuario.turso.io
TURSO_AUTH_TOKEN=eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9...
```

**⚠️ IMPORTANTE:** Nunca commits `.env.local`. Agregalo a `.gitignore`:

```
.env.local
.env*.local
```

### 5. Crear las tablas

Ejecuta el script SQL para crear el schema:

```bash
# Con turso CLI
turso db shell investpro < database.sql

# O manualmente en el dashboard de Turso
# Abre: https://console.turso.tech
# Pega el contenido de database.sql
```

### 6. Verificar conexión

En tu proyecto, hay un script de prueba:

```bash
npm run test:db
# o
pnpm test:db
```

## Migración de Datos (si tienes datos existentes)

Si ya tienes un SQLite local con datos y quieres migrarlos a Turso:

### Opción 1: Exportar e Importar SQL

```bash
# Desde tu SQLite local, exporta un dump
sqlite3 investpro.db .dump > dump.sql

# Importa en Turso
turso db shell investpro < dump.sql
```

### Opción 2: Script de migración manual

```javascript
// migration.js
const fs = require("fs");
const sqlite3 = require("better-sqlite3");

// Leer datos de SQLite local
const localDb = new sqlite3("investpro.db");
const users = localDb.prepare("SELECT * FROM users").all();
const entities = localDb.prepare("SELECT * FROM entities").all();
const contributions = localDb.prepare("SELECT * FROM contributions").all();

// Guardar como JSON para luego insertarlos en Turso
fs.writeFileSync(
  "data-backup.json",
  JSON.stringify(
    {
      users,
      entities,
      contributions,
    },
    null,
    2,
  ),
);

console.log("✅ Datos exportados a data-backup.json");
```

## Cambios en el Código

Ya hemos actualizado el código para Turso. Los cambios principales son:

### Antes (sql.js):

```typescript
const db = await getDb();
const result = queryAll(db, "SELECT * FROM users");
db.run("INSERT INTO users...");
saveDb(db);
```

### Ahora (Turso):

```typescript
const db = await getDb();
const result = await queryAll("SELECT * FROM users"); // await!
await db.execute({ sql: "INSERT INTO users...", args: [...] }); // execute + args!
await saveDb(); // vacío, pero mantiene compatibilidad
```

## Variables de Entorno Necesarias

Crea `.env.local`:

```env
# Turso (Producción)
TURSO_DATABASE_URL=libsql://investpro-usuario.turso.io
TURSO_AUTH_TOKEN=tu_token_aqui

# O local para desarrollo
# TURSO_DATABASE_URL=file:investpro.db
# TURSO_AUTH_TOKEN=
```

## Desplegar en Vercel

1. Conecta tu repo a Vercel
2. En Settings → Environment Variables, agrega:
   - `TURSO_DATABASE_URL`
   - `TURSO_AUTH_TOKEN`
3. Despliega

## Monitoreo y Backups

### Ver estadísticas

```bash
turso db show investpro --stats
```

### Crear backup

```bash
turso db shell investpro .dump > backup-$(date +%Y%m%d).sql
```

### Restaurar desde backup

```bash
turso db shell investpro < backup-20260215.sql
```

## Troubleshooting

### Error: "TURSO_DATABASE_URL not found"

**Solución**: Verifica que `.env.local` existe en la raíz del proyecto

### Error: "Invalid auth token"

**Solución**:

1. Regenera el token: `turso db tokens create investpro`
2. Actualiza `.env.local`

### Error: "Network timeout"

**Solución**:

1. Verifica tu conexión a internet
2. Comprueba el estado de Turso: [status.turso.tech](https://status.turso.tech)

### Datos no se persisten

**Solución**: Asegúrate de usar `await` en todas las queries

## Pricing

| Plan   | Almacenamiento | Filas/mes | Costo   |
| ------ | -------------- | --------- | ------- |
| Free   | 3 GB           | 50M       | $0      |
| Scaler | 10 GB          | 200M      | $9/mes  |
| Pro    | 100 GB         | 2B        | $99/mes |

**Tu app cabe fácil en el plan free!**

## Recursos Útiles

- [Docs de Turso](https://docs.turso.tech)
- [libSQL SDK para Node.js](https://github.com/libsql/libsql-js)
- [Ejemplos con Next.js](https://turso.tech/docs/tutorials/app-router-nextjs)
- [CLI Reference](https://docs.turso.tech/reference/cli)

## Conclusión

Con Turso, tu aplicación ahora:

- ✅ Tiene base de datos persistente en la nube
- ✅ Puede escalarse automáticamente
- ✅ Funciona en Vercel, Cloudflare Workers, etc.
- ✅ Sigue usando SQLite (sin cambios grandes)
- ✅ Tiene backups automáticos

**¡Listo para producción! 🚀**
