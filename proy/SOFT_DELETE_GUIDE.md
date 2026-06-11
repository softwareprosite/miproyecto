# 🗑️ Eliminación Lógica (Soft Delete) - Guía Completa

## ¿Qué es Soft Delete?

**Eliminación Lógica (Soft Delete):** El registro NO se borra de la BD, solo se marca como "eliminado"

```
ANTES (Eliminación física):
┌─────────────────────────────────────┐
│ Destino: Salar de Uyuni             │
│ Región: Potosí                      │
│ Visitantes: 50000                   │
│ ❌ ELIMINADO COMPLETAMENTE          │
└─────────────────────────────────────┘
   ↓
   Registro desaparece de la BD
   Datos perdidos para siempre


DESPUÉS (Eliminación lógica):
┌──────────────────────────────────────┐
│ Destino: Salar de Uyuni              │
│ Región: Potosí                       │
│ Visitantes: 50000                    │
│ deletedAt: 2024-05-31 10:30:45      │ ← Marca de eliminación
│ isActive: false                      │ ← Indica que está "eliminado"
└──────────────────────────────────────┘
   ↓
   Registro sigue en la BD
   Datos pueden recuperarse
   Se usa para auditoría y historial
```

## Ventajas del Soft Delete

✅ **Historial:** Mantiene registro de qué existió  
✅ **Auditoría:** Saber cuándo y quién eliminó  
✅ **Recuperación:** Puede restaurarse si fue error  
✅ **Integridad:** No rompe relaciones en BD  
✅ **Cumplimiento:** Requisitos legales/regulatorios  

## Flujo Completo: Frontend → Backend → BD

### 1️⃣ FRONTEND - Usuario hace clic en "Eliminar"

```typescript
// Dashboard.tsx
const handleDelete = (id: string) => {
  if (confirm('¿Estás seguro de que deseas eliminar este destino?')) {
    deleteDestination(id);  // Aquí ocurre la magia
  }
};
```

**Acción:** Usuario elige eliminar "Salar de Uyuni"

```
Usuario ve tabla:
┌──────────────────────────────────────────────────┐
│ Destino          │ Región    │ Acciones           │
├──────────────────────────────────────────────────┤
│ Salar de Uyuni   │ Potosí    │ [Editar] [❌BORRAR]│ ← Clic
│ La Paz           │ La Paz    │ [Editar] [Borrar]  │
│ Isla del Sol     │ La Paz    │ [Editar] [Borrar]  │
└──────────────────────────────────────────────────┘

Diálogo de confirmación:
┌──────────────────────────────────────────┐
│ ¿Estás seguro de que deseas eliminar    │
│ este destino?                            │
│                                          │
│              [Sí]    [Cancelar]         │ ← Usuario elige "Sí"
└──────────────────────────────────────────┘
```

### 2️⃣ FRONTEND - DataContext ejecuta deleteDestination

```typescript
// DataContext.tsx
const deleteDestination = async (id: string) => {
  try {
    setError(null);
    await apiService.deleteDestination(id);  // Llamada al backend
    setDestinations(destinations.filter(d => d.id !== id));  // Actualiza UI
  } catch (err: any) {
    setError(err.message);
    throw err;
  }
};
```

### 3️⃣ FRONTEND - ApiService envía DELETE a Backend

```typescript
// ApiService.ts
async deleteDestination(id: string) {
  return this.request(`/destinations/${id}`, {
    method: 'DELETE',  // ← Método DELETE
  });
}

// Construye:
// DELETE http://localhost:3000/api/destinations/550e8400-e29b-41d4-a716-446655440000
// Headers: { Authorization: "Bearer eyJhbGci..." }
```

**Request HTTP:**
```
DELETE /api/destinations/550e8400-e29b-41d4-a716-446655440000 HTTP/1.1
Host: localhost:3000
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

### 4️⃣ BACKEND - Controller recibe la solicitud

```typescript
// destinations.controller.ts (pendiente crear)
@Delete(':id')
@UseGuards(JwtAuthGuard)
async remove(@Param('id') id: string) {
  return await this.destinationsService.remove(id);
}
```

El backend:
1. Valida JWT token ✅
2. Verifica que el usuario tenga permisos ✅
3. Ejecuta el service ✅

### 5️⃣ BACKEND - Service ejecuta Soft Delete

```typescript
// destinations.service.ts (pendiente crear)
async remove(id: string) {
  const destination = await this.repo.findOne({ where: { id } });
  
  if (!destination) {
    throw new NotFoundException('Destino no encontrado');
  }
  
  // SOFT DELETE: marcar como eliminado sin borrar físicamente
  destination.deletedAt = new Date();  // ← Marca el timestamp
  destination.isActive = false;        // ← Marca como inactivo
  
  await this.repo.save(destination);   // ← Guarda cambios
  
  return { message: 'Destino eliminado exitosamente' };
}
```

### 6️⃣ BACKEND - TypeORM actualiza PostgreSQL

```sql
-- TypeORM ejecuta:
UPDATE destination 
SET deleted_at = '2024-05-31 10:30:45.123'::timestamp,
    is_active = false,
    updated_at = NOW()
