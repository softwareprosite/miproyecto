# 🏗️ Arquitectura del Sistema

## Descripción General

El backend utiliza una arquitectura modular basada en NestJS siguiendo los principios de:
- SOLID
- Clean Architecture
- Domain-Driven Design

## Capas

```
┌─────────────────────────────────────┐
│        Controllers (API HTTP)       │  - Manejan requests/responses
├─────────────────────────────────────┤
│          Services (Lógica)          │  - Lógica de negocio
├─────────────────────────────────────┤
│         Repositories (DAO)          │  - Acceso a datos
├─────────────────────────────────────┤
│         Database (TypeORM)          │  - PostgreSQL
└─────────────────────────────────────┘
```

## Módulos

### 1. Auth Module
- JWT Strategy
- Password hashing (bcryptjs)
- CAPTCHA validation
- Role-based access control

### 2. Users Module
- User CRUD
- Profile management
- Password management

### 3. Destinations Module
- Destination CRUD
- Soft delete
- Filtering by region/category
- Image management

### 4. Providers Module
- Provider CRUD
- Rating system
- Provider-Destination relationship
- Search functionality

### 5. Bookings Module
- Booking CRUD
- Status management (PENDING, CONFIRMED, CANCELLED)
- PDF receipt generation
- Email notifications

### 6. AccessLogs Module
- Event logging
- User activity tracking
- Audit trail
- Security monitoring

## Flujos de Datos

### Flujo de Autenticación
```
Request /login
    ↓
Controller.login()
    ↓
AuthService.validateUser()
    ↓
Password comparison (bcryptjs)
    ↓
GenerateJWT Token
    ↓
Return token
```

### Flujo de CRUD
```
Request POST /resource
    ↓
Controller.create()
    ↓
Service.create()
    ↓
Repository.save()
    ↓
Database INSERT
    ↓
Return created resource
```

### Flujo de Auditoría
```
ANY Request
    ↓
Middleware logs event
    ↓
AccessLog.create()
    ↓
Database INSERT
    ↓
Continue request
```

## Patrones Utilizados

### 1. Dependency Injection
```typescript
constructor(private service: MyService) {}
```

### 2. Repository Pattern
```typescript
constructor(private repo: Repository<Entity>) {}
```

### 3. Middleware
```typescript
@UseGuards(JwtAuthGuard)
```

### 4. Decorators
```typescript
@Post()
@UseGuards(JwtAuthGuard)
```

## Seguridad

### Autenticación
- JWT Tokens (3600s expiration)
- Refresh Tokens
- Password hashing (bcrypt 10 rounds)

### Autorización
- Role-based access control
- Guard decorators
- Permission checks

### Validación
- DTO validation (class-validator)
- Input sanitization
- Type checking

### Auditoría
- AccessLog para cada operación
- User tracking
- IP logging

## Performance

### Optimizaciones
- Índices en base de datos
- Caché en memoria (opcional)
- Query optimization
- Connection pooling

### Escalabilidad
- Modular architecture
- Docker containerization
- Load balancing ready
- Horizontal scaling possible

## Disponibilidad

### High Availability
- Database replication ready
- Backup strategy
- Health checks
- Graceful shutdown

## Monitoreo

### Logs
- Winston logger (opcional)
- Request/Response logging
- Error tracking
- Performance metrics

---

**Última actualización:** Abril 2026
