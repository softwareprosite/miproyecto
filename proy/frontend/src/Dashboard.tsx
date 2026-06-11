import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useData } from './DataContext';
import { Plus, Edit2, Trash2, Download, AlertCircle } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { destinations, loading, error, fetchDestinations, addDestination, updateDestination, deleteDestination } = useData();
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({ name: '', region: '', category: 'Natural', visitors: 0, price: 0, description: '' });
  const [saveError, setSaveError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchDestinations();
  }, []);

  const handleOpenModal = (dest?: any) => {
    setSaveError('');
    if (dest) {
      setEditingId(dest.id);
      setFormData(dest);
    } else {
      setEditingId(null);
      setFormData({ name: '', region: '', category: 'Natural', visitors: 0, price: 0, description: '' });
    }
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      setSaveError('');
      setSaving(true);

      if (!formData.name || !formData.region) {
        setSaveError('Por favor completa los campos requeridos');
        return;
      }

      if (editingId) {
        await updateDestination(editingId, formData);
      } else {
        await addDestination(formData);
      }
      setShowModal(false);
    } catch (err: any) {
      setSaveError(err.message || 'Error al guardar');
    } finally {
      setSaving(false);
    }
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

      {error && (
        <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', color: '#991b1b', padding: '12px', borderRadius: '6px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div style={{ background: '#f3f4f6', padding: '20px', borderRadius: '8px', borderLeft: '4px solid #2563eb' }}>
          <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>Total Destinos</p>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937' }}>{destinations.length}</p>
        </div>
        <div style={{ background: '#f3f4f6', padding: '20px', borderRadius: '8px', borderLeft: '4px solid #10b981' }}>
          <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>Estado</p>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' }}>{loading ? '⏳ Cargando...' : '✅ Listo'}</p>
        </div>
        <div style={{ background: '#f3f4f6', padding: '20px', borderRadius: '8px', borderLeft: '4px solid #f59e0b' }}>
          <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>Rol</p>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' }}>{user?.role}</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button onClick={() => handleOpenModal()} style={{ padding: '12px 20px', background: '#10b981', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={20} /> Nuevo Destino
        </button>
        <button onClick={() => fetchDestinations()} style={{ padding: '12px 20px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}>
          🔄 Actualizar
        </button>
      </div>

      <div style={{ background: 'white', borderRadius: '8px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
        <h2 style={{ marginBottom: '0', padding: '20px', borderBottom: '1px solid #e5e7eb' }}>🗺️ Destinos Turísticos</h2>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>⏳ Cargando destinos...</div>
        ) : destinations.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>No hay destinos. Crea uno nuevo para empezar.</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e5e7eb', background: '#f9fafb' }}>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Nombre</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Región</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Categoría</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Visitantes</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Precio</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {destinations.map((dest) => (
                  <tr key={dest.id} style={{ borderBottom: '1px solid #e5e7eb', background: 'white' }}>
                    <td style={{ padding: '12px' }}>{dest.name}</td>
                    <td style={{ padding: '12px' }}>{dest.region}</td>
                    <td style={{ padding: '12px' }}><span style={{ background: '#dbeafe', color: '#1e40af', padding: '4px 12px', borderRadius: '4px', fontSize: '0.85rem' }}>{dest.category}</span></td>
                    <td style={{ padding: '12px' }}>{dest.estimatedVisitors?.toLocaleString() || 0}</td>
                    <td style={{ padding: '12px' }}>${dest.entryFee || 0}</td>
                    <td style={{ padding: '12px' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => handleOpenModal(dest)} style={{ padding: '6px 12px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.9rem' }}>
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => handleDelete(dest.id)} style={{ padding: '6px 12px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.9rem' }}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }} onClick={() => setShowModal(false)}>
          <div style={{ background: 'white', borderRadius: '8px', padding: '30px', width: '90%', maxWidth: '500px', maxHeight: '90vh', overflow: 'auto' }} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ marginBottom: '20px' }}>{editingId ? 'Editar' : 'Nuevo'} Destino</h2>

            {saveError && (
              <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', color: '#991b1b', padding: '12px', borderRadius: '6px', marginBottom: '20px' }}>
                {saveError}
              </div>
            )}

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontWeight: '500', marginBottom: '8px' }}>Nombre</label>
              <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '6px', boxSizing: 'border-box' }} />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontWeight: '500', marginBottom: '8px' }}>Región</label>
              <input type="text" value={formData.region} onChange={(e) => setFormData({ ...formData, region: e.target.value })} style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '6px', boxSizing: 'border-box' }} />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontWeight: '500', marginBottom: '8px' }}>Categoría</label>
              <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '6px', boxSizing: 'border-box' }}>
                <option>Natural</option>
                <option>Cultural</option>
                <option>Adventure</option>
                <option>Urban</option>
              </select>
            </div>

            <div style={{ marginBottom: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', fontWeight: '500', marginBottom: '8px' }}>Visitantes</label>
                <input type="number" value={formData.estimatedVisitors || 0} onChange={(e) => setFormData({ ...formData, estimatedVisitors: parseInt(e.target.value) })} style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '6px', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: '500', marginBottom: '8px' }}>Precio</label>
                <input type="number" value={formData.entryFee || 0} onChange={(e) => setFormData({ ...formData, entryFee: parseFloat(e.target.value) })} style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '6px', boxSizing: 'border-box' }} />
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontWeight: '500', marginBottom: '8px' }}>Descripción</label>
              <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '6px', boxSizing: 'border-box', minHeight: '100px' }} />
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button onClick={handleSave} disabled={saving} style={{ flex: 1, padding: '12px', background: saving ? '#9ca3af' : '#10b981', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: saving ? 'not-allowed' : 'pointer' }}>
                {saving ? '⏳ Guardando...' : '✅ Guardar'}
              </button>
              <button onClick={() => setShowModal(false)} style={{ flex: 1, padding: '12px', background: '#6b7280', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
