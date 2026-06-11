import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { apiService } from './api/ApiService';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('admin@bolivia-tours.com');
  const [password, setPassword] = useState('Admin123!@');
  const [captchaQuestion, setCaptchaQuestion] = useState('');
  const [captchaAnswer, setCaptchaAnswer] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    generateCaptcha();
  }, []);

  const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    setCaptchaQuestion(`${num1} + ${num2}`);
    setCaptchaAnswer('');
  };

  const handleLogin = async () => {
    try {
      setError('');
      setLoading(true);

      // Validar CAPTCHA
      const [num1, num2] = captchaQuestion.split('+').map(n => parseInt(n.trim()));
      const correctAnswer = num1 + num2;
      
      if (parseInt(captchaAnswer) !== correctAnswer) {
        setError('❌ Respuesta de CAPTCHA incorrecta');
        generateCaptcha();
        setLoading(false);
        return;
      }

      // Login
      await login(email, password);
      
      // Redirigir al dashboard
      setTimeout(() => {
        navigate('/dashboard');
      }, 500);
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
      generateCaptcha();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '20px' }}>
      <div style={{ background: 'white', borderRadius: '12px', padding: '40px', width: '100%', maxWidth: '400px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
        <h1 style={{ fontSize: '2rem', color: '#1f2937', marginBottom: '10px', textAlign: 'center' }}>🏔️ Bolivia Tours</h1>
        <p style={{ textAlign: 'center', color: '#6b7280', marginBottom: '30px' }}>Sistema de Registro Turístico</p>

        {error && (
          <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', color: '#991b1b', padding: '12px', borderRadius: '6px', marginBottom: '20px', fontSize: '0.9rem' }}>
            {error}
          </div>
        )}

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontWeight: '500', marginBottom: '8px', color: '#1f2937' }}>📧 Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@bolivia-tours.com"
            style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '1rem', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontWeight: '500', marginBottom: '8px', color: '#1f2937' }}>🔐 Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Admin123!@"
            style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '1rem', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '20px', background: '#fef3c7', border: '1px solid #fcd34d', padding: '12px', borderRadius: '6px' }}>
          <p style={{ marginBottom: '8px', fontWeight: '500', color: '#92400e' }}>🤖 Verifica que eres humano:</p>
          <p style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px' }}>¿Cuánto es {captchaQuestion}?</p>
          <input
            type="number"
            value={captchaAnswer}
            onChange={(e) => setCaptchaAnswer(e.target.value)}
            placeholder="Respuesta"
            style={{ width: '100%', padding: '12px', border: '1px solid #fcd34d', borderRadius: '6px', fontSize: '1rem', boxSizing: 'border-box' }}
          />
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px',
            background: loading ? '#9ca3af' : '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: loading ? 'not-allowed' : 'pointer',
            marginBottom: '15px',
          }}
        >
          {loading ? '⏳ Conectando...' : '✨ Iniciar Sesión'}
        </button>

        <div style={{ background: '#dbeafe', border: '1px solid #93c5fd', padding: '12px', borderRadius: '6px', fontSize: '0.85rem', color: '#1e40af' }}>
          <p style={{ margin: '0 0 8px 0', fontWeight: '600' }}>💡 Credenciales de prueba:</p>
          <p style={{ margin: '4px 0' }}>📧 admin@bolivia-tours.com</p>
          <p style={{ margin: '4px 0' }}>🔐 Admin123!@</p>
        </div>

        <p style={{ textAlign: 'center', marginTop: '20px', color: '#6b7280', fontSize: '0.9rem' }}>
          ¿No tienes cuenta? <a href="/register" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: '600' }}>Regístrate aquí</a>
        </p>
      </div>
    </div>
  );
};
