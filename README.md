# InvestPro Dashboard 💰

Una aplicación web moderna para gestionar y proyectar tus inversiones con cálculo de interés compuesto diario. Seguimiento multi-banco en tiempo real con análisis detallado de crecimiento financiero.

## ✨ Características Principales

- **Autenticación de Usuarios**: Registro e inicio de sesión seguros con JWT en cookies httpOnly
- **Gestión Multi-Banco**: Crea múltiples entidades para diferentes bancos o inversiones
- **Cálculo de Interés Compuesto Diario**: Capitalización precisa día a día (no mensual)
- **Aportes Flexibles**: Agrega, edita y elimina aportes en cualquier momento
- **Proyecciones a 12 Meses**: Visualiza el crecimiento proyectado de tus inversiones
- **Historial Mensual Real**: Seguimiento mes a mes con intereses y aportes acumulados
- **Gráficos Interactivos**: Visualización de tendencias con Recharts
- **Modo Oscuro**: Interfaz moderna con tema oscuro (Tailwind CSS)
- **Dashboard Responsivo**: Funciona perfectamente en escritorio, tablet y móvil
- **Aislamiento de Datos**: Cada usuario solo ve sus propias inversiones

## 🛠️ Tech Stack

### Frontend

- **React 19.2.3** - Framework UI
- **Next.js 16.1.6** - Framework full-stack con App Router
- **TypeScript** - Tipado estático
- **Tailwind CSS 3.4.17** - Utilidades de CSS
- **Shadcn/UI** - Componentes de UI reutilizables
- **Recharts** - Gráficos y visualizaciones
- **SWR** - Gestión de datos y caché
- **Lucide React** - Iconografía

### Backend

- **Next.js API Routes** - Endpoints RESTful
- **SQLite (sql.js)** - Base de datos en JavaScript
- **JWT** - Autenticación con tokens
- **SHA256** - Hashing de contraseñas

### DevOps

- **Turbopack** - Empaquetador ultra rápido
- **pnpm** - Gestor de paquetes

## 📋 Requisitos Previos

- Node.js >= 18.x
- pnpm >= 8.x (o npm/yarn)

## 🚀 Instalación

1. **Clonar el repositorio**

```bash
git clone https://github.com/tu-usuario/investpro-dashboard.git
cd investpro-dashboard
```

2. **Instalar dependencias**

```bash
pnpm install
```

3. **Inicializar base de datos**
   La base de datos se crea automáticamente en la primera ejecución.

```bash
pnpm run dev
```

4. **Abrir en navegador**

```
http://localhost:3000
```

## 📖 Guía de Uso

### 1. Registrarse

- Ve a la página de inicio y haz clic en "Registrarse"
- Completa tu nombre, apellido, email y contraseña
- Se guardará automáticamente con una sesión de 7 días

### 2. Crear una Entidad (Banco/Inversión)

- En el dashboard, haz clic en "Nueva Entidad"
- Ingresa:
  - Nombre del banco
  - Capital inicial
  - Tasa de interés anual (%)
  - Meta de ahorro (opcional)
  - Fecha de inicio

### 3. Agregar Aportes

- Dentro de una entidad, haz clic en "Nuevo Aporte"
- Ingresa:
  - Monto del aporte
  - Fecha (si no especificas, usa la actual)
  - Descripción (opcional)

### 4. Editar/Eliminar Aportes

- En la sección "Aportes Registrados", pasa el mouse sobre un aporte
- Aparecerán los botones de editar (lápiz) y eliminar (papelera)

### 5. Analizar Proyecciones

- El gráfico muestra la proyección a 12 meses
- La tabla detalla mes a mes con intereses y saldo
- Visualiza tu progreso hacia la meta de ahorro

## 🧮 Cálculos

### Interés Compuesto Diario

El sistema calcula interés compuesto **día a día**, no mensual:

```
Tasa Diaria = Tasa Anual / 365
Balance Diario = Balance Anterior × (1 + Tasa Diaria / 100)
```

**Ejemplo:**

- Capital: ₡100,000
- Tasa anual: 5.5%
- Tasa diaria: 0.015068%
- Día 1: 100,000 × 1.00015068 = 100,150.68
- Día 2: 100,150.68 × 1.00015068 = 100,301.37
- ... (y así cada día)

### Aportes

Los aportes se suman al balance en la fecha especificada y comienzan a generar interés al día siguiente.

## 📁 Estructura del Proyecto

