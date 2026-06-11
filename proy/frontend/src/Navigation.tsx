import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { Menu, X, LogOut, Home, MapPin, Users, Calendar, BarChart3, Plus } from 'lucide-react';

export const Navigation: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav style={{
      background: '#1f2937',
      color: 'white',
      padding: '1rem 0',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/dashboard" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', textDecoration: 'none' }}>
          🏔️ Bolivia Tours
        </Link>

        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{ display: 'none', background: 'none', border: 'none', color: 'white', fontSize: '1.5rem', cursor: 'pointer' }}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
          <div style={{ display: 'flex', gap: '30px' }}>
            <Link to="/dashboard" style={{ color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}><Home size={18} /> Dashboard</Link>
            <Link to="/destinations" style={{ color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}><MapPin size={18} /> Destinos</Link>
            <Link to="/providers" style={{ color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}><Users size={18} /> Proveedores</Link>
            <Link to="/bookings" style={{ color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}><Calendar size={18} /> Reservas</Link>
            <Link to="/reports" style={{ color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}><BarChart3 size={18} /> Reportes</Link>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <span>👤 {user.firstName} {user.lastName}</span>
            <button onClick={handleLogout} style={{ background: '#dc2626', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <LogOut size={18} /> Salir
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
