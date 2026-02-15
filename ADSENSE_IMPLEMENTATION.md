# 📺 Google AdSense - Resumen de Implementación

## ✨ Lo Que Se Hizo

### 1. **Script Global de AdSense** ✅

```typescript
// app/layout.tsx
<Script
  async
  src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9277496105560766"
  crossOrigin="anonymous"
  strategy="afterInteractive"
/>
```

### 2. **Componentes Reutilizables** ✅

```typescript
// components/adsense.tsx
<AdSense adSlot="1234567890" />
<AdSenseHorizontal adSlot="1234567890" />
<AdSenseVertical adSlot="1234567890" />
<AdSenseSquare adSlot="1234567890" />
```

### 3. **Configuración Centralizada** ✅

```typescript
// lib/adsense-config.ts
export const AD_SLOTS = {
  FOOTER_HORIZONTAL: "1234567890",
  SIDEBAR_VERTICAL: "0987654321",
  DASHBOARD_AUTO: "5555555555",
  // ... más slots
};

export function shouldShowAd(userPremium: boolean): boolean;
```

### 4. **Footer Actualizado** ✅

```typescript
// components/footer.tsx
{showAds && (
  <AdSenseHorizontal adSlot={AD_SLOTS.FOOTER_HORIZONTAL} />
)}
```

### 5. **Sistema Premium/Free** ✅

```typescript
// interface User (actualizado)
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  premium?: boolean; // ← NUEVO
  premium_expires?: string; // ← NUEVO
}
```

### 6. **Base de Datos Actualizada** ✅

```sql
-- database.sql (actualizado)
CREATE TABLE users (
  ...
  premium BOOLEAN DEFAULT 0,
  premium_expires TEXT DEFAULT NULL,
  ...
)
```

---

## 🎯 Cómo Funciona

```
Usuario Visits App
        ↓
┌─────────────────────────────────┐
│ ¿Es usuario premium?            │
├─────────────────────────────────┤
│ NO  → showAds = true  → 📺 Ver  │
│ SÍ  → showAds = false → ✓ Nada  │
└─────────────────────────────────┘
```

---

## 📍 Anuncios Implementados

### ✅ Footer (Ya Funciona)

```
┌─────────────────────────────────┐
│  Summary Cards                  │
│                                 │
│  Entity Cards Grid              │
│                                 │
├─────────────────────────────────┤
│  📺 ANUNCIO HORIZONTAL          │
│  (Google AdSense)               │
├─────────────────────────────────┤
│  Desarrollado por Anonimo-sys19 │
│  WhatsApp 62228271 +CR          │
└─────────────────────────────────┘
```

---

## 🚀 Próximos Pasos

### Paso 1: Obtener Ad Slots desde Google AdSense

```bash
1. Ir a: https://adsense.google.com
2. Login con tu cuenta Google
3. Menú → Anuncios → Crear por código
4. Copiar ad-slot (ej: 1234567890)
```

### Paso 2: Actualizar Slots en Config

```typescript
// lib/adsense-config.ts
export const AD_SLOTS = {
  FOOTER_HORIZONTAL: "TU_SLOT_AQUI", // ← REEMPLAZAR
  SIDEBAR_VERTICAL: "TU_SLOT_AQUI", // ← REEMPLAZAR
  CONTENT_HORIZONTAL: "TU_SLOT_AQUI", // ← REEMPLAZAR
  // ... etc
};
```

### Paso 3: Migrar Base de Datos (si ya tienes usuarios)

```bash
cd /home/ghostroot/Documentos/GIT/investpro-dashboard
chmod +x scripts/migrate-premium.sh
./scripts/migrate-premium.sh
```

O manualmente:

```bash
sqlite3 investpro.db < database.sql
```

### Paso 4: Agregar Más Anuncios (Opcional)

**En Dashboard.tsx:**

```typescript
"use client";

import { useAuth } from "@/components/auth-provider";
import { AdSense } from "@/components/adsense";
import { shouldShowAd, AD_SLOTS } from "@/lib/adsense-config";

export function Dashboard() {
  const { user } = useAuth();
  const showAds = shouldShowAd(user?.premium || false);

  return (
    <>
      {/* Summary Cards */}

      {showAds && (
        <AdSense adSlot={AD_SLOTS.DASHBOARD_AUTO} adFormat="auto" />
      )}

      {/* Entity Cards */}
    </>
  );
}
```

