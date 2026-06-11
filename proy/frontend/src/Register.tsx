import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { Mail, Lock, User, AlertCircle, CheckCircle } from 'lucide-react';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register, isAuthenticated } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const validatePassword = (pwd: string) => {
    if (pwd.length < 8) return 'La contraseña debe tener al menos 8 caracteres';
    if (!/[A-Z]/.test(pwd)) return 'Debe contener al menos una mayúscula';
    if (!/[0-9]/.test(pwd)) return 'Debe contener al menos un número';
    if (!/[!@#$%^&*]/.test(pwd)) return 'Debe contener al menos un carácter especial (!@#$%^&*)';
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (!firstName || !lastName || !email || !password || !confirmPassword) {
        setError('Por favor completa todos los campos');
        setLoading(false);
        return;
      }

      const passError = validatePassword(password);
      if (passError) {
        setError(passError);
        setLoading(false);
        return;
      }

      if (password !== confirmPassword) {
        setError('Las contraseñas no coinciden');
        setLoading(false);
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setError('Por favor ingresa un email válido');
        setLoading(false);
        return;
      }

      await register(email, password, firstName, lastName);
      setSuccess('¡Registro exitoso! Redirigiendo...');

      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Error al registrarse');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '20px' }}>
      <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)', padding: '40px', width: '100%', maxWidth: '450px' }}>
        <h1 style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '10px', color: '#1f2937' }}>🏔️ Bolivia Tours</h1>
        <p style={{ textAlign: 'center', color: '#6b7280', marginBottom: '30px' }}>Crear Nueva Cuenta</p>

        {error && <div className="alert alert-error"><AlertCircle size={20} />{error}</div>}
        {success && <div className="alert alert-success"><CheckCircle size={20} />{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label><User size={20} /> Nombre</label>
              <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Tu nombre" required />
            </div>
            <div className="form-group">
              <label><User size={20} /> Apellido</label>
              <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Tu apellido" required />
            </div>
          </div>

          <div className="form-group">
            <label><Mail size={20} /> Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@email.com" required />
          </div>

          <div className="form-group">
            <label><Lock size={20} /> Contraseña</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mínimo 8 caracteres" required />
            <small style={{ display: 'block', color: '#6b7280', marginTop: '6px' }}>
              ✓ Mínimo 8 caracteres | ✓ 1 mayúscula | ✓ 1 número | ✓ 1 carácter especial
            </small>
          </div>

          <div className="form-group">
            <label><Lock size={20} /> Confirmar Contraseña</label>
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirma tu contraseña" required />
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', marginTop: '10px', fontSize: '1rem', padding: '12px' }}>
            {loading ? '⏳ Registrando...' : 'Registrarse'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '25px', color: '#6b7280', fontSize: '0.95rem' }}>
          ¿Ya tienes cuenta? <Link to="/login" style={{ color: '#2563eb', fontWeight: '500' }}>Inicia sesión aquí</Link>
        </p>
      </div>
    </div>
  );
};
