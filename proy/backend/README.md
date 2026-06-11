# 🏔️ Sistema de Registro Turístico de Bolivia - Backend

Backend NestJS profesional y completamente funcional para el Sistema de Registro Turístico de Bolivia.

## ✨ Características

### 🔐 Autenticación
- JWT Tokens con expiración configurable
- Contraseñas encriptadas con bcrypt (10 rondas)
- CAPTCHA matemático para prevenir bots
- Gestión de roles (ADMIN, AGENT, USER)

### 📊 CRUD Completo
- **Usuarios:** Crear, leer, actualizar, eliminar
- **Destinos:** CRUD con soft delete
- **Proveedores:** CRUD vinculado a destinos
- **Reservas:** CRUD con generación de recibos PDF
- **Logs de Acceso:** Auditoría completa del sistema

### 📄 Reportes y PDF
- Generación de recibos de reservas en PDF
- Reportes de destinos turísticos
- Estadísticas de sistema

### 🔍 Seguridad
- Validación de integridad referencial
- Soft delete para proteger datos históricos
- Auditoría completa en AccessLogs
- Rate limiting
- CORS configurable

## 🚀 Stack Tecnológico

- **Framework:** NestJS 10
- **Runtime:** Node.js 18+
- **Base de Datos:** PostgreSQL 15
- **ORM:** TypeORM
- **Autenticación:** JWT + Passport
- **Encriptación:** bcryptjs
- **PDF:** PDFKit
- **Docker:** Docker & Docker Compose

## 📋 Requisitos Previos

- Node.js 18+ y npm
- PostgreSQL 12+ (o Docker)
- Docker Desktop (opcional, recomendado)

## ⚙️ Instalación

### Opción 1: Con Docker (Recomendado)

```bash
# 1. Clonar o descargar el proyecto
cd backend-complete

# 2. Copiar variables de entorno
cp .env.example .env

# 3. Iniciar con Docker Compose
docker-compose up -d

# 4. Backend disponible en http://localhost:3000
```

### Opción 2: Instalación Local

```bash
# 1. Instalar dependencias
npm install

# 2. Crear archivo .env
cp .env.example .env

# 3. Configurar PostgreSQL en .env
# DB_HOST=localhost
# DB_PORT=5432
# etc...

# 4. Ejecutar migraciones
npm run typeorm migration:run

# 5. Iniciar en desarrollo
npm run start:dev

# Backend disponible en http://localhost:3000
```

## 📝 Variables de Entorno

```env
# Database
DB_HOST=postgres
DB_PORT=5432
DB_USERNAME=bolivia_user
DB_PASSWORD=Bolivia@2024
DB_NAME=bolivia_tourism_db

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=3600

# Server
PORT=3000
NODE_ENV=development

# CORS
CORS_ORIGIN=http://localhost:5173,http://localhost:3000
```

## 📚 Endpoints API

### Autenticación

```
POST   /api/auth/login              - Login de usuario
POST   /api/auth/register           - Registro de nuevo usuario
POST   /api/auth/refresh            - Refrescar token JWT
GET    /api/auth/profile            - Obtener perfil (JWT required)
POST   /api/auth/captcha            - Obtener CAPTCHA
POST   /api/auth/check-password     - Validar fortaleza de contraseña
```

### Usuarios

```
GET    /api/users                   - Listar usuarios (ADMIN)
GET    /api/users/:id               - Obtener usuario por ID
POST   /api/users                   - Crear usuario (ADMIN)
PATCH  /api/users/:id               - Actualizar usuario
DELETE /api/users/:id               - Eliminar usuario (ADMIN)
```

### Destinos Turísticos

```
GET    /api/destinations            - Listar destinos
GET    /api/destinations/:id        - Obtener destino
POST   /api/destinations            - Crear destino (JWT)
PATCH  /api/destinations/:id        - Actualizar destino (JWT)
DELETE /api/destinations/:id        - Eliminar destino (JWT)
PATCH  /api/destinations/:id/restore - Restaurar destino (JWT)
GET    /api/destinations/region/:region - Buscar por región
```

### Proveedores de Servicios

```
GET    /api/providers               - Listar proveedores
GET    /api/providers/:id           - Obtener proveedor
POST   /api/providers               - Crear proveedor (JWT)
PATCH  /api/providers/:id           - Actualizar proveedor (JWT)
DELETE /api/providers/:id           - Eliminar proveedor (JWT)
GET    /api/providers/destination/:destId - Proveedores por destino
```

