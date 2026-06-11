import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from './api/ApiService';

interface DataContextType {
  destinations: any[];
  providers: any[];
  bookings: any[];
  loading: boolean;
  error: string | null;
  
  // Destinations
  fetchDestinations: () => Promise<void>;
  addDestination: (dest: any) => Promise<void>;
  updateDestination: (id: string, dest: any) => Promise<void>;
  deleteDestination: (id: string) => Promise<void>;
  
  // Providers
  fetchProviders: () => Promise<void>;
  addProvider: (prov: any) => Promise<void>;
  updateProvider: (id: string, prov: any) => Promise<void>;
  deleteProvider: (id: string) => Promise<void>;
  
  // Bookings
  fetchBookings: () => Promise<void>;
  addBooking: (booking: any) => Promise<void>;
  updateBooking: (id: string, booking: any) => Promise<void>;
  deleteBooking: (id: string) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [destinations, setDestinations] = useState<any[]>([]);
  const [providers, setProviders] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch destinations
  const fetchDestinations = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getDestinations();
      setDestinations(Array.isArray(data) ? data : data.data || []);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching destinations:', err);
    } finally {
      setLoading(false);
    }
  };

  const addDestination = async (dest: any) => {
    try {
      setError(null);
      const newDest = await apiService.createDestination(dest);
      setDestinations([...destinations, newDest]);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const updateDestination = async (id: string, dest: any) => {
    try {
      setError(null);
      await apiService.updateDestination(id, dest);
      setDestinations(destinations.map(d => d.id === id ? { ...d, ...dest } : d));
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const deleteDestination = async (id: string) => {
    try {
      setError(null);
      await apiService.deleteDestination(id);
      setDestinations(destinations.filter(d => d.id !== id));
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  // Fetch providers
  const fetchProviders = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getProviders();
      setProviders(Array.isArray(data) ? data : data.data || []);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching providers:', err);
    } finally {
      setLoading(false);
    }
  };

  const addProvider = async (prov: any) => {
    try {
      setError(null);
      const newProv = await apiService.createProvider(prov);
      setProviders([...providers, newProv]);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const updateProvider = async (id: string, prov: any) => {
    try {
      setError(null);
      await apiService.updateProvider(id, prov);
      setProviders(providers.map(p => p.id === id ? { ...p, ...prov } : p));
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const deleteProvider = async (id: string) => {
    try {
      setError(null);
      await apiService.deleteProvider(id);
      setProviders(providers.filter(p => p.id !== id));
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  // Fetch bookings
  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getBookings();
      setBookings(Array.isArray(data) ? data : data.data || []);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const addBooking = async (booking: any) => {
    try {
      setError(null);
      const newBooking = await apiService.createBooking(booking);
      setBookings([...bookings, newBooking]);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const updateBooking = async (id: string, booking: any) => {
    try {
      setError(null);
      await apiService.updateBooking(id, booking);
      setBookings(bookings.map(b => b.id === id ? { ...b, ...booking } : b));
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const deleteBooking = async (id: string) => {
    try {
      setError(null);
      await apiService.deleteBooking(id);
      setBookings(bookings.filter(b => b.id !== id));
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  // Cargar datos al montar
  useEffect(() => {
    fetchDestinations();
    fetchProviders();
    fetchBookings();
  }, []);

  return (
    <DataContext.Provider
      value={{
        destinations,
        providers,
        bookings,
        loading,
        error,
        fetchDestinations,
        addDestination,
        updateDestination,
        deleteDestination,
        fetchProviders,
        addProvider,
        updateProvider,
        deleteProvider,
        fetchBookings,
        addBooking,
        updateBooking,
        deleteBooking,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
};
