import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { useData } from './DataContext';
import { Plus, Edit2, Trash2, Download, RotateCcw } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { destinations, addDestination, updateDestination, deleteDestination, exportData, getStorageStats } = useData();
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({ name: '', region: '', category: 'Natural', visitors: 0, price: 0, description: '' });
  const stats = getStorageStats();

  const handleOpenModal = (dest?: any) => {
    if (dest) {
      setEditingId(dest.id);
      setFormData(dest);
    } else {
      setEditingId(null);
      setFormData({ name: '', region: '', category: 'Natural', visitors: 0, price: 0, description: '' });
    }
    setShowModal(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.region) {
      alert('Por favor completa los campos requeridos');
      return;
    }

    if (editingId) {
      updateDestination(editingId, formData);
    } else {
      addDestination(formData);
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar este destino?')) {
      deleteDestination(id);
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
      <h1 style={{ fontSize: '2rem', color: '#1f2937', marginBottom: '10px' }}>Dashboard</h1>
      <p style={{ color: '#6b7280', fontSize: '1.1rem', marginBottom: '20px' }}>Bienvenido, {user?.firstName}! 👋</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div style={{ background: '#f3f4f6', padding: '20px', borderRadius: '8px', borderLeft: '4px solid #2563eb' }}>
          <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>Total Destinos</p>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937' }}>{destinations.length}</p>
        </div>
        <div style={{ background: '#f3f4f6', padding: '20px', borderRadius: '8px', borderLeft: '4px solid #10b981' }}>
          <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>Almacenamiento</p>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' }}>{(stats.totalSize / 1024).toFixed(2)} KB</p>
        </div>
        <div style={{ background: '#f3f4f6', padding: '20px', borderRadius: '8px', borderLeft: '4px solid #f59e0b' }}>
          <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>Última Sincronización</p>
          <p style={{ fontSize: '0.9rem', color: '#1f2937' }}>{new Date(stats.lastSync).toLocaleString()}</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button onClick={() => handleOpenModal()} className="btn btn-success" style={{ padding: '12px 20px' }}>
          <Plus size={20} /> Nuevo Destino
        </button>
        <button onClick={exportData} className="btn btn-primary" style={{ padding: '12px 20px' }}>
          <Download size={20} /> Descargar Respaldo
        </button>
      </div>

      <div className="card">
        <h2 style={{ marginBottom: '20px' }}>🗺️ Destinos Turísticos</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
              <th style={{ padding: '12px', textAlign: 'left', background: '#f9fafb', fontWeight: 'bold' }}>Nombre</th>
              <th style={{ padding: '12px', textAlign: 'left', background: '#f9fafb', fontWeight: 'bold' }}>Región</th>
              <th style={{ padding: '12px', textAlign: 'left', background: '#f9fafb', fontWeight: 'bold' }}>Categoría</th>
              <th style={{ padding: '12px', textAlign: 'left', background: '#f9fafb', fontWeight: 'bold' }}>Visitantes</th>
              <th style={{ padding: '12px', textAlign: 'left', background: '#f9fafb', fontWeight: 'bold' }}>Precio</th>
              <th style={{ padding: '12px', textAlign: 'left', background: '#f9fafb', fontWeight: 'bold' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {destinations.map(dest => (
              <tr key={dest.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: '12px' }}>{dest.name}</td>
                <td style={{ padding: '12px' }}>{dest.region}</td>
                <td style={{ padding: '12px' }}><span style={{ background: '#dbeafe', padding: '4px 12px', borderRadius: '4px' }}>{dest.category}</span></td>
                <td style={{ padding: '12px' }}>{dest.visitors.toLocaleString()}</td>
                <td style={{ padding: '12px' }}>${dest.price}</td>
                <td style={{ padding: '12px' }}>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => handleOpenModal(dest)} className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '0.9rem' }}>
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDelete(dest.id)} className="btn btn-danger" style={{ padding: '6px 12px', fontSize: '0.9rem' }}>
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
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }} onClick={() => setShowModal(false)}>
          <div style={{ background: 'white', borderRadius: '8px', padding: '30px', width: '90%', maxWidth: '500px', maxHeight: '90vh', overflow: 'auto' }} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ marginBottom: '20px' }}>{editingId ? 'Editar' : 'Nuevo'} Destino</h2>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontWeight: '500', marginBottom: '8px' }}>Nombre</label>
              <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '6px' }} />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontWeight: '500', marginBottom: '8px' }}>Región</label>
              <input type="text" value={formData.region} onChange={(e) => setFormData({ ...formData, region: e.target.value })} style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '6px' }} />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontWeight: '500', marginBottom: '8px' }}>Categoría</label>
              <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '6px' }}>
                <option>Natural</option>
                <option>Cultural</option>
                <option>Adventure</option>
                <option>Urban</option>
              </select>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontWeight: '500', marginBottom: '8px' }}>Precio</label>
              <input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })} style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '6px' }} />
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
