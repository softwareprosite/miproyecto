import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { Mail, Lock, AlertCircle, CheckCircle } from 'lucide-react';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [captchaAnswer, setCaptchaAnswer] = useState('');
  const [captcha, setCaptcha] = useState<{ challenge: string; answer: string }>({ challenge: '', answer: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    generateCaptcha();
  }, []);

  const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    setCaptcha({
      challenge: `${num1} + ${num2}`,
      answer: (num1 + num2).toString()
    });
    setCaptchaAnswer('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (!email || !password || !captchaAnswer) {
        setError('Por favor completa todos los campos');
        setLoading(false);
        return;
      }

      if (captchaAnswer !== captcha.answer) {
        setError('CAPTCHA incorrecto');
        generateCaptcha();
        setLoading(false);
        return;
      }

      await login(email, password);
      setSuccess('¡Login exitoso! Redirigiendo...');
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
      generateCaptcha();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '20px' }}>
      <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)', padding: '40px', width: '100%', maxWidth: '450px' }}>
        <h1 style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '10px', color: '#1f2937' }}>🏔️ Bolivia Tours</h1>
        <p style={{ textAlign: 'center', color: '#6b7280', marginBottom: '30px' }}>Sistema de Registro Turístico</p>

        {error && <div className="alert alert-error"><AlertCircle size={20} />{error}</div>}
        {success && <div className="alert alert-success"><CheckCircle size={20} />{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label><Mail size={20} /> Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@email.com" required />
          </div>

          <div className="form-group">
            <label><Lock size={20} /> Contraseña</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
          </div>

          <div style={{ background: '#f3f4f6', padding: '15px', borderRadius: '6px', marginBottom: '20px', border: '1px solid #e5e7eb' }}>
            <p style={{ fontWeight: '500', color: '#374151', marginBottom: '10px', fontSize: '0.95rem' }}>¿Cuánto es {captcha.challenge}?</p>
            <input type="text" value={captchaAnswer} onChange={(e) => setCaptchaAnswer(e.target.value)} placeholder="Ingresa la respuesta" inputMode="numeric" />
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', marginTop: '10px', fontSize: '1rem', padding: '12px' }}>
            {loading ? '⏳ Ingresando...' : 'Iniciar Sesión'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '25px', color: '#6b7280', fontSize: '0.95rem' }}>
          ¿No tienes cuenta? <Link to="/register" style={{ color: '#2563eb', fontWeight: '500' }}>Regístrate aquí</Link>
        </p>

        <div style={{ background: '#fef3c7', border: '1px solid #fcd34d', borderRadius: '6px', padding: '15px', marginTop: '20px', fontSize: '0.9rem', color: '#78350f' }}>
          <p style={{ margin: '5px 0', fontWeight: 'bold' }}>Credenciales de prueba:</p>
          <p style={{ margin: '5px 0' }}>📧 Email: admin@bolivia-tours.com</p>
          <p style={{ margin: '5px 0' }}>🔐 Contraseña: Admin123!@</p>
        </div>
      </div>
    </div>
  );
};
