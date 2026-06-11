# 🗑️ Demostración Práctica: Soft Delete en PostgreSQL

## Escenario Real

Vamos a simular el proceso completo:
1. Usuario abre la app → Dashboard
2. Ve lista de destinos
3. Decide eliminar "Salar de Uyuni"
4. Hacemos clic en 🗑️
5. Backend ejecuta soft delete
6. Verificamos en la BD

---

## PASO 1: Conectar a PostgreSQL

### Opción A: Desde Docker

```bash
docker exec -it bolivia_postgres psql -U bolivia_user -d bolivia_tourism_db
```

### Opción B: Desde tu máquina (si PostgreSQL está instalado)

```bash
psql -h localhost -U bolivia_user -d bolivia_tourism_db
# Password: Bolivia@2024
```

### Opción C: Con pgAdmin (GUI)

1. Abrir http://localhost:5050
2. Conectar a `localhost:5432`
3. Navegar a `bolivia_tourism_db`

---

## PASO 2: Ver Destinos ANTES

```sql
-- Conectado a psql>
SELECT id, name, region, is_active, deleted_at, created_at 
FROM destination 
ORDER BY created_at DESC;
```

**Resultado esperado:**
```
 id                                   | name           | region  | is_active | deleted_at | created_at
──────────────────────────────────────┼────────────────┼─────────┼───────────┼────────────┼──────────────────────
 550e8400-e29b-41d4-a716-446655440000 | Salar de Uyuni | Potosí  | true      | (null)     | 2024-05-31 09:00:00
 550e8400-e29b-41d4-a716-446655440001 | La Paz         | La Paz  | true      | (null)     | 2024-05-31 09:05:00
 550e8400-e29b-41d4-a716-446655440002 | Isla del Sol   | La Paz  | true      | (null)     | 2024-05-31 09:10:00
 550e8400-e29b-41d4-a716-446655440003 | Parque Madidi  | Beni    | true      | (null)     | 2024-05-31 09:15:00
 550e8400-e29b-41d4-a716-446655440004 | Potosí         | Potosí  | true      | (null)     | 2024-05-31 09:20:00
(5 rows)
```

**Observaciones:**
- 5 destinos activos
- `is_active = true` (todos activos)
- `deleted_at = (null)` (ninguno eliminado)

---

## PASO 3: Frontend - Usuario Elimina

### En el navegador (http://localhost:5173):

```
1. Dashboard abierto
2. Tabla visible con 5 destinos
3. Usuario ve "Salar de Uyuni" en la lista
4. Hace clic en botón 🗑️ (Eliminar)
5. Diálogo: "¿Estás seguro?"
6. Usuario confirma: [Sí]
7. Frontend envía: DELETE /api/destinations/550e8400-e29b-41d4-a716-446655440000
```

### Backend log (docker-compose logs backend):

```
[NestJS] DELETE /api/destinations/550e8400-e29b-41d4-a716-446655440000
[Auth Guard] JWT válido ✓
[Service] Ejecutando soft delete...
[TypeORM] UPDATE destination SET deleted_at = NOW(), is_active = false...
[Database] Query ejecutada exitosamente
[Response] 200 OK - Destino eliminado
```

---

## PASO 4: Ver en PostgreSQL Después del Soft Delete

### Comando SQL:

```sql
SELECT id, name, region, is_active, deleted_at, created_at 
FROM destination 
WHERE name = 'Salar de Uyuni';
```

**Resultado:**
```
 id                                   | name           | region | is_active | deleted_at              | created_at
──────────────────────────────────────┼────────────────┼────────┼───────────┼─────────────────────────┼──────────────────────
 550e8400-e29b-41d4-a716-446655440000 | Salar de Uyuni | Potosí | false     | 2024-05-31 10:30:45.123 | 2024-05-31 09:00:00
(1 row)
```

**Cambios observados:**
- ✅ `is_active` cambió de `true` a `false`
- ✅ `deleted_at` ahora tiene timestamp (fue NULL)
- ✅ **Registro SIGUE en la BD** (no fue eliminado)

