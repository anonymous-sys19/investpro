# 📺 Google AdSense - Guía de Implementación

## ✅ Qué Se Agregó

### 1. **Script Global** (`app/layout.tsx`)

```typescript
<Script
  async
  src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9277496105560766"
  crossOrigin="anonymous"
  strategy="afterInteractive"
/>
```

### 2. **Componentes Reutilizables** (`components/adsense.tsx`)

- `<AdSense />` - Componente base flexible
- `<AdSenseHorizontal />` - Anuncios horizontales
- `<AdSenseSquare />` - Anuncios cuadrados
- `<AdSenseVertical />` - Anuncios verticales

### 3. **Configuración Centralizada** (`lib/adsense-config.ts`)

```typescript
AD_SLOTS = {
  FOOTER_HORIZONTAL: "1234567890",
  SIDEBAR_VERTICAL: "0987654321",
  CONTENT_HORIZONTAL: "5555555555",
  // ... más slots
};
```

### 4. **Footer Actualizado** (`components/footer.tsx`)

- Ahora muestra anuncios horizontales
- Solo a usuarios NO premium
- Responsive y bien espaciado

---

## 🔧 Cómo Funciona

### Step 1: Obtener tus Ad Slots

```bash
1. Ir a: https://adsense.google.com
2. Login con tu cuenta Google
3. Menú → Anuncios → Crear por código
4. Copiar el ad-slot (número de 10 dígitos)
```

### Step 2: Actualizar Config

En `lib/adsense-config.ts`:

```typescript
export const AD_SLOTS = {
  FOOTER_HORIZONTAL: "TU_SLOT_AQUI", // Cambiar esto
  SIDEBAR_VERTICAL: "TU_SLOT_AQUI",
  // ... etc
};
```

### Step 3: Usar en Componentes

```typescript
// En cualquier componente
"use client";

import { AdSenseHorizontal } from "@/components/adsense";
import { AD_SLOTS, shouldShowAd } from "@/lib/adsense-config";
import { useAuth } from "@/components/auth-provider";

export function MiComponente() {
  const { user } = useAuth();
  const showAds = shouldShowAd(user?.premium || false);

  return (
    <>
      {showAds && (
        <AdSenseHorizontal adSlot={AD_SLOTS.CONTENT_HORIZONTAL} />
      )}
      {/* Resto del contenido */}
    </>
  );
}
```

---

## 📍 Posiciones Recomendadas de Anuncios

### ✅ **Dashboard Principal**

```
┌─────────────────────────────────────┐
│  Summary Cards                      │
├─────────────────────────────────────┤
│                                     │
│  📺 ANUNCIO HORIZONTAL (Auto)       │
│                                     │
├─────────────────────────────────────┤
│  Entity Cards Grid                  │
└─────────────────────────────────────┘
```

**Uso:**

```typescript
{showAds && <AdSense adSlot={AD_SLOTS.DASHBOARD_AUTO} />}
```

### ✅ **Footer**

```
┌─────────────────────────────────────┐
│  📺 ANUNCIO HORIZONTAL              │
├─────────────────────────────────────┤
│  Desarrollado por Anonimo-sys19     │
│  Contacto: WhatsApp...              │
└─────────────────────────────────────┘
```

**Ya implementado en footer.tsx**

### ✅ **Entity Detail (Lado Derecho)**

```
┌───────────────────┬──────────────┐
│  Balance Info     │  📺 Vertical  │
│  Goal Progress    │   Ad          │
│  Stats Grid       │  (300x600)    │
│  Growth Chart     │               │
│  History Table    │               │
└───────────────────┴──────────────┘
```

### ✅ **Login Page (Antes de Redireccionar)**

```
┌─────────────────────────────────────┐
│                                     │
│    Login Form                       │
│                                     │
├─────────────────────────────────────┤
│  📺 ANUNCIO HORIZONTAL              │
│                                     │
└─────────────────────────────────────┘
```

---

## 🎯 Estrategia Premium vs Free

### Usuario FREE (No Premium)

```
✅ Ve anuncios en:
├─ Footer
├─ Dashboard (entre contenido)
├─ Entity Detail
└─ Login page
```

