import React, { useState } from 'react';
import { useData } from './DataContext';
import { Plus, Edit2, Trash2, Download } from 'lucide-react';
import { generateTouristReceiptPDF, TouristReceipt } from './PDFService';

export const Bookings: React.FC = () => {
  const { bookings, addBooking, updateBooking, deleteBooking } = useData();
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({
    firstName: '',
    lastName: '',
    email: '',
    destination: '',
    provider: '',
    checkIn: '',
    checkOut: '',
    guests: 1,
    totalPrice: 0
  });

  const handleOpenModal = (booking?: any) => {
    if (booking) {
      setEditingId(booking.id);
      setFormData(booking);
    } else {
      setEditingId(null);
      setFormData({ firstName: '', lastName: '', email: '', destination: '', provider: '', checkIn: '', checkOut: '', guests: 1, totalPrice: 0 });
    }
    setShowModal(true);
  };

  const handleSave = () => {
    if (!formData.firstName || !formData.lastName || !formData.email) {
      alert('Por favor completa los campos requeridos');
      return;
    }

    if (editingId) {
      updateBooking(editingId, formData);
    } else {
      addBooking(formData);
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Estás seguro?')) {
      deleteBooking(id);
    }
  };

  const handlePrintReceipt = (booking: any) => {
    const receipt: TouristReceipt = {
      id: booking.id,
      firstName: booking.firstName,
      lastName: booking.lastName,
      email: booking.email,
      destination: booking.destination,
      provider: booking.provider,
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
      guests: booking.guests,
      totalPrice: booking.totalPrice,
      bookingRef: booking.reference || 'BKG-' + booking.id,
      date: new Date().toLocaleDateString('es-ES')
    };
    generateTouristReceiptPDF(receipt);
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
      <h1 style={{ fontSize: '2rem', color: '#1f2937', marginBottom: '10px' }}>📅 Reservas Turísticas</h1>
      <p style={{ color: '#6b7280', fontSize: '1.1rem', marginBottom: '40px' }}>Total de reservas: {bookings.length}</p>

      <button onClick={() => handleOpenModal()} className="btn btn-success" style={{ marginBottom: '20px', padding: '12px 20px' }}>
        <Plus size={20} /> Nueva Reserva
      </button>

      <div className="card">
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
              <th style={{ padding: '12px', textAlign: 'left', background: '#f9fafb', fontWeight: 'bold' }}>Nombre</th>
              <th style={{ padding: '12px', textAlign: 'left', background: '#f9fafb', fontWeight: 'bold' }}>Email</th>
              <th style={{ padding: '12px', textAlign: 'left', background: '#f9fafb', fontWeight: 'bold' }}>Destino</th>
              <th style={{ padding: '12px', textAlign: 'left', background: '#f9fafb', fontWeight: 'bold' }}>Fechas</th>
              <th style={{ padding: '12px', textAlign: 'left', background: '#f9fafb', fontWeight: 'bold' }}>Total</th>
              <th style={{ padding: '12px', textAlign: 'left', background: '#f9fafb', fontWeight: 'bold' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(booking => (
              <tr key={booking.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: '12px' }}>{booking.firstName} {booking.lastName}</td>
                <td style={{ padding: '12px' }}>{booking.email}</td>
                <td style={{ padding: '12px' }}>{booking.destination}</td>
                <td style={{ padding: '12px' }}>{booking.checkIn} a {booking.checkOut}</td>
                <td style={{ padding: '12px' }}>${booking.totalPrice}</td>
                <td style={{ padding: '12px' }}>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <button onClick={() => handlePrintReceipt(booking)} className="btn btn-warning" style={{ padding: '6px 12px', fontSize: '0.9rem' }}>
                      <Download size={16} />
                    </button>
                    <button onClick={() => handleOpenModal(booking)} className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '0.9rem' }}>
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDelete(booking.id)} className="btn btn-danger" style={{ padding: '6px 12px', fontSize: '0.9rem' }}>
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
            <h2 style={{ marginBottom: '20px' }}>{editingId ? 'Editar' : 'Nueva'} Reserva</h2>

            <div style={{ marginBottom: '15px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', fontWeight: '500', marginBottom: '8px' }}>Nombre</label>
                <input type="text" value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '6px' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: '500', marginBottom: '8px' }}>Apellido</label>
                <input type="text" value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '6px' }} />
              </div>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', fontWeight: '500', marginBottom: '8px' }}>Email</label>
              <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '6px' }} />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', fontWeight: '500', marginBottom: '8px' }}>Destino</label>
              <input type="text" value={formData.destination} onChange={(e) => setFormData({ ...formData, destination: e.target.value })} style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '6px' }} />
            </div>

            <div style={{ marginBottom: '15px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', fontWeight: '500', marginBottom: '8px' }}>Check-in</label>
                <input type="date" value={formData.checkIn} onChange={(e) => setFormData({ ...formData, checkIn: e.target.value })} style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '6px' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: '500', marginBottom: '8px' }}>Check-out</label>
                <input type="date" value={formData.checkOut} onChange={(e) => setFormData({ ...formData, checkOut: e.target.value })} style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '6px' }} />
              </div>
            </div>

            <div style={{ marginBottom: '15px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', fontWeight: '500', marginBottom: '8px' }}>Huéspedes</label>
                <input type="number" value={formData.guests} onChange={(e) => setFormData({ ...formData, guests: parseInt(e.target.value) })} style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '6px' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: '500', marginBottom: '8px' }}>Precio Total</label>
                <input type="number" value={formData.totalPrice} onChange={(e) => setFormData({ ...formData, totalPrice: parseFloat(e.target.value) })} style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '6px' }} />
              </div>
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