```
investpro-dashboard/
├── app/
│   ├── api/
│   │   ├── auth/              # Endpoints de autenticación
│   │   │   ├── register/
│   │   │   ├── login/
│   │   │   ├── logout/
│   │   │   └── me/
│   │   ├── contributions/      # CRUD de aportes
│   │   └── entities/           # CRUD de inversiones
│   ├── dashboard/              # Panel principal (protegido)
│   ├── login/                  # Página de inicio de sesión
│   ├── register/               # Página de registro
│   ├── layout.tsx
│   ├── page.tsx               # Landing page
│   └── globals.css
├── components/
│   ├── add-contribution-modal.tsx      # Modal para nuevo aporte
│   ├── add-entity-modal.tsx            # Modal para nueva entidad
│   ├── auth-provider.tsx               # Context de autenticación
│   ├── dashboard.tsx                   # Componente principal
│   ├── edit-contribution-modal.tsx     # Modal para editar aporte
│   ├── entity-card.tsx                 # Tarjeta de entidad
│   ├── entity-detail.tsx               # Detalle de inversión
│   ├── growth-chart.tsx                # Gráfico de proyección
│   ├── header.tsx                      # Encabezado con usuario
│   ├── login-form.tsx                  # Formulario de login
│   ├── register-form.tsx               # Formulario de registro
│   ├── summary-cards.tsx               # Tarjetas de resumen
│   └── ui/                             # Componentes Shadcn/UI
├── lib/
│   ├── auth.ts                 # Funciones de autenticación
│   ├── calculations.ts         # Lógica de cálculos financieros
│   ├── db.ts                   # Inicialización y helpers BD
│   └── utils.ts
├── data/
│   └── investpro.db           # Base de datos SQLite (auto-generada)
├── scripts/
│   └── reset-db.js            # Script para resetear BD
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.mjs
└── README.md
```

## 🔐 Autenticación

### Registro

```bash
POST /api/auth/register
{
  "email": "user@example.com",
  "password": "miContraseña123",
  "firstName": "Juan",
  "lastName": "Pérez"
}
```

### Login

```bash
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "miContraseña123"
}
```

### Verificar Sesión

```bash
GET /api/auth/me
```

### Logout

```bash
POST /api/auth/logout
```

## 📡 API Endpoints

### Entidades

```
GET    /api/entities           # Obtener todas las entidades del usuario
POST   /api/entities           # Crear nueva entidad
GET    /api/entities/[id]      # Obtener detalle de entidad
DELETE /api/entities/[id]      # Eliminar entidad
```

### Aportes

```
POST   /api/contributions      # Crear nuevo aporte
PUT    /api/contributions      # Editar aporte
DELETE /api/contributions?id=  # Eliminar aporte
```

## 🎨 Variables de Tema

El proyecto usa CSS variables para el tema. Edita `app/globals.css`:

```css
--primary: 32 194 154 /* Emerald-500 */ --accent: 116 192 252 /* Blue-400 */
  --background: 9 9 11 /* Gris oscuro */ --foreground: 250 250 250
  /* Texto blanco */ --muted-foreground: 161 140 200;
```

## 🧪 Desarrollo

### Comandos Disponibles

```bash
# Iniciar servidor de desarrollo
pnpm dev

# Build para producción
pnpm build

# Iniciar servidor de producción
pnpm start

# Linter
pnpm lint

# Resetear base de datos
node scripts/reset-db.js
```

## 📊 Características Avanzadas

### Multi-Usuario

- Cada usuario tiene datos completamente aislados
- Las entidades y aportes se filtran por `user_id`
- Las sesiones expiran en 7 días

### Proyecciones Inteligentes

- Calcula 12 meses futuros con capitalización diaria
- Incluye aportes existentes en los cálculos
- Muestra intereses ganados por mes

### Historial Real

- Registra balance y intereses por cada mes completado
- Basado en datos reales con aportes históricos
- Permite comparar proyecciones vs realidad

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Haz un Fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo licencia MIT. Ver `LICENSE` para más detalles.

## 👨‍💻 Créditos

**Desarrollador**: [Anonimo-sys19](https://github.com/anonimo-sys19)  
**Contacto**: WhatsApp 62228271 +CR

### Inspiración

Inspirado en aplicaciones de gestión financiera como MultiMoney Smart, con enfoque en precisión de cálculos y experiencia de usuario moderna.

## 🐛 Reporte de Bugs

Si encuentras un bug, por favor abre un [Issue](https://github.com/tu-usuario/investpro-dashboard/issues) con:

- Descripción del problema
- Pasos para reproducir
- Comportamiento esperado
- Comportamiento actual
- Screenshots (si aplica)

## 🚀 Roadmap

- [ ] Exportar datos a CSV/PDF
- [ ] Gráficos de comparación entre inversiones
- [ ] Notificaciones de metas alcanzadas
- [ ] Soporte para múltiples monedas
- [ ] API pública para integraciones
- [ ] Estadísticas avanzadas y análisis
- [ ] Autenticación con OAuth (Google, GitHub)
- [ ] App móvil nativa

## 📧 Soporte

Para soporte, contacta a través de:

- WhatsApp: +506 62228271
- Email: (agregar email cuando esté disponible)

---

**Última actualización**: 15 de febrero de 2026

⭐ Si te gusta el proyecto, considera darle una estrella en GitHub
