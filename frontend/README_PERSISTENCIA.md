# 💾 Frontend con Persistencia de Datos

## ✨ Características de Persistencia

Este frontend incluye un sistema avanzado de persistencia de datos que garantiza que tu información nunca se pierda.

### 🔒 Cómo Funciona la Persistencia

#### 1. **localStorage - Almacenamiento Principal**
```
✓ Todos los datos se guardan automáticamente en localStorage
✓ Los datos persisten incluso después de cerrar el navegador
✓ Cada cambio (crear, editar, eliminar) se guarda inmediatamente
✓ Capacidad: ~5-10MB por dominio (suficiente para datos turísticos)
```

#### 2. **Caché en Memoria**
```
✓ Los datos se mantienen en memoria para acceso rápido
✓ Los cambios se reflejan instantáneamente en la UI
✓ Sincronización automática con localStorage
```

#### 3. **Respaldo Automático**
```
✓ Cada 5 minutos se crea un respaldo en sessionStorage
✓ Si ocurre un error, los datos pueden recuperarse
✓ Múltiples versiones de respaldo disponibles
```

#### 4. **Sincronización de Datos**
```
✓ Los cambios en una pestaña se sincronizan con las demás
✓ Los datos siempre están actualizados
✓ Notificaciones de cambios en tiempo real
```

---

## 🚀 Cómo Usar la Persistencia

### Guardar Datos

```typescript
import { useData } from './DataContext';

const { addDestination } = useData();

// Agregar un nuevo destino
addDestination({
  name: 'Nuevo Destino',
  region: 'La Paz',
  category: 'Natural',
  price: 100
});
// ✅ Se guarda automáticamente en localStorage
```

### Actualizar Datos

```typescript
import { useData } from './DataContext';

const { updateDestination } = useData();

// Actualizar destino existente
updateDestination('123', {
  name: 'Destino Actualizado',
  price: 150
});
// ✅ Se guarda automáticamente
```

### Eliminar Datos

```typescript
import { useData } from './DataContext';

const { deleteDestination } = useData();

// Eliminar destino
deleteDestination('123');
// ✅ Se guarda automáticamente
```

---

## 💾 Exportar e Importar Datos

### Descargar Respaldo

```typescript
import { useData } from './DataContext';

const { exportData } = useData();

// Descargar todos los datos como JSON
exportData();
// ⬇️ Descarga: datos-backup-TIMESTAMP.json
```

### Importar Datos

```typescript
import { useData } from './DataContext';

const { importData } = useData();

// Cargar datos desde un archivo JSON
const jsonString = '{"version": "2.0.0", ...}';
importData(jsonString);
// ✅ Datos importados y sincronizados
```

---

## 📊 Monitorear Almacenamiento

```typescript
import { useData } from './DataContext';

const { getStorageStats } = useData();

const stats = getStorageStats();
console.log('Tamaño total:', stats.totalSize, 'bytes');
console.log('Elementos guardados:', stats.itemCount);
console.log('Última sincronización:', stats.lastSync);
```

---

## 🔧 Servicio de Persistencia Avanzado

El `PersistenceService` proporciona métodos de bajo nivel para control total:

```typescript
import { persistenceService } from './PersistenceService';

// Obtener colección completa
const destinations = persistenceService.getCollection('destinations');

// Buscar documentos
const results = persistenceService.searchDocuments('destinations', 
  doc => doc.region === 'La Paz'
);

// Suscribirse a cambios
const unsubscribe = persistenceService.onChange((data) => {
  console.log('Datos actualizados:', data);
});

// Detener suscripción
unsubscribe();

// Estadísticas de almacenamiento
const stats = persistenceService.getStorageStats();

// Restaurar respaldo
persistenceService.restoreBackup();

// Limpiar todo (solicita confirmación)
persistenceService.clearAll();
```

---

## 🛡️ Garantías de Seguridad

### ✅ Protección de Datos

```
✓ No hay pérdida de datos al actualizar la página
✓ No hay pérdida de datos al cerrar el navegador
✓ Respaldos automáticos cada 5 minutos
✓ Múltiples copias de seguridad
✓ Recuperación de errores automática
```

### ✅ Sincronización

```
✓ Datos sincronizados en tiempo real
✓ Compatible con múltiples pestañas
✓ Sin conflictos de datos
✓ Notificaciones de cambios
```

### ✅ Limpieza Automática