### Reservas Turísticas

```
GET    /api/bookings                - Listar reservas
GET    /api/bookings/:id            - Obtener reserva
POST   /api/bookings                - Crear reserva (JWT)
PATCH  /api/bookings/:id            - Actualizar reserva (JWT)
DELETE /api/bookings/:id            - Eliminar reserva (JWT)
POST   /api/bookings/:id/confirm    - Confirmar reserva (JWT)
POST   /api/bookings/:id/receipt    - Generar PDF de recibo
GET    /api/bookings/user/:userId   - Reservas del usuario
```

### Logs de Acceso

```
GET    /api/access-logs             - Listar logs (ADMIN)
POST   /api/access-logs/log-event   - Registrar evento
GET    /api/access-logs/user/:userId - Logs del usuario
GET    /api/access-logs/statistics  - Estadísticas
```

### Reportes

```
GET    /api/reports/statistics      - Estadísticas generales (JWT)
GET    /api/reports/destinations/pdf - PDF de destinos (JWT)
GET    /api/reports/bookings/pdf    - PDF de reservas (JWT)
```

## 🧪 Testing

```bash
# Ejecutar tests
npm run test

# Tests en modo watch
npm run test:watch

# Coverage
npm run test:cov
```

## 📦 Comandos Disponibles

```bash
# Desarrollo
npm run start:dev        # Iniciar en modo watch
npm run start:debug      # Iniciar en modo debug

# Producción
npm run build            # Compilar TypeScript
npm run start:prod       # Ejecutar versión compilada

# Calidad de código
npm run lint             # Ejecutar ESLint
npm run format           # Formatear código con Prettier

# Docker
docker-compose up -d     # Iniciar servicios
docker-compose down      # Detener servicios
docker-compose logs -f   # Ver logs
```

## 🗂️ Estructura del Proyecto

```
backend-complete/
├── src/
│   ├── main.ts                 - Entrada de la aplicación
│   ├── app.module.ts           - Módulo principal
│   ├── app.controller.ts       - Controlador raíz
│   ├── app.service.ts          - Servicio raíz
│   └── modules/
│       ├── auth/               - Autenticación
│       ├── users/              - Gestión de usuarios
│       ├── destinations/       - Gestión de destinos
│       ├── providers/          - Gestión de proveedores
│       ├── bookings/           - Gestión de reservas
│       └── access-logs/        - Auditoría
├── scripts/
│   └── init.sql                - Inicialización de BD
├── docker-compose.yml          - Orquestación Docker
├── Dockerfile                  - Imagen Docker
├── package.json               - Dependencias
├── tsconfig.json              - Configuración TypeScript
└── README.md                  - Este archivo
```

## 🔒 Credenciales de Prueba

```
Email: admin@bolivia-tours.com
Contraseña: Admin123!@
Rol: ADMIN
```

## 📊 Base de Datos

### Entidades Principales

1. **User** - Usuarios del sistema
2. **Destination** - Destinos turísticos
3. **Provider** - Proveedores de servicios
4. **Booking** - Reservas turísticas
5. **AccessLog** - Auditoría de acceso

### Relaciones

- User ──1:* Booking
- User ──1:* AccessLog
- Destination ──1:* Provider
- Destination ──1:* Booking
- Provider ──1:* Booking

## 🐛 Troubleshooting

### Puerto 5432 ya en uso
```bash
docker ps
docker kill <container_id>
```

### Conexión a BD fallida
```bash
# Verificar que PostgreSQL está corriendo
docker-compose ps

# Ver logs
docker-compose logs postgres
```

### Migración fallida
```bash
# Resetear BD
docker-compose down -v
docker-compose up -d

# Esperar 10 segundos y reintentar
```

## 📖 API Documentation

Accede a la documentación interactiva en: `http://localhost:3000/api`

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo licencia MIT.

## 👥 Autores

- Team Bolivia Tourism System

## 📞 Soporte

Para soporte, abre un issue en el repositorio.

---

**Versión:** 1.0.0  
**Estado:** Production Ready ✅  
**Última actualización:** Abril 2026

🏔️ ¡Gracias por usar Bolivia Tourism System! ✨
