/**
 * Configuración de Google AdSense para InvestPro
 *
 * IMPORTANTE: Reemplaza los ad-slots con los tuyo propios
 * Obtén los ad-slots desde: Google AdSense Console → Anuncios → Crear por código
 */

// Tu ID de publicador (ya configurado en layout.tsx)
export const ADSENSE_PUBLISHER_ID = "ca-pub-9277496105560766";

// Ad Slots (IDs de tus anuncios - REEMPLAZA CON LOS TUYO)
export const AD_SLOTS = {
  // Footer horizontal
  FOOTER_HORIZONTAL: "1234567890",

  // Sidebar derecho
  SIDEBAR_VERTICAL: "0987654321",

  // Entre contenido
  CONTENT_HORIZONTAL: "5555555555",

  // Dashboard principal
  DASHBOARD_AUTO: "6666666666",

  // Página de login (antes de redireccionar)
  LOGIN_HORIZONTAL: "7777777777",

  // Entity Detail
  ENTITY_DETAIL_VERTICAL: "8888888888",

  // Bajo tabla de historia
  HISTORY_HORIZONTAL: "9999999999",

  // In-feed (entre items)
  INFEED_AUTO: "1111111111",
};

/**
 * Posiciones de anuncios recomendadas en el app:
 *
 * 1. FOOTER (FOOTER_HORIZONTAL)
 *    - Componente: <Footer />
 *    - Posición: Arriba del footer text
 *    - Formato: Horizontal responsive
 *
 * 2. SIDEBAR (SIDEBAR_VERTICAL)
 *    - Componente: <Sidebar /> (si existe)
 *    - Posición: Lateral derecho
 *    - Formato: Vertical 300x600
 *
 * 3. DASHBOARD (DASHBOARD_AUTO)
 *    - Componente: <Dashboard />
 *    - Posición: Entre summary cards y entity cards
 *    - Formato: Auto responsive
 *
 * 4. ENTITY DETAIL (ENTITY_DETAIL_VERTICAL)
 *    - Componente: <EntityDetail />
 *    - Posición: Lateral derecho
 *    - Formato: Vertical
 *
 * 5. HISTORY TABLE (HISTORY_HORIZONTAL)
 *    - Componente: <EntityDetail />
 *    - Posición: Abajo de tabla de historia
 *    - Formato: Horizontal responsive
 */

export const ADSENSE_CONFIG = {
  // Habilitar/deshabilitar anuncios globalmente
  enabled: process.env.NEXT_PUBLIC_ADSENSE_ENABLED !== "false",

  // Solo mostrar anuncios a usuarios no premium
  showToNonPremiumOnly: true,

  // Retraso antes de mostrar anuncios (ms)
  // Evita que bloqueadores de anuncios los detecten instantáneamente
  loadDelay: 1000,

  // Espaciado entre anuncios (para no mostrar muchos juntos)
  minSpacingBetweenAds: 3000, // 3000px

  // Colores personalizados (opcional)
  colors: {
    background: "#ffffff",
    border: "#cccccc",
    title: "#000000",
    text: "#333333",
    link: "#0066cc",
  },
};

/**
 * Hook para verificar si debe mostrar anuncio
 */
export function shouldShowAd(userPremium: boolean = false): boolean {
  if (!ADSENSE_CONFIG.enabled) return false;
  if (ADSENSE_CONFIG.showToNonPremiumOnly && userPremium) return false;
  return true;
}