WHERE id = '550e8400-e29b-41d4-a716-446655440000';
```

### 7️⃣ PostgreSQL - Cambios en la Base de Datos

**ANTES (Registro existente):**
```sql
SELECT * FROM destination WHERE id = '550e8400-e29b-41d4-a716-446655440000';

 id                                   | name            | region  | deleted_at | is_active | ...
──────────────────────────────────────┼─────────────────┼─────────┼────────────┼───────────┼────
 550e8400-e29b-41d4-a716-446655440000 | Salar de Uyuni  | Potosí  | NULL       | true      | ...
```

**DESPUÉS (Soft Delete ejecutado):**
```sql
SELECT * FROM destination WHERE id = '550e8400-e29b-41d4-a716-446655440000';

 id                                   | name            | region  | deleted_at              | is_active | ...
──────────────────────────────────────┼─────────────────┼─────────┼─────────────────────────┼───────────┼────
 550e8400-e29b-41d4-a716-446655440000 | Salar de Uyuni  | Potosí  | 2024-05-31 10:30:45.123 | false     | ...
                                       ↑
                                       AHORA TIENE VALOR (marcado como eliminado)
```

### 8️⃣ BACKEND - Response al Frontend

```json
HTTP/1.1 200 OK
Content-Type: application/json

{
  "message": "Destino eliminado exitosamente",
  "id": "550e8400-e29b-41d4-a716-446655440000"
}
```

### 9️⃣ FRONTEND - UI se actualiza

```typescript
// DataContext actualiza lista local
setDestinations(destinations.filter(d => d.id !== id));

// Resultado:
// - Destino desaparece de la tabla
// - Usuario ve confirmación de eliminación
// - Datos siguen existentes en la BD
```

## Comparación Visual: Física vs Lógica

### Eliminación Física (NO recomendado)

```
┌─────────────────────────────────────┐
│ DELETE FROM destination              │
│ WHERE id = '550e8400...'             │
└─────────────────────────────────────┘
           ↓
    ❌ REGISTRO DESAPARECE
    ❌ DATOS PERDIDOS
    ❌ NO HAY AUDITORÍA
    ❌ RELACIONES PUEDEN ROMPERSE
```

### Eliminación Lógica (RECOMENDADO)

```
┌──────────────────────────────────────────────┐
│ UPDATE destination                            │
│ SET deleted_at = NOW(),                       │
│     is_active = false                         │
│ WHERE id = '550e8400...'                      │
└──────────────────────────────────────────────┘
           ↓
    ✅ REGISTRO SIGUE EN BD
    ✅ DATOS PRESERVADOS
    ✅ AUDITORÍA COMPLETA
    ✅ RELACIONES INTACTAS
    ✅ RECUPERACIÓN POSIBLE
```

## Demostración Paso a Paso

### Paso 1: Conectar a PostgreSQL

```bash
# Desde tu máquina
psql -h localhost -U bolivia_user -d bolivia_tourism_db

# O mediante Docker
docker exec -it bolivia_postgres psql -U bolivia_user -d bolivia_tourism_db
```

### Paso 2: Ver destinos ANTES

```sql
SELECT id, name, region, is_active, deleted_at 
FROM destination 
WHERE name = 'Salar de Uyuni';
```

**Resultado:**
```
 id                                   | name           | region | is_active | deleted_at
──────────────────────────────────────┼────────────────┼────────┼───────────┼────────────
 123e4567-e89b-12d3-a456-426614174000 | Salar de Uyuni | Potosí | true      | (null)
```

### Paso 3: Eliminar desde el Frontend

1. Abrir http://localhost:5173
2. Login: admin@bolivia-tours.com / Admin123!@
3. Dashboard → Tabla de Destinos
4. Buscar "Salar de Uyuni"
5. Clic en botón 🗑️ Eliminar
6. Confirmar en el diálogo

**Lo que ocurre:**
```
Frontend                Backend                PostgreSQL
─────────────────────────────────────────────────────────────
Usuario clic
  ↓
¿Estás seguro?
  ↓ Sí
DELETE request
  ─────→ /api/destinations/123e4567...
          ↓
          Valida JWT
          ↓
          Ejecuta Soft Delete
          ↓
          UPDATE destination
          SET deleted_at = NOW()...
          ─────────────────→ UPDATE ejecutado
                             ↓
                             Registro marcado
                             ↓ Devuelve OK
          ←──────────────────
  ←─ 200 OK
Remueve de tabla
  ↓
UI actualizada
  ↓
✅ "Destino eliminado"
```

### Paso 4: Ver destinos DESPUÉS

```sql
SELECT id, name, region, is_active, deleted_at 
FROM destination 
WHERE name = 'Salar de Uyuni';
```

**Resultado:**
```
 id                                   | name           | region | is_active | deleted_at