```
✓ Limpieza automática cuando almacenamiento está lleno
✓ Mantiene datos más recientes
✓ Elimina logs antiguos (>100 registros)
✓ Optimización de espacio
```

---

## 📈 Tamaño de Almacenamiento

```
Destinos (5 registros):           ~2 KB
Proveedores (7 registros):        ~3 KB
Reservas (múltiples):             ~2 KB por reserva
Logs de acceso:                   ~100 bytes por evento
─────────────────────────────────────────
Total esperado:                   ~10-50 KB
Capacidad disponible:             ~5-10 MB
Relación uso/disponible:          0.1-0.5%
```

---

## ⚠️ Limitaciones

### localStorage
- Máximo 5-10MB por dominio (depende del navegador)
- Se borra si se limpian cookies/datos del navegador
- No funciona en navegación privada (algunos navegadores)
- No es apropiado para datos muy sensibles (usar backend)

### Soluciones
```
✓ Para datos más sensibles: usar servidor backend
✓ Para mayor capacidad: usar IndexedDB (futura versión)
✓ Para sincronización: implementar API REST
✓ Para seguridad: encriptar datos antes de guardar
```

---

## 🔄 Ciclo de Vida de Persistencia

```
Usuario hace cambio
    ↓
Se actualiza caché en memoria
    ↓
Se notifica a listeners
    ↓
Se actualiza UI
    ↓
Se guarda en localStorage
    ↓
Cada 5 minutos: se crea respaldo en sessionStorage
    ↓
Datos persisten en localStorage permanentemente
```

---

## 🚨 Recuperación de Errores

Si algo va mal:

1. **Datos duplicados en memoria:**
   - La aplicación recarga datos frescos de localStorage
   - Se restaura a estado consistente

2. **localStorage corrupto:**
   - Se cargan respaldos de sessionStorage
   - Se intenta restaurar última versión valida

3. **Falla de sincronización:**
   - Los datos se resincronizarán automáticamente
   - Caché en memoria permanece íntegro

---

## 📝 Mejores Prácticas

### ✅ Hacer
```
✓ Exportar datos regularmente como respaldo
✓ Usar navegadores modernos (Chrome, Firefox, Safari)
✓ Mantener suficiente espacio en disco
✓ Monitorear uso de almacenamiento
✓ Implementar backend para datos críticos
```

### ❌ Evitar
```
✗ Confiar únicamente en localStorage para datos críticos
✗ Usar en navegación privada sin alternativa
✗ Ignorar límites de almacenamiento
✗ No hacer respaldos externos
✗ Olvidar que se borra al limpiar datos del navegador
```

---

## 📊 Ejemplo Completo

```typescript
import React from 'react';
import { useData } from './DataContext';

export const DataManager: React.FC = () => {
  const { 
    destinations,
    addDestination,
    updateDestination,
    deleteDestination,
    exportData,
    importData,
    getStorageStats
  } = useData();

  const handleAddDestination = () => {
    addDestination({
      name: 'Nuevo Destino',
      region: 'La Paz',
      category: 'Natural',
      visitors: 10000,
      price: 50,
      description: 'Un hermoso destino'
    });
  };

  const handleExportData = () => {
    exportData(); // Descarga archivo JSON
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const json = e.target?.result as string;
        importData(json);
      };
      reader.readAsText(file);
    }
  };

  const stats = getStorageStats();

  return (
    <div>
      <h2>Gestión de Datos</h2>
      <p>Destinos guardados: {destinations.length}</p>
      <p>Almacenamiento usado: {(stats.totalSize / 1024).toFixed(2)} KB</p>
      <p>Última sincronización: {new Date(stats.lastSync).toLocaleString()}</p>

      <button onClick={handleAddDestination}>Agregar Destino</button>
      <button onClick={handleExportData}>Descargar Respaldo</button>
      <input type="file" onChange={handleImportData} accept=".json" />
    </div>
  );
};
```

---

## 🎯 Resumen

| Característica | Descripción |
|---|---|
| **Almacenamiento** | localStorage (5-10MB) |
| **Respaldo Automático** | Cada 5 minutos |
| **Sincronización** | Tiempo real |
| **Recuperación** | Automática |
| **Exportación** | JSON descargable |
| **Importación** | Desde archivo JSON |
| **Límite de datos** | ~10-50 KB para caso de uso típico |
| **Persistencia** | Permanente (mientras no se limpie datos) |

---

**Versión:** 2.0.0  
**Estado:** ✅ Production Ready  
**Última actualización:** Abril 2026
