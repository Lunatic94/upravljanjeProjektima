// src/components/auth/Login.js - Ažuriran sa React Router
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    korisnickoIme: '',
    lozinka: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(formData.korisnickoIme, formData.lozinka);
    
    if (result.success) {
      navigate('/dashboard');
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
            🔊 Upravljanje Projektima
          </h1>
          <p style={{ color: '#666', margin: 0 }}>Prijavite se na svoj nalog</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>
              Korisničko ime
            </label>
            <input
              type="text"
              name="korisnickoIme"
              value={formData.korisnickoIme}
              onChange={handleChange}
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
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>
              Lozinka
            </label>
            <input
              type="password"
              name="lozinka"
              value={formData.lozinka}
              onChange={handleChange}
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
            />
          </div>

          {error && (
            <div style={{
              backgroundColor: '#ffebee',
              color: '#c62828',
              padding: '12px',
              borderRadius: '4px',
              marginBottom: '20px',
              fontSize: '14px'
            }}>
              {error}
              {error.includes('verifikujte') && (
                <div style={{ marginTop: '10px' }}>
                  <button
                    type="button"
                    onClick={() => navigate('/resend-verification')}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#2196f3',
                      textDecoration: 'underline',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontSize: '14px'
                    }}
                  >
                    Pošaljite ponovo verifikacioni email
                  </button>
                </div>
              )}
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
            {loading ? 'Prijavljivanje...' : 'Prijavite se'}
          </button>
        </form>

        <div style={{ textAlign: 'center' }}>
          <p style={{ margin: 0, color: '#666' }}>
            Nemate nalog?{' '}
            <button 
              onClick={() => navigate('/register')}
              style={{ 
                background: 'none', 
                border: 'none', 
                color: '#1976d2', 
                textDecoration: 'underline', 
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              Registrujte se
            </button>
          </p>
        </div>

        {/* Test korisnici info */}
        <div style={{ 
          marginTop: '30px', 
          padding: '15px', 
          background: '#f8f9fa', 
          borderRadius: '8px',
          fontSize: '14px'
        }}>
          <p style={{ margin: '0 0 10px 0', fontWeight: '600', color: '#333' }}>
            Test korisnici:
          </p>
          <div style={{ color: '#666' }}>
            👤 admin/password123<br />
            👤 marko_menadzer/password123<br />
            👤 ana_dev/password123
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;