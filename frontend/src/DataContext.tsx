import React, { createContext, useContext, useState, useEffect } from 'react';
import { persistenceService } from './PersistenceService';

interface DataContextType {
  destinations: any[];
  providers: any[];
  bookings: any[];
  
  addDestination: (dest: any) => void;
  updateDestination: (id: string, dest: any) => void;
  deleteDestination: (id: string) => void;
  
  addProvider: (prov: any) => void;
  updateProvider: (id: string, prov: any) => void;
  deleteProvider: (id: string) => void;
  
  addBooking: (booking: any) => void;
  updateBooking: (id: string, booking: any) => void;
  deleteBooking: (id: string) => void;
  
  exportData: () => void;
  importData: (json: string) => void;
  getStorageStats: () => any;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [destinations, setDestinations] = useState(persistenceService.getCollection('destinations'));
  const [providers, setProviders] = useState(persistenceService.getCollection('providers'));
  const [bookings, setBookings] = useState(persistenceService.getCollection('bookings'));

  // Sincronizar cambios de persistencia
  useEffect(() => {
    const unsubscribe = persistenceService.onChange((data) => {
      setDestinations(data.data.destinations || []);
      setProviders(data.data.providers || []);
      setBookings(data.data.bookings || []);
    });

    return () => unsubscribe();
  }, []);

  const addDestination = (dest: any) => {
    persistenceService.addToCollection('destinations', { ...dest, id: dest.id || Date.now().toString() });
  };

  const updateDestination = (id: string, dest: any) => {
    persistenceService.updateDocument('destinations', id, dest);
  };

  const deleteDestination = (id: string) => {
    persistenceService.deleteDocument('destinations', id);
  };

  const addProvider = (prov: any) => {
    persistenceService.addToCollection('providers', { ...prov, id: prov.id || Date.now().toString() });
  };

  const updateProvider = (id: string, prov: any) => {
    persistenceService.updateDocument('providers', id, prov);
  };

  const deleteProvider = (id: string) => {
    persistenceService.deleteDocument('providers', id);
  };

  const addBooking = (booking: any) => {
    persistenceService.addToCollection('bookings', { ...booking, id: booking.id || Date.now().toString() });
  };

  const updateBooking = (id: string, booking: any) => {
    persistenceService.updateDocument('bookings', id, booking);
  };

  const deleteBooking = (id: string) => {
    persistenceService.deleteDocument('bookings', id);
  };

  const exportData = () => {
    const json = persistenceService.exportData();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `datos-backupbolivia-${new Date().toISOString()}.json`;
    a.click();
    console.log('✅ Datos exportados');
  };

  const importData = (json: string) => {
    const success = persistenceService.importData(json);
    if (success) {
      const data = persistenceService.getAllData();
      setDestinations(data.data.destinations || []);
      setProviders(data.data.providers || []);
      setBookings(data.data.bookings || []);
    }
  };

  const getStorageStats = () => {
    return persistenceService.getStorageStats();
  };

  return (
    <DataContext.Provider value={{
      destinations,
      providers,
      bookings,
      addDestination,
      updateDestination,
      deleteDestination,
      addProvider,
      updateProvider,
      deleteProvider,
      addBooking,
      updateBooking,
      deleteBooking,
      exportData,
      importData,
      getStorageStats
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData debe usarse dentro de DataProvider');
  }
  return context;
};
