-- ============================================================================
-- InvestPro Dashboard - SQL Database Schema
-- Version: 1.0.0
-- Fecha: 15 de febrero de 2026
-- ============================================================================

-- Habilitar restricciones de claves foráneas
PRAGMA foreign_keys = ON;

-- ============================================================================
-- Tabla: users
-- Descripción: Almacena información de usuarios registrados
-- ============================================================================
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  created_at TEXT NOT NULL
);

-- Índices para optimización
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);

-- ============================================================================
-- Tabla: entities (Bancos/Inversiones)
-- Descripción: Representa cada banco o entidad financiera donde invierte un usuario
-- ============================================================================
CREATE TABLE IF NOT EXISTS entities (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  bank_name TEXT NOT NULL,
  initial_capital REAL NOT NULL DEFAULT 0,
  annual_interest REAL NOT NULL DEFAULT 0,
  savings_goal REAL NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Índices para optimización
CREATE INDEX IF NOT EXISTS idx_entities_user_id ON entities(user_id);
CREATE INDEX IF NOT EXISTS idx_entities_created_at ON entities(created_at);

-- ============================================================================
-- Tabla: contributions (Aportes)
-- Descripción: Registra cada aporte realizado a una entidad
-- ============================================================================
CREATE TABLE IF NOT EXISTS contributions (
  id TEXT PRIMARY KEY,
  entity_id TEXT NOT NULL,
  amount REAL NOT NULL,
  note TEXT,
  created_at TEXT NOT NULL,
  FOREIGN KEY (entity_id) REFERENCES entities(id) ON DELETE CASCADE
);

-- Índices para optimización
CREATE INDEX IF NOT EXISTS idx_contributions_entity_id ON contributions(entity_id);
CREATE INDEX IF NOT EXISTS idx_contributions_created_at ON contributions(created_at);

-- ============================================================================
-- Tabla: config (Configuración)
-- Descripción: Almacena datos de configuración global de la aplicación
-- ============================================================================
CREATE TABLE IF NOT EXISTS config (
  id TEXT PRIMARY KEY,
  creator_name TEXT NOT NULL DEFAULT 'Anonimo-sys19',
  contact TEXT NOT NULL DEFAULT 'WhatsApp 62228271 +CR'
);

-- Insertar configuración inicial
INSERT INTO config (id, creator_name, contact) 
VALUES ('main', 'Anonimo-sys19', 'WhatsApp 62228271 +CR')
ON CONFLICT(id) DO NOTHING;

-- ============================================================================
-- COMENTARIOS DE ESTRUCTURA
-- ============================================================================

-- users.id: UUID único para cada usuario
-- users.email: Email único, se usa para login
-- users.password_hash: Contraseña hasheada con SHA256
-- users.first_name: Nombre del usuario
-- users.last_name: Apellido del usuario
-- users.created_at: Fecha de creación en ISO 8601

-- entities.id: UUID único para cada entidad
-- entities.user_id: FK a usuario propietario
-- entities.bank_name: Nombre del banco (BAC, BCR, etc.)
-- entities.initial_capital: Capital inicial en moneda local
-- entities.annual_interest: Tasa de interés anual en % (ej: 5.5)
-- entities.savings_goal: Meta de ahorro en moneda local
-- entities.created_at: Fecha de creación de la inversión

-- contributions.id: UUID único para cada aporte
-- contributions.entity_id: FK a la entidad donde se hizo el aporte
-- contributions.amount: Monto del aporte
-- contributions.note: Descripción opcional (ej: "Aporte mensual febrero")
-- contributions.created_at: Fecha del aporte en ISO 8601

-- ============================================================================
-- CONSULTAS ÚTILES PARA MONITOREO
-- ============================================================================

-- Ver total de usuarios
-- SELECT COUNT(*) as total_usuarios FROM users;

-- Ver total de entidades (inversiones)
-- SELECT COUNT(*) as total_entidades FROM entities;

-- Ver total de aportes
-- SELECT COUNT(*) as total_aportes FROM contributions;

-- Ver resumen por usuario
-- SELECT 
--   u.id,
--   u.email,
--   u.first_name,
--   u.last_name,
--   COUNT(DISTINCT e.id) as num_entidades,
--   COUNT(DISTINCT c.id) as num_aportes,
--   SUM(c.amount) as total_aportado,
--   u.created_at
-- FROM users u
-- LEFT JOIN entities e ON u.id = e.user_id
-- LEFT JOIN contributions c ON e.id = c.entity_id
-- GROUP BY u.id
-- ORDER BY u.created_at DESC;

-- Ver entidades de un usuario específico
-- SELECT * FROM entities WHERE user_id = 'uuid-del-usuario' ORDER BY created_at DESC;

-- Ver aportes de una entidad
-- SELECT * FROM contributions WHERE entity_id = 'uuid-de-entidad' ORDER BY created_at DESC;

-- ============================================================================
-- NOTAS DE SEGURIDAD
-- ============================================================================
-- - Las contraseñas se almacenan hasheadas con SHA256 (nunca en texto plano)
-- - Los IDs son UUIDs generados en el cliente
-- - Las fechas se almacenan en formato ISO 8601 (UTC)
-- - Las claves foráneas tienen ON DELETE CASCADE para limpiar datos
-- - Los índices mejoran performance en búsquedas frecuentes
-- - El email tiene restricción UNIQUE para evitar duplicados

-- ============================================================================
-- NOTAS DE MIGRACIÓN
-- ============================================================================
-- Este schema fue creado el 15 de febrero de 2026
-- Para actualizar a futuras versiones, ejecuta los scripts de migración
-- correspondientes manteniendo la integridad referencial

-- ============================================================================