### Usuario PREMIUM ($4.99/mes)

```
❌ No ve anuncios en ningún lado
├─ Sin footer ads
├─ Sin dashboard ads
└─ Experiencia limpia
```

**Lógica:**

```typescript
const showAds = shouldShowAd(user?.premium || false);
// Si user.premium === true → showAds = false
// Si user.premium === false → showAds = true
```

---

## 🚀 Próximos Pasos

### 1. Obtener Ad Slots desde Google AdSense

```bash
Ir a: https://adsense.google.com/adsense/login
Crear ads (obtener slots)
```

### 2. Reemplazar Ad Slots en Config

```typescript
// lib/adsense-config.ts
export const AD_SLOTS = {
  FOOTER_HORIZONTAL: "123456789", // ← TU SLOT
  SIDEBAR_VERTICAL: "987654321", // ← TU SLOT
  // ... etc
};
```

### 3. Agregar Anuncios a Más Componentes

**En Dashboard.tsx:**

```typescript
{showAds && <AdSense adSlot={AD_SLOTS.DASHBOARD_AUTO} />}
```

**En EntityDetail.tsx:**

```typescript
{showAds && <AdSenseVertical adSlot={AD_SLOTS.ENTITY_DETAIL_VERTICAL} />}
```

**En LoginForm.tsx:**

```typescript
{showAds && <AdSenseHorizontal adSlot={AD_SLOTS.LOGIN_HORIZONTAL} />}
```

---

## 📊 Estimaciones de Ingresos

Con Google AdSense en un app de inversión (profesional):

```
Usuarios Mensuales | CPM Promedio | Ingresos Mensuales
──────────────────┼──────────────┼──────────────────
100 usuarios       | $5-10        | $50-100
500 usuarios       | $5-10        | $250-500
1000 usuarios      | $5-10        | $500-1,000
5000 usuarios      | $5-10        | $2,500-5,000
```

**Nota:** CPM (Cost Per Mille) = dinero por 1000 impresiones

- Sitios en español: $2-8 CPM
- Sitios sobre dinero/inversión: $5-15 CPM

---

## ⚠️ Reglas Importantes de Google AdSense

### ✅ **Permitido**

- Mostrar anuncios en tu web
- Personalizar colores de anuncios
- Vender premium para quitar anuncios
- Mostrar múltiples anuncios (máx 3 por página)

### ❌ **Prohibido**

- Click fraud (clickear tus propios anuncios)
- Solicitar a otros que hagan click
- Anuncios clickeables por script
- Tráfico bot/fake
- Incumplimiento de políticas de Google

---

## 🔒 Seguridad

El código está configurado para:

- ✅ No ejecutar ads script hasta que Next.js esté listo
- ✅ Usar `strategy="afterInteractive"` (no bloquea el render)
- ✅ Validación de usuario premium antes de mostrar
- ✅ Try/catch para manejar errores de script
- ✅ CORS permitido (crossOrigin="anonymous")

---

## 📝 Resumen de Archivos

| Archivo                  | Cambio                               |
| ------------------------ | ------------------------------------ |
| `app/layout.tsx`         | ✅ Script de AdSense añadido         |
| `components/adsense.tsx` | ✅ Componentes reutilizables creados |
| `lib/adsense-config.ts`  | ✅ Configuración centralizada        |
| `components/footer.tsx`  | ✅ Footer con anuncios               |

---

## 🎬 Demo - Cómo Verlo en Acción

```bash
1. pnpm dev
2. Ir a: http://localhost:3000
3. Login como usuario NO premium
4. Ver anuncio en footer
5. Ir a settings → Hacer premium
6. Anuncios desaparecen ✅
```

---

## 💡 Tips

1. **Rotación de slots:** No uses el mismo slot en muchos lugares (Google puede penalizar)
2. **Mobile first:** Los anuncios deben verse bien en móvil
3. **Tiempo de aprobación:** Google demora ~24-48h para aprobar anuncios
4. **Presupuesto:** Ganan dinero real usuarios ven anuncios

---

**¡Listo para monetizar tu app! 🎉**

Si necesitas agregar anuncios en más componentes, solo avísame y lo hacemos juntos.