**En EntityDetail.tsx:**

```typescript
{showAds && (
  <AdSenseVertical adSlot={AD_SLOTS.ENTITY_DETAIL_VERTICAL} />
)}
```

**En LoginForm.tsx:**

```typescript
{showAds && (
  <AdSenseHorizontal adSlot={AD_SLOTS.LOGIN_HORIZONTAL} />
)}
```

---

## 📊 Archivos Modificados/Creados

```
✅ app/layout.tsx                    (Script agregado)
✅ components/adsense.tsx             (NUEVO - Componentes)
✅ components/footer.tsx              (Anuncios agregados)
✅ lib/adsense-config.ts              (NUEVO - Configuración)
✅ lib/db.ts                          (Interface User actualizada)
✅ components/auth-provider.tsx       (Interface User actualizada)
✅ database.sql                       (Columnas premium agregadas)
✅ scripts/migrate-premium.sh         (NUEVO - Script migración)
✅ ADSENSE_GUIDE.md                   (NUEVO - Documentación)
```

---

## 💰 Estrategia de Monetización

### Opción 1: Solo AdSense (Simple)

```
FREE (₡0/mes)
├─ Ver anuncios
├─ Funciones básicas
└─ Ad-supported

PREMIUM (₡4.99/mes)
├─ Sin anuncios
├─ Todas las features
└─ Soporte prioritario
```

### Opción 2: AdSense + Premium (Recomendado)

```
Combinación óptima:
├─ AdSense en usuarios free
├─ Premium limpio (sin anuncios)
├─ Ingresos pasivos (AdSense)
├─ Ingresos recurrentes (Premium)
└─ Win-win para ambos
```

---

## ✅ Compilación

```bash
✓ Compiled successfully in 8.7s
```

Todos los cambios compilaron sin errores ✅

---

## 🔧 Verificación

Para probar que funciona:

```bash
# Terminal
cd /home/ghostroot/Documentos/GIT/investpro-dashboard
pnpm dev

# En navegador
http://localhost:3000

# Login
email: test@example.com
password: 123456

# Deberías ver el anuncio en el footer
```

---

## ⚠️ Importante

1. **Reemplazar Ad Slots**
   - No olvides reemplazar los slots en `lib/adsense-config.ts`
   - Slots de prueba actualmente (no generan ingresos)

2. **Aprobación de Google**
   - Demora 24-48h para que Google apruebe los anuncios
   - Después de eso, empiezan a aparecer reales

3. **Reglamento Google AdSense**
   - ✅ Permitido: Mostrar anuncios en tu sitio
   - ❌ Prohibido: Clickear tus propios anuncios
   - ❌ Prohibido: Solicitar a otros que hagan click
   - ❌ Prohibido: Tráfico bot/fake

4. **Privacidad**
   - Google enseña anuncios basados en intereses del usuario
   - Los datos de usuarios se protegen según GDPR/CCPA

---

## 📈 Estimación de Ingresos

Con AdSense en un app de inversiones (público profesional):

```
Usuarios Activos | Vistas/Mes | CPM Promedio | Ingresos/Mes
─────────────────┼────────────┼──────────────┼──────────────
100              | ~500       | $5-10        | $2.50-5.00
500              | ~2,500     | $5-10        | $12.50-25.00
1,000            | ~5,000     | $5-10        | $25.00-50.00
5,000            | ~25,000    | $5-10        | $125.00-250.00
```

> **Nota:** CPM = dinero por 1000 impresiones
> Sitios sobre finanzas/inversión: $5-15 CPM

---

**¡Listo para monetizar! 🎉**

Tu app ya está preparada para:

- 📺 Google AdSense
- 💎 Premium ($4.99/mes)
- 💰 Mercado Pago (cuando lo implementemos)

¿Qué necesitas hacer ahora?

1. Obtener Ad Slots de Google
2. Reemplazar en config
3. Testing y deploy

¡Avísame cuando lo tengas listo! 🚀
