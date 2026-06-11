# 🚀 Sistema Turístico de Bolivia - Fullstack Completo

## ¿Qué tienes?

✅ **Backend NestJS** - API REST profesional
✅ **Frontend React** - Interfaz moderna
✅ **PostgreSQL** - Base de datos relacional
✅ **Docker Compose** - Orquestación lista

## 🎯 Inicio Rápido (5 minutos)

### Con Docker (Recomendado)

```bash
# 1. En la raíz del proyecto
docker-compose up -d

# 2. Esperar 30 segundos
sleep 30

# 3. Acceder
Frontend:  http://localhost:5173
Backend:   http://localhost:3000/api
Base datos: localhost:5432
```

### Sin Docker

```bash
# Terminal 1 - Backend
cd backend
npm install
cp .env.example .env
npm run start:dev

# Terminal 2 - Frontend
cd frontend
npm install
npm run dev

# Terminal 3 - PostgreSQL (si no lo tienes)
# Instalar PostgreSQL e inicializar con scripts/init.sql
```

## 📊 Flujo de Funcionamiento

```
Usuario abre navegador
    ↓
http://localhost:5173
    ↓
Frontend carga (React)
    ↓
Usuario hace login
    ↓
Frontend → POST /api/auth/login → Backend
    ↓
Backend valida credenciales en PostgreSQL
    ↓
Backend devuelve JWT token
    ↓
Frontend guarda token en localStorage
    ↓
Frontend usa token en headers para futuras requests
    ↓
Usuario accede a destinos, proveedores, reservas
    ↓
Frontend → GET /api/destinations → Backend
    ↓
Backend → SELECT * FROM destination → PostgreSQL
    ↓
Backend devuelve datos
    ↓
Frontend renderiza datos en tabla/componentes
```

## 🔐 Credenciales

```
Email: admin@bolivia-tours.com
Password: Admin123!@
```

## 📋 Endpoints del Backend

### Auth
```
POST /api/auth/login
POST /api/auth/register
GET /api/auth/profile
GET /api/auth/captcha
```

### Destinos
```
GET /api/destinations
POST /api/destinations
PATCH /api/destinations/:id
DELETE /api/destinations/:id
```

### Proveedores
```
GET /api/providers
POST /api/providers
PATCH /api/providers/:id
DELETE /api/providers/:id
```

### Reservas
```
GET /api/bookings
POST /api/bookings
PATCH /api/bookings/:id
DELETE /api/bookings/:id
POST /api/bookings/:id/confirm
```

### Reportes
```
GET /api/reports/statistics
GET /api/reports/destinations/pdf
GET /api/reports/bookings/pdf
```

### Health
```
GET /api/health
```

## 🎮 Cómo Funciona

### 1. Login
- Usuario ingresa email y contraseña
- Frontend envía POST /api/auth/login
- Backend valida contra PostgreSQL
- Backend devuelve JWT token
- Frontend almacena token

### 2. CRUD Destinos
- Usuario hace clic en "Nuevo Destino"
- Se abre modal con formulario
- Usuario completa datos y hace clic "Guardar"
- Frontend envía POST /api/destinations con datos
- Backend inserta en PostgreSQL
- Backend devuelve destino creado
- Frontend agrega a lista y actualiza UI

### 3. CRUD Proveedores
- Mismo flujo que destinos
- POST /api/providers
- PATCH /api/providers/:id
- DELETE /api/providers/:id

### 4. CRUD Reservas
- Usuario completa formulario de reserva
- Frontend envía POST /api/bookings
- Backend crea en PostgreSQL
- Opción: Generar PDF de recibo
- Frontend puede descargar PDF

## 🔌 Conexión Backend-Frontend

### Frontend ApiService
```typescript
import { apiService } from './api/ApiService';

// Login
await apiService.login(email, password);

// Obtener destinos
const destinations = await apiService.getDestinations();

// Crear destino
await apiService.createDestination({ name, region, ... });

// Actualizar
await apiService.updateDestination(id, data);

// Eliminar
await apiService.deleteDestination(id);
```

### Backend API Base URL
```
http://localhost:3000/api
```

## 📁 Estructura

```
fullstack-complete/
├── backend/               NestJS API
│   ├── src/
│   ├── package.json
│   ├── Dockerfile
│   └── docker-compose.yml
├── frontend/              React App
│   ├── src/
│   │   ├── api/ApiService.ts    ← Conexión API
│   │   ├── AuthContext.tsx      ← Usa API
│   │   ├── DataContext.tsx      ← Usa API
│   │   └── [componentes]
│   ├── package.json
│   ├── Dockerfile.frontend
│   └── vite.config.ts
└── docker-compose.yml     ← Orquesta todo
```

## 🐛 Troubleshooting

### "Cannot connect to backend"
1. Verificar que backend está corriendo: `curl http://localhost:3000/api/health`
2. Verificar CORS en backend
3. Verificar VITE_API_URL en frontend

### "Port already in use"
```bash
# Detener contenedores
docker-compose down

# O matar proceso específico
lsof -i :5173    # Frontend
lsof -i :3000    # Backend
lsof -i :5432    # PostgreSQL
```

### "Database connection error"
```bash
# Ver logs
docker-compose logs postgres

# Verificar PostgreSQL está corriendo
docker-compose ps
```

### "Network error"
1. Asegurar que docker-compose usa misma red (bolivia_network)
2. Verificar que servicios se conocen por nombre (postgres, backend)
3. Ver logs: `docker-compose logs backend`

## 🔄 Actualizar el código

```bash
# Cambios en backend
docker-compose restart backend

# Cambios en frontend
docker-compose restart frontend

# Ambos
docker-compose up -d --build
```

## 📊 Ver Logs

```bash
# Todos
docker-compose logs -f

# Backend
docker-compose logs -f backend

# Frontend
docker-compose logs -f frontend

# PostgreSQL
docker-compose logs -f postgres
```

## 🧪 Prueba Rápida

```bash
# 1. Verificar Backend
curl http://localhost:3000/api/health

# 2. Verificar Frontend
curl http://localhost:5173

# 3. Verificar Base de datos
psql -h localhost -U bolivia_user -d bolivia_tourism_db

# 4. Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@bolivia-tours.com","password":"Admin123!@"}'
```

## 🎯 Características Funcionales

✓ Login/Register con JWT
✓ CRUD Destinos (Create, Read, Update, Delete)
✓ CRUD Proveedores (Create, Read, Update, Delete)
✓ CRUD Reservas (Create, Read, Update, Delete)
✓ Generación de PDF
✓ Auditoría de acceso
✓ Datos persistentes en PostgreSQL
✓ Frontend y Backend sincronizados
✓ Manejo de errores robusto
✓ Validaciones en ambos lados

## ✨ Sistema Completo

Has recibido un sistema fullstack profesional:
- Backend robusto en NestJS
- Frontend moderno en React
- Base de datos relacional
- Autenticación segura
- Orquestación con Docker
- Documentación completa

¡Listo para producción! 🚀

## 📞 Soporte

Ver README.md en carpeta backend/ y frontend/ para información detallada.

---

**Versión:** 1.0.0
**Estado:** ✅ Production Ready
**Última actualización:** Abril 2026
