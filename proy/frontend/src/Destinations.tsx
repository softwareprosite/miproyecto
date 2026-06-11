import React, { useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';

interface Destination {
  id: string;
  name: string;
  region: string;
  category: string;
  visitors: number;
  price: number;
  description: string;
}

export const Destinations: React.FC = () => {
  const [destinations, setDestinations] = useState<Destination[]>([
    { id: '1', name: 'Salar de Uyuni', region: 'Potosí', category: 'Natural', visitors: 50000, price: 50, description: 'El mayor salar' },
    { id: '2', name: 'La Paz', region: 'La Paz', category: 'Urban', visitors: 80000, price: 20, description: 'Capital' },
    { id: '3', name: 'Isla del Sol', region: 'La Paz', category: 'Cultural', visitors: 35000, price: 30, description: 'Sagrada' },
    { id: '4', name: 'Madidi', region: 'Beni', category: 'Adventure', visitors: 25000, price: 60, description: 'Biodiversa' },
    { id: '5', name: 'Potosí', region: 'Potosí', category: 'Cultural', visitors: 40000, price: 35, description: 'Histórica' }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Destination, 'id'>>({ name: '', region: '', category: 'Natural', visitors: 0, price: 0, description: '' });

  const handleOpenModal = (dest?: Destination) => {
    if (dest) {
      setEditingId(dest.id);
      setFormData({ name: dest.name, region: dest.region, category: dest.category, visitors: dest.visitors, price: dest.price, description: dest.description });
    } else {
      setEditingId(null);
      setFormData({ name: '', region: '', category: 'Natural', visitors: 0, price: 0, description: '' });
    }
    setShowModal(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.region) {
      alert('Completa campos requeridos');
      return;
    }
    if (editingId) {
      setDestinations(destinations.map(d => d.id === editingId ? { ...formData, id: editingId } : d));
    } else {
      setDestinations([...destinations, { ...formData, id: Date.now().toString() }]);
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Eliminar?')) {
      setDestinations(destinations.filter(d => d.id !== id));
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
      <h1>🗺️ Gestión de Destinos</h1>
      <button onClick={() => handleOpenModal()} className="btn btn-success" style={{ marginBottom: '20px' }}>
        <Plus size={20} /> Nuevo Destino
      </button>
      <div className="card">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {destinations.map(dest => (
            <div key={dest.id} style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '20px' }}>
              <h3>{dest.name}</h3>
              <p style={{ color: '#6b7280' }}>{dest.region}</p>
              <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>{dest.visitors.toLocaleString()} visitantes - ${dest.price}</p>
              <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                <button onClick={() => handleOpenModal(dest)} className="btn btn-primary" style={{ flex: 1 }}>
                  <Edit2 size={16} />
                </button>
                <button onClick={() => handleDelete(dest.id)} className="btn btn-danger" style={{ flex: 1 }}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{editingId ? 'Editar' : 'Nuevo'}</h2>
            <div className="form-group">
              <label>Nombre</label>
              <input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Región</label>
              <input value={formData.region} onChange={(e) => setFormData({ ...formData, region: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Categoría</label>
              <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                <option>Natural</option>
                <option>Cultural</option>
                <option>Adventure</option>
                <option>Urban</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button onClick={handleSave} className="btn btn-success" style={{ flex: 1 }}>Guardar</button>
              <button onClick={() => setShowModal(false)} className="btn btn-secondary" style={{ flex: 1 }}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
