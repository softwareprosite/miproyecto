# 🏔️ Bolivia Tourism Frontend - CRUD + PDF

Frontend React completamente funcional con CRUD completo y generación de PDF de recibos.

## ✨ CARACTERÍSTICAS

✅ **Autenticación**
- Login con CAPTCHA
- Registro con validación

✅ **CRUD COMPLETO**
- Destinos: Crear, leer, editar, eliminar
- Proveedores: Crear, leer, editar, eliminar
- Reservas: Crear, leer, editar, eliminar
- Formularios modales elegantes
- Validaciones en tiempo real

✅ **PDF - Recibos Turísticos**
- Generar recibo PDF de reserva
- Información completa del turista
- Detalles de la reserva
- Formateo profesional
- Descarga automática

✅ **Dashboard**
- Estadísticas en tiempo real
- Gráficos interactivos (recharts)
- 5 destinos 
- 3 proveedores
- 2 reservas

✅ **Diseño**
- Responsive (desktop, tablet, mobile)
- Colores modernos
- Iconos lucide-react
- Totalmente funcional

## 🚀 INSTALACIÓN

```bash
npm install
npm run dev
```

Accede a: http://localhost:5173

## 🔐 Credenciales

```
Email: admin@bolivia-tours.com
Contraseña: Admin123!@
CAPTCHA: Suma simple
```

## 📋 FUNCIONALIDADES CRUD

### Dashboard - Destinos
- ✅ Ver tabla de destinos
- ✅ Botón "Nuevo Destino"
- ✅ Modal para crear destino
- ✅ Editar destino (botón Edit)
- ✅ Eliminar destino (botón Delete)

### Bookings - Reservas
- ✅ Ver tabla de reservas
- ✅ Botón "Nueva Reserva"
- ✅ Modal para crear reserva
- ✅ Editar reserva
- ✅ Eliminar reserva
- ✅ **Botón PDF para generar recibo**

### Destinations
- ✅ Grid de destinos
- ✅ Crear nuevo destino
- ✅ Editar destino
- ✅ Eliminar destino

### Providers
- ✅ Tabla de proveedores
- ✅ Crear proveedor
- ✅ Editar proveedor
- ✅ Eliminar proveedor

## 📄 GENERACIÓN DE PDF

Haz clic en el botón **PDF** en cualquier reserva para generar:
- Recibo profesional con logo
- Datos del turista
- Detalles de la reserva
- Fechas y precio
- Términos y condiciones
- Descarga automática

## 📦 ARCHIVOS INCLUIDOS

```
src/
├── App.tsx                  ← Aplicación principal
├── AuthContext.tsx          ← Autenticación
├── ProtectedRoute.tsx       ← Rutas protegidas
├── Navigation.tsx           ← Menú
├── Login.tsx                ← Login
├── Register.tsx             ← Registro
├── Dashboard.tsx            ← Dashboard + CRUD destinos
├── Destinations.tsx         ← CRUD destinos
├── Providers.tsx            ← CRUD proveedores
├── Bookings.tsx             ← CRUD reservas + PDF
├── Reports.tsx              ← Gráficos
├── PDFService.ts            ← Generación PDF
├── main.tsx                 ← Entry point
├── index.css                ← Estilos globales
└── App.css                  ← Estilos app
```

## 🎯 BOTONES FUNCIONALES

| Página | Botones |
|--------|---------|
| Dashboard | Nueva Reserva, Editar, Eliminar |
| Destinos | Nuevo Destino, Editar, Eliminar |
| Proveedores | Nuevo Proveedor, Editar, Eliminar |
| Bookings | Nueva Reserva, **Generar PDF**, Editar, Eliminar |
| Reports | Ver gráficos interactivos |

## 🖨️ EJEMPLO DE PDF

El PDF contiene:
- Encabezado "BOLIVIA TOURS"
- Título "RECIBO DE RESERVA TURÍSTICA"
- Referencia y fecha
- Información del turista (nombre, email)
- Detalles de reserva (destino, proveedor, fechas)
- Número de huéspedes y precio
- Estado confirmado
- Términos y condiciones
- Footer con contacto

## 📱 RESPONSIVE

- ✅ Desktop (1200px+)
- ✅ Tablet (768px - 1199px)
- ✅ Mobile (< 768px)

## 🛠️ STACK

- React 18.2
- React Router v6
- TypeScript
- Vite
- Recharts (gráficos)
- Lucide Icons
- jsPDF (PDF)
- html2canvas (PDF)
- CSS puro

## 🚀 BUILD PARA PRODUCCIÓN

```bash
npm run build
```

## 📊 DATOS INCLUIDOS

- 5 Destinos turísticos
- 3+ Proveedores de servicios
- 2 Reservas de ejemplo
- Gráficos con datos realistas

## ✅ CHECKLIST

- [x] Login funcional
- [x] CRUD Destinos
- [x] CRUD Proveedores
- [x] CRUD Reservas
- [x] Generar PDF de recibos
- [x] Dashboard con estadísticas
- [x] Gráficos interactivos
- [x] Navegación completa
- [x] Responsive design
- [x] Validaciones
- [x] Botones funcionales
- [x] Modales para formularios
- [x] Todas las páginas

## 📞 SOPORTE

Si tienes problemas:
1. Abre consola (F12)
2. Verifica credenciales
3. Intenta limpiar cache
4. Reinicia npm

¡Disfruta tu sistema turístico! 🏔️✨

Versión: 1.0.0
Status: Production Ready ✅