──────────────────────────────────────┼────────────────┼────────┼───────────┼─────────────────────────
 123e4567-e89b-12d3-a456-426614174000 | Salar de Uyuni | Potosí | false     | 2024-05-31 10:30:45.123
                                       ↑ CAMBIÓ
```

**¿El registro sigue en la BD? SÍ ✅**

```sql
-- Ver TODOS los registros (incluyendo eliminados)
SELECT * FROM destination;
-- Muestra: 5 destinos (incluyendo "Salar de Uyuni" con deleted_at)

-- Ver solo ACTIVOS (eliminados lógicamente ocultos)
SELECT * FROM destination WHERE deleted_at IS NULL AND is_active = true;
-- Muestra: 4 destinos (sin "Salar de Uyuni")
```

## Auditoría: Ver quién eliminó qué

```sql
-- Ver logs de acceso (AccessLog registra todo)
SELECT * FROM access_log 
WHERE user_id = '123e4567-e89b-12d3-a456-426614174000'
AND event = 'DELETE'
ORDER BY created_at DESC;

 id    | user_id  | ip        | event  | browser | module        | resource | created_at
───────┼──────────┼───────────┼────────┼─────────┼───────────────┼──────────┼──────────────────────
 abc1  | 123e4567 | 127.0.0.1 | DELETE | Chrome  | destinations  | 123e4567 | 2024-05-31 10:30:45
```

## Restaurar (Undo)

```typescript
// Opción 1: Desde el Frontend
const handleRestore = async (id: string) => {
  await apiService.restoreDestination(id);  // PATCH /api/destinations/:id/restore
};

// Opción 2: Desde la BD (directamente)
UPDATE destination 
SET deleted_at = NULL, is_active = true
WHERE id = '550e8400-e29b-41d4-a716-446655440000';
```

## Código del Backend (Implementación)

### Controller
```typescript
// destinations.controller.ts
@Delete(':id')
@UseGuards(JwtAuthGuard)
async remove(@Param('id') id: string) {
  return await this.destinationsService.remove(id);
}

@Patch(':id/restore')
@UseGuards(JwtAuthGuard)
async restore(@Param('id') id: string) {
  return await this.destinationsService.restore(id);
}
```

### Service
```typescript
// destinations.service.ts
async remove(id: string) {
  const destination = await this.repo.findOne({ where: { id } });
  
  if (!destination) {
    throw new NotFoundException('Destino no encontrado');
  }
  
  // SOFT DELETE
  destination.deletedAt = new Date();
  destination.isActive = false;
  await this.repo.save(destination);
  
  // Log en AccessLog
  await this.accessLogService.logEvent({
    userId: currentUser.id,
    event: 'DELETE',
    module: 'destinations',
    resource: id,
  });
  
  return { message: 'Eliminado', id };
}

async restore(id: string) {
  const destination = await this.repo.findOne({ where: { id } });
  
  if (!destination) {
    throw new NotFoundException('Destino no encontrado');
  }
  
  // UNDO SOFT DELETE
  destination.deletedAt = null;
  destination.isActive = true;
  await this.repo.save(destination);
  
  return { message: 'Restaurado', id };
}
```

### Entity
```typescript
// destination.entity.ts
@Entity()
export class Destination {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  region: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true, type: 'timestamp' })
  deletedAt: Date | null;  // ← CLAVE: columna para soft delete

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

## Ventajas en Acción

### Antes (sin soft delete)
```
Usuario elimina destino por error
  ↓
DELETED FROM destination WHERE...
  ↓
DATOS PERDIDOS PARA SIEMPRE ❌
  ↓
Admin: "¿No hay respaldo?"
  ↓
Restaurar desde backup (si existe)
```

### Después (con soft delete)
```
Usuario elimina destino por error
  ↓
UPDATE destination SET deleted_at = NOW()...
  ↓
REGISTRO SIGUE EN BD ✅
  ↓
Admin: "Simplemente restaura"
  ↓
PATCH /api/destinations/:id/restore
  ↓
UPDATE destination SET deleted_at = NULL...
  ↓
DATOS RECUPERADOS AL INSTANTE ✅
```

## Resumen

| Aspecto | Eliminación Física | Eliminación Lógica |
|---|---|---|
| **Datos en BD** | Desaparecen | Siguen existiendo |
| **Auditoría** | Perdida | Completa |
| **Recuperación** | Difícil/Imposible | Inmediata |
| **Integridad** | Puede romperse | Siempre intacta |
| **Cumplimiento Legal** | Riesgoso | Seguro |
| **Performance** | Mejor (menos datos) | Ligeramente más lento |
| **Recomendado** | Raramente | SIEMPRE (en producción) |

---

**En resumen:** El soft delete marca un registro como eliminado sin borrarlo, manteniendo historial, permitiendo recuperación y cumpliendo requisitos de auditoría. ✅
