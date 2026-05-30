import React, { useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';

interface Provider {
  id: string;
  name: string;
  type: string;
  destination: string;
  rating: number;
  price: number;
  contact: string;
  phone: string;
}

export const Providers: React.FC = () => {
  const [providers, setProviders] = useState<Provider[]>([
    { id: '1', name: 'Uyuni Turismo', type: 'Tour', destination: 'Salar', rating: 4.8, price: 250, contact: 'uyuni@tour.com', phone: '+591-2-2445678' },
    { id: '2', name: 'Hotel Luna', type: 'Hotel', destination: 'Salar', rating: 4.6, price: 120, contact: 'luna@hotel.com', phone: '+591-2-2441000' },
    { id: '3', name: 'Plaza Mayor', type: 'Hotel', destination: 'La Paz', rating: 4.7, price: 180, contact: 'plaza@hotel.com', phone: '+591-2-2312345' }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Provider, 'id'>>({ name: '', type: 'Tour', destination: '', rating: 0, price: 0, contact: '', phone: '' });

  const handleOpenModal = (prov?: Provider) => {
    if (prov) {
      setEditingId(prov.id);
      setFormData({ name: prov.name, type: prov.type, destination: prov.destination, rating: prov.rating, price: prov.price, contact: prov.contact, phone: prov.phone });
    } else {
      setEditingId(null);
      setFormData({ name: '', type: 'Tour', destination: '', rating: 0, price: 0, contact: '', phone: '' });
    }
    setShowModal(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.destination) {
      alert('Completa campos requeridos');
      return;
    }
    if (editingId) {
      setProviders(providers.map(p => p.id === editingId ? { ...formData, id: editingId } : p));
    } else {
      setProviders([...providers, { ...formData, id: Date.now().toString() }]);
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Eliminar?')) {
      setProviders(providers.filter(p => p.id !== id));
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
      <h1>🏢 Gestión de Proveedores</h1>
      <button onClick={() => handleOpenModal()} className="btn btn-success" style={{ marginBottom: '20px' }}>
        <Plus size={20} /> Nuevo Proveedor
      </button>
      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Tipo</th>
              <th>Destino</th>
              <th>Rating</th>
              <th>Precio</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {providers.map(prov => (
              <tr key={prov.id}>
                <td>{prov.name}</td>
                <td>{prov.type}</td>
                <td>{prov.destination}</td>
                <td>⭐ {prov.rating}</td>
                <td>${prov.price}</td>
                <td>
                  <div className="action-buttons">
                    <button onClick={() => handleOpenModal(prov)} className="btn btn-primary" style={{ padding: '6px 12px' }}>
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDelete(prov.id)} className="btn btn-danger" style={{ padding: '6px 12px' }}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
              <label>Tipo</label>
              <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })}>
                <option>Tour</option>
                <option>Hotel</option>
                <option>Restaurante</option>
                <option>Transporte</option>
              </select>
            </div>
            <div className="form-group">
              <label>Destino</label>
              <input value={formData.destination} onChange={(e) => setFormData({ ...formData, destination: e.target.value })} />
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
