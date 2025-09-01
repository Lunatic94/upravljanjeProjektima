import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const [korisnickoIme, setKorisnickoIme] = useState('admin');
  const [lozinka, setLozinka] = useState('test123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(korisnickoIme, lozinka);
    if (result.success) {
      // Ne treba onLoginSuccess() - React Router automatski preusmava
      console.log('Login uspešan - React Router će automatski preusmeriti');
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <div style={{ 
        maxWidth: '400px', 
        width: '100%',
        background: 'white',
        padding: '40px', 
        borderRadius: '12px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ color: '#1976d2', marginBottom: '10px', fontSize: '28px' }}>
            📊 Upravljanje Projektima
          </h1>
          <p style={{ color: '#666', margin: 0 }}>Prijavite se na vaš nalog</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>
              Korisničko ime
            </label>
            <input
              type="text"
              value={korisnickoIme}
              onChange={(e) => setKorisnickoIme(e.target.value)}
              required
              style={{ 
                width: '100%', 
                padding: '12px 16px', 
                border: '2px solid #e0e0e0', 
                borderRadius: '8px',
                fontSize: '16px',
                transition: 'border-color 0.3s',
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = '#1976d2'}
              onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>
              Lozinka
            </label>
            <input
              type="password"
              value={lozinka}
              onChange={(e) => setLozinka(e.target.value)}
              required
              style={{ 
                width: '100%', 
                padding: '12px 16px', 
                border: '2px solid #e0e0e0', 
                borderRadius: '8px',
                fontSize: '16px',
                transition: 'border-color 0.3s',
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = '#1976d2'}
              onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
            />
          </div>

          {error && (
            <div style={{ 
              background: '#ffebee',
              color: '#c62828',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '20px',
              fontSize: '14px',
              border: '1px solid #ffcdd2'
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              background: loading ? '#ccc' : 'linear-gradient(135deg, #1976d2, #42a5f5)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginBottom: '20px',
              transition: 'all 0.3s'
            }}
          >
            {loading ? 'Prijavljivanje...' : 'Prijavi se'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <p style={{ margin: '0 0 10px 0', color: '#666' }}>
            Nemate nalog?{' '}
            <Link 
              to="/register"
              style={{ 
                color: '#1976d2', 
                textDecoration: 'underline', 
                fontWeight: '600'
              }}
            >
              Registrujte se
            </Link>
          </p>
        </div>

        <div style={{ 
          background: '#f8f9fa', 
          padding: '16px', 
          borderRadius: '8px', 
          fontSize: '13px',
          color: '#666'
        }}>
          <div style={{ fontWeight: '600', marginBottom: '8px', color: '#333' }}>
            Test korisnici:
          </div>
          <div style={{ marginBottom: '4px' }}>👤 admin / test123 (Admin)</div>
          <div style={{ marginBottom: '4px' }}>👤 marko_menadzer / test123 (Menadžer)</div>
          <div>👤 ana_dev / test123 (Programer)</div>
        </div>
      </div>
    </div>
  );
};

export default Login;