---

## PASO 5: Comparación - Todos los Destinos

### Ver TODOS (incluyendo eliminados):

```sql
SELECT id, name, is_active, deleted_at 
FROM destination 
ORDER BY name;
```

**Resultado:**
```
 id  | name           | is_active | deleted_at
─────┼────────────────┼───────────┼─────────────────────────
 2   | Isla del Sol   | true      | (null)          ← ACTIVO
 3   | La Paz         | true      | (null)          ← ACTIVO
 4   | Parque Madidi  | true      | (null)          ← ACTIVO
 1   | Potosí         | true      | (null)          ← ACTIVO
 0   | Salar de Uyuni | false     | 2024-05-31...   ← ELIMINADO (lógicamente)
(5 rows)
```

### Ver SOLO activos (eliminados ocultos):

```sql
SELECT id, name, region, is_active 
FROM destination 
WHERE is_active = true AND deleted_at IS NULL
ORDER BY name;
```

**Resultado:**
```
 id  | name           | region | is_active
─────┼────────────────┼────────┼───────────
 2   | Isla del Sol   | La Paz | true
 3   | La Paz         | La Paz | true
 4   | Parque Madidi  | Beni   | true
 5   | Potosí         | Potosí | true
(4 rows)
```

**Observación:** "Salar de Uyuni" desaparece de la lista cuando buscamos solo activos

---

## PASO 6: Auditoría - Ver quién lo eliminó

```sql
SELECT user_id, event, module, resource, created_at, ip, browser
FROM access_log 
WHERE event = 'DELETE' AND module = 'destinations'
ORDER BY created_at DESC;
```

**Resultado:**
```
 user_id                              | event  | module        | resource | created_at              | ip        | browser
──────────────────────────────────────┼────────┼───────────────┼──────────┼─────────────────────────┼───────────┼────────────
 123e4567-e89b-12d3-a456-426614174000 | DELETE | destinations  | 550e8400 | 2024-05-31 10:30:45.123 | 127.0.0.1 | Chrome
(1 row)
```

**Info importante:**
- User ID: quién hizo la eliminación
- Timestamp: cuándo se eliminó
- IP: desde dónde se eliminó
- Browser: qué navegador usó

---

## PASO 7: Restore (Deshacer eliminación)

### Si fue por error, restaurar es fácil:

```sql
-- Método 1: Desde la BD (SQL directo)
UPDATE destination 
SET deleted_at = NULL, is_active = true
WHERE id = '550e8400-e29b-41d4-a716-446655440000';

-- Verifica:
SELECT id, name, is_active, deleted_at 
FROM destination 
WHERE id = '550e8400-e29b-41d4-a716-446655440000';
```

**Resultado:**
```
 id                                   | name           | is_active | deleted_at
──────────────────────────────────────┼────────────────┼───────────┼────────────
 550e8400-e29b-41d4-a716-446655440000 | Salar de Uyuni | true      | (null)
(1 row)
```

### Método 2: Desde el Frontend

```typescript
// En Dashboard.tsx, agregar botón para restaurar
const handleRestore = async (id: string) => {
  await apiService.restoreDestination(id);
  // PATCH /api/destinations/:id/restore
};
```

---

## PASO 8: Verificación Completa

### Script SQL para auditoría completa:

```sql
-- VER HISTORIAL COMPLETO DE UN DESTINO
SELECT 'REGISTRO ACTUAL' as tipo, id, name, is_active, deleted_at, updated_at
FROM destination 
WHERE id = '550e8400-e29b-41d4-a716-446655440000'

UNION ALL

SELECT 'ACCIONES LOG', id, event, '---', created_at, '---'
FROM access_log 
WHERE resource = '550e8400-e29b-41d4-a716-446655440000'
ORDER BY updated_at DESC, created_at DESC;
```

---

## Tabla Comparativa: Antes vs Después

