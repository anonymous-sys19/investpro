#!/bin/bash

# ============================================================================
# Script: Migración de Base de Datos para Premium Features
# Descripción: Agrega columnas premium a tabla users
# Fecha: 15 de febrero de 2026
# ============================================================================

DB_FILE="investpro.db"

if [ ! -f "$DB_FILE" ]; then
  echo "❌ Error: No se encontró la base de datos en $DB_FILE"
  echo "Primero ejecuta: sqlite3 $DB_FILE < database.sql"
  exit 1
fi

echo "🔄 Iniciando migración de base de datos..."

# Ejecutar comando SQL para agregar las columnas
sqlite3 "$DB_FILE" <<EOF

-- Agregar columnas si no existen (SQLite no tiene IF NOT EXISTS para ALTER TABLE)
BEGIN TRANSACTION;

-- Crear tabla temporal con la nueva estructura
CREATE TABLE IF NOT EXISTS users_new (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  premium BOOLEAN DEFAULT 0,
  premium_expires TEXT DEFAULT NULL,
  created_at TEXT NOT NULL
);

-- Copiar datos de la tabla antigua (si existen)
INSERT INTO users_new (id, email, password_hash, first_name, last_name, premium, premium_expires, created_at)
SELECT id, email, password_hash, first_name, last_name, 0, NULL, created_at 
FROM users
WHERE 1=1;

-- Eliminar tabla antigua
DROP TABLE IF EXISTS users;

-- Renombrar tabla nueva
ALTER TABLE users_new RENAME TO users;

-- Recrear índices
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);
CREATE INDEX IF NOT EXISTS idx_users_premium ON users(premium);

COMMIT;

EOF

if [ $? -eq 0 ]; then
  echo "✅ Migración completada exitosamente"
  echo "📋 Cambios realizados:"
  echo "   - Agregada columna: premium (BOOLEAN)"
  echo "   - Agregada columna: premium_expires (TEXT)"
  echo "   - Creado índice: idx_users_premium"
  echo ""
  echo "💡 Los usuarios existentes tienen premium=0 (false)"
else
  echo "❌ Error durante la migración"
  exit 1
fi
