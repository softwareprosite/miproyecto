import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

export const Reports: React.FC = () => {
  const visitorsData = [
    { name: 'Uyuni', visitors: 50000 },
    { name: 'La Paz', visitors: 80000 },
    { name: 'Isla del Sol', visitors: 35000 },
    { name: 'Madidi', visitors: 25000 },
    { name: 'Potosí', visitors: 40000 }
  ];

  const categoryData = [
    { name: 'Natural', value: 50000 },
    { name: 'Cultural', value: 75000 },
    { name: 'Adventure', value: 25000 },
    { name: 'Urban', value: 80000 }
  ];

  const COLORS = ['#3b82f6', '#f59e0b', '#ef4444', '#10b981'];

  const bookingStats = [
    { month: 'Enero', bookings: 12 },
    { month: 'Febrero', bookings: 19 },
    { month: 'Marzo', bookings: 15 },
    { month: 'Abril', bookings: 22 },
    { month: 'Mayo', bookings: 28 },
    { month: 'Junio', bookings: 35 }
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
      <h1>📊 Reportes y Estadísticas</h1>
      <p style={{ color: '#6b7280', marginBottom: '40px' }}>Análisis de datos del sistema turístico</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div className="card">
          <h2>Visitantes por Destino</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={visitorsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="visitors" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h2>Distribución por Categoría</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={categoryData} cx="50%" cy="50%" labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} outerRadius={80} fill="#8884d8" dataKey="value">
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card" style={{ gridColumn: 'span 2' }}>
          <h2>Reservas por Mes</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={bookingStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="bookings" stroke="#10b981" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <h2>Resumen General</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginTop: '20px' }}>
          <div style={{ padding: '20px', background: '#f9fafb', borderRadius: '8px', borderLeft: '4px solid #3b82f6' }}>
            <span style={{ display: 'block', color: '#6b7280', fontSize: '0.9rem', marginBottom: '8px' }}>Total Visitantes</span>
            <span style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#1f2937' }}>230,000</span>
          </div>
          <div style={{ padding: '20px', background: '#f9fafb', borderRadius: '8px', borderLeft: '4px solid #10b981' }}>
            <span style={{ display: 'block', color: '#6b7280', fontSize: '0.9rem', marginBottom: '8px' }}>Total Reservas</span>
            <span style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#1f2937' }}>131</span>
          </div>
          <div style={{ padding: '20px', background: '#f9fafb', borderRadius: '8px', borderLeft: '4px solid #f59e0b' }}>
            <span style={{ display: 'block', color: '#6b7280', fontSize: '0.9rem', marginBottom: '8px' }}>Ingresos Totales</span>
            <span style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#1f2937' }}>$18,500</span>
          </div>
          <div style={{ padding: '20px', background: '#f9fafb', borderRadius: '8px', borderLeft: '4px solid #ef4444' }}>
            <span style={{ display: 'block', color: '#6b7280', fontSize: '0.9rem', marginBottom: '8px' }}>Tasa Ocupación</span>
            <span style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#1f2937' }}>87%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