```
┌─────────────────────────────────────────────────────────────┐
│                    ANTES (is_active=true)                  │
├─────────────────────────────────────────────────────────────┤
│ ID: 550e8400-e29b-41d4-a716-446655440000                   │
│ Name: Salar de Uyuni                                        │
│ Region: Potosí                                              │
│ is_active: TRUE ✓                                           │
│ deleted_at: NULL                                            │
│ Status: 🟢 ACTIVO (visible en frontend)                     │
└─────────────────────────────────────────────────────────────┘
                          ↓
                    (Usuario clic 🗑️)
                          ↓
┌──────────────────────────────────────────────────────────────┐
│               DESPUÉS (is_active=false)                      │
├──────────────────────────────────────────────────────────────┤
│ ID: 550e8400-e29b-41d4-a716-446655440000 (MISMO)            │
│ Name: Salar de Uyuni (MISMO)                                │
│ Region: Potosí (MISMO)                                      │
│ is_active: FALSE ✓ (CAMBIÓ)                                 │
│ deleted_at: 2024-05-31 10:30:45.123 (SE LLENÓ)              │
│ Status: 🔴 ELIMINADO (oculto en frontend)                   │
│ Datos: INTACTOS EN BD ✓                                     │
│ Recuperable: SÍ ✓                                           │
└──────────────────────────────────────────────────────────────┘
```

---

## Casos de Uso

### 1. Usuario elimina accidentalmente

```
Usuario: "¡Eliminé Salar de Uyuni por error!"
Admin: "Sin problema, ejecuto:"
       UPDATE destination SET deleted_at = NULL, is_active = true...
       "¡Listo! Está de vuelta en 1 segundo"
```

### 2. Auditoría legal

```
Auditor: "¿Qué destinos se eliminaron en mayo?"
Admin: SELECT * FROM destination WHERE deleted_at >= '2024-05-01'...
       "Aquí están todos con quién, cuándo y por qué"
```

### 3. Análisis histórico

```
Analista: "¿Cuáles destinos existieron alguna vez?"
Admin: SELECT * FROM destination...
       "Aquí están todos: activos, eliminados y recuperados"
```

### 4. Integridad de datos

```
Sistema: Usuario intenta crear reserva para destino eliminado
Backend: WHERE destination.deleted_at IS NULL AND destination.id = :id
         (Previene inconsistencias)
```

---

## Query Útiles

### Ver destinos eliminados

```sql
SELECT * FROM destination 
WHERE deleted_at IS NOT NULL 
ORDER BY deleted_at DESC;
```

### Ver cuándo se eliminó cada uno

```sql
SELECT name, deleted_at, 
       (EXTRACT(EPOCH FROM (now() - deleted_at))/3600)::int as horas_eliminado
FROM destination 
WHERE deleted_at IS NOT NULL;
```

### Ver eliminaciones por usuario

```sql
SELECT al.user_id, u.email, COUNT(*) as eliminaciones
FROM access_log al
JOIN "user" u ON u.id = al.user_id
WHERE al.event = 'DELETE'
GROUP BY al.user_id, u.email;
```

### Restaurar todos los de un día

```sql
UPDATE destination 
SET deleted_at = NULL, is_active = true
WHERE deleted_at::date = '2024-05-31';
```

---

## Resumen

| Acción | SQL | Frontend | BD |
|---|---|---|---|
| **Ver destino normal** | `SELECT... WHERE deleted_at IS NULL` | ✓ Visible | Activo |
| **Eliminar (soft)** | `UPDATE SET deleted_at=NOW()...` | ✗ Oculto | `deleted_at` lleno |
| **Restaurar** | `UPDATE SET deleted_at=NULL...` | ✓ Visible | Activo de nuevo |
| **Ver todos** | `SELECT...` | - | Incluye eliminados |
| **Auditoría** | `SELECT FROM access_log...` | - | Quién, cuándo, cómo |

✅ **El soft delete es la mejor práctica en sistemas profesionales**
