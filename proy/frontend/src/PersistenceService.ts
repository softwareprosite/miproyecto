/**
 * Servicio de Persistencia de Datos Avanzado
 * Utiliza localStorage con respaldo en memoria y sincronización
 */

interface StorageData {
  version: string;
  lastSync: string;
  data: {
    destinations?: any[];
    providers?: any[];
    bookings?: any[];
    users?: any[];
    accessLogs?: any[];
  };
}

const STORAGE_KEY = 'bolivia-tourism-data';
const STORAGE_VERSION = '2.0.0';
const AUTO_BACKUP_INTERVAL = 5 * 60 * 1000; // 5 minutos

class PersistenceService {
  private memoryCache: StorageData;
  private backupInterval: NodeJS.Timer | null = null;
  private changeListeners: ((data: StorageData) => void)[] = [];

  constructor() {
    this.memoryCache = this.loadFromStorage();
    this.startAutoBackup();
  }

  /**
   * Cargar datos desde localStorage
   */
  private loadFromStorage(): StorageData {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.version === STORAGE_VERSION) {
          console.log('✅ Datos cargados desde localStorage');
          return parsed;
        }
      }
    } catch (error) {
      console.error('❌ Error al cargar datos de localStorage:', error);
    }

    // Datos por defecto si no hay almacenamiento
    return {
      version: STORAGE_VERSION,
      lastSync: new Date().toISOString(),
      data: {
        destinations: [
          { id: '1', name: 'Salar de Uyuni', region: 'Potosí', category: 'Natural', visitors: 50000, price: 50, description: 'El mayor salar' },
          { id: '2', name: 'La Paz', region: 'La Paz', category: 'Urban', visitors: 80000, price: 20, description: 'Capital' },
          { id: '3', name: 'Isla del Sol', region: 'La Paz', category: 'Cultural', visitors: 35000, price: 30, description: 'Sagrada' },
          { id: '4', name: 'Madidi', region: 'Beni', category: 'Adventure', visitors: 25000, price: 60, description: 'Biodiversa' },
          { id: '5', name: 'Potosí', region: 'Potosí', category: 'Cultural', visitors: 40000, price: 35, description: 'Histórica' }
        ],
        providers: [
          { id: '1', name: 'Uyuni Turismo', type: 'Tour', destination: 'Salar', rating: 4.8, price: 250, contact: 'uyuni@tour.com', phone: '+591-2-2445678' },
          { id: '2', name: 'Hotel Luna', type: 'Hotel', destination: 'Salar', rating: 4.6, price: 120, contact: 'luna@hotel.com', phone: '+591-2-2441000' },
          { id: '3', name: 'Plaza Mayor', type: 'Hotel', destination: 'La Paz', rating: 4.7, price: 180, contact: 'plaza@hotel.com', phone: '+591-2-2312345' }
        ],
        bookings: [
          { id: '1', firstName: 'Juan', lastName: 'Pérez', email: 'juan@example.com', destination: 'Salar de Uyuni', provider: 'Uyuni Turismo Premium', checkIn: '2024-05-15', checkOut: '2024-05-18', guests: 2, totalPrice: 720, reference: 'BKG-001-2024' },
          { id: '2', firstName: 'María', lastName: 'García', email: 'maria@example.com', destination: 'La Paz', provider: 'Hotel Plaza Mayor', checkIn: '2024-06-01', checkOut: '2024-06-03', guests: 1, totalPrice: 240, reference: 'BKG-002-2024' }
        ],
        users: [],
        accessLogs: []
      }
    };
  }

  /**
   * Guardar datos en localStorage
   */
  private saveToStorage(): void {
    try {
      this.memoryCache.lastSync = new Date().toISOString();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.memoryCache));
      console.log('💾 Datos guardados en localStorage');
    } catch (error) {
      console.error('❌ Error al guardar datos:', error);
      // Si localStorage está lleno, limpiar datos antiguos
      this.clearOldData();
    }
  }

  /**
   * Limpiar datos antiguos para liberar espacio
   */
  private clearOldData(): void {
    try {
      // Mantener solo los últimos 100 logs
      if (this.memoryCache.data.accessLogs && this.memoryCache.data.accessLogs.length > 100) {
        this.memoryCache.data.accessLogs = this.memoryCache.data.accessLogs.slice(-100);
      }
      this.saveToStorage();
      console.log('🧹 Datos antiguos eliminados para liberar espacio');
    } catch (error) {
      console.error('Error al limpiar datos antiguos:', error);
    }
  }

  /**
   * Iniciar respaldo automático
   */
  private startAutoBackup(): void {
    this.backupInterval = setInterval(() => {
      this.saveToStorage();
      this.createBackup();
    }, AUTO_BACKUP_INTERVAL);
  }

  /**
   * Detener respaldo automático
   */
  stopAutoBackup(): void {
    if (this.backupInterval) {
      clearInterval(this.backupInterval);
    }
  }

  /**
   * Crear respaldo en sessionStorage como medida de seguridad
   */
  private createBackup(): void {
    try {
      const backup = {
        data: this.memoryCache,
        timestamp: new Date().toISOString()
      };
      sessionStorage.setItem('data-backup-' + new Date().getTime(), JSON.stringify(backup));
      console.log('🔐 Respaldo creado');
    } catch (error) {
      console.error('Error al crear respaldo:', error);
    }
  }

  /**
   * Restaurar respaldo
   */
  restoreBackup(): void {
    try {
      const backups = Object.keys(sessionStorage)
        .filter(key => key.startsWith('data-backup-'))
        .sort()
        .reverse();

      if (backups.length > 0) {
        const latestBackup = JSON.parse(sessionStorage.getItem(backups[0])!);
        this.memoryCache = latestBackup.data;
        this.saveToStorage();
        console.log('✅ Respaldo restaurado');
      }
    } catch (error) {
      console.error('Error al restaurar respaldo:', error);
    }
  }

  /**
   * Obtener todos los datos
   */
  getAllData(): StorageData {
    return this.memoryCache;
  }

  /**
   * Obtener colección específica
   */
  getCollection(collectionName: keyof StorageData['data']): any[] {
    return this.memoryCache.data[collectionName] || [];
  }

  /**
   * Agregar documento a colección
   */
  addToCollection(collectionName: keyof StorageData['data'], document: any): void {
    if (!this.memoryCache.data[collectionName]) {
      this.memoryCache.data[collectionName] = [];
    }
    document.id = document.id || Date.now().toString();
    this.memoryCache.data[collectionName]!.push(document);
    this.saveToStorage();
    this.notifyListeners();
  }

  /**
   * Actualizar documento
   */
  updateDocument(collectionName: keyof StorageData['data'], id: string, updates: any): void {
    const collection = this.memoryCache.data[collectionName];
    if (collection) {
      const index = collection.findIndex(doc => doc.id === id);
      if (index !== -1) {
        collection[index] = { ...collection[index], ...updates };
        this.saveToStorage();
        this.notifyListeners();
      }
    }
  }

  /**
   * Eliminar documento
   */
  deleteDocument(collectionName: keyof StorageData['data'], id: string): void {
    const collection = this.memoryCache.data[collectionName];
    if (collection) {
      const index = collection.findIndex(doc => doc.id === id);
      if (index !== -1) {
        collection.splice(index, 1);
        this.saveToStorage();
        this.notifyListeners();
      }
    }
  }

  /**
   * Buscar documentos
   */
  searchDocuments(collectionName: keyof StorageData['data'], query: (doc: any) => boolean): any[] {
    const collection = this.memoryCache.data[collectionName];
    return collection ? collection.filter(query) : [];
  }

  /**
   * Exportar datos como JSON
   */
  exportData(): string {
    return JSON.stringify(this.memoryCache, null, 2);
  }

  /**
   * Importar datos desde JSON
   */
  importData(jsonString: string): boolean {
    try {
      const imported = JSON.parse(jsonString);
      if (imported.version === STORAGE_VERSION) {
        this.memoryCache = imported;
        this.saveToStorage();
        this.notifyListeners();
        console.log('✅ Datos importados exitosamente');
        return true;
      }
    } catch (error) {
      console.error('Error al importar datos:', error);
    }
    return false;
  }

  /**
   * Suscribirse a cambios de datos
   */
  onChange(callback: (data: StorageData) => void): () => void {
    this.changeListeners.push(callback);
    return () => {
      this.changeListeners = this.changeListeners.filter(cb => cb !== callback);
    };
  }

  /**
   * Notificar a los oyentes de cambios
   */
  private notifyListeners(): void {
    this.changeListeners.forEach(callback => callback(this.memoryCache));
  }

  /**
   * Obtener estadísticas de almacenamiento
   */
  getStorageStats(): {
    totalSize: number;
    itemCount: number;
    lastSync: string;
    version: string;
  } {
    const stored = localStorage.getItem(STORAGE_KEY);
    return {
      totalSize: stored ? stored.length : 0,
      itemCount: (this.memoryCache.data.destinations?.length || 0) +
                 (this.memoryCache.data.providers?.length || 0) +
                 (this.memoryCache.data.bookings?.length || 0),
      lastSync: this.memoryCache.lastSync,
      version: STORAGE_VERSION
    };
  }

  /**
   * Limpiar todo el almacenamiento
   */
  clearAll(): void {
    if (confirm('¿Estás seguro de que deseas eliminar TODOS los datos? Esta acción no se puede deshacer.')) {
      localStorage.removeItem(STORAGE_KEY);
      sessionStorage.clear();
      this.memoryCache = this.loadFromStorage();
      this.notifyListeners();
      console.log('🗑️ Almacenamiento limpiado');
    }
  }
}

// Instancia singleton
export const persistenceService = new PersistenceService();
