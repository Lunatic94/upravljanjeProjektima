import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    ime: '',
    prezime: '',
    korisnickoIme: '',
    email: '',
    lozinka: '',
    confirmLozinka: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (formData.lozinka !== formData.confirmLozinka) {
      setError('Lozinke se ne poklapaju');
      return;
    }

    if (formData.lozinka.length < 6) {
      setError('Lozinka mora imati najmanje 6 karaktera');
      return;
    }

    setLoading(true);

    // Uklanjamo confirmLozinka iz podataka pre slanja
    const { confirmLozinka, ...registrationData } = formData;
    
    const result = await register(registrationData);
    
    if (result.success) {
      // Automatski preusmeri na login stranicu
      navigate('/login');
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
        maxWidth: '450px', 
        width: '100%',
        background: 'white',
        padding: '40px', 
        borderRadius: '12px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ color: '#1976d2', marginBottom: '10px', fontSize: '28px' }}>
            📊 Registracija
          </h1>
          <p style={{ color: '#666', margin: 0 }}>Kreirajte vaš nalog</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>
                Ime *
              </label>
              <input
                type="text"
                name="ime"
                value={formData.ime}
                onChange={handleChange}
                required
                style={{ 
                  width: '100%', 
                  padding: '12px 16px', 
                  border: '2px solid #e0e0e0', 
                  borderRadius: '8px',
                  fontSize: '16px',
                  outline: 'none'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>
                Prezime *
              </label>
              <input
                type="text"
                name="prezime"
                value={formData.prezime}
                onChange={handleChange}
                required
                style={{ 
                  width: '100%', 
                  padding: '12px 16px', 
                  border: '2px solid #e0e0e0', 
                  borderRadius: '8px',
                  fontSize: '16px',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>
              Korisničko ime *
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
                outline: 'none'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={{ 
                width: '100%', 
                padding: '12px 16px', 
                border: '2px solid #e0e0e0', 
                borderRadius: '8px',
                fontSize: '16px',
                outline: 'none'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>
              Lozinka *
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
                outline: 'none'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>
              Potvrdi lozinku *
            </label>
            <input
              type="password"
              name="confirmLozinka"
              value={formData.confirmLozinka}
              onChange={handleChange}
              required
              style={{ 
                width: '100%', 
                padding: '12px 16px', 
                border: '2px solid #e0e0e0', 
                borderRadius: '8px',
                fontSize: '16px',
                outline: 'none'
              }}
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
              marginBottom: '20px'
            }}
          >
            {loading ? 'Registracija u toku...' : 'Registruj se'}
          </button>
        </form>

        <div style={{ textAlign: 'center' }}>
          <p style={{ margin: 0, color: '#666' }}>
            Već imate nalog?{' '}
            <Link 
              to="/login"
              style={{ 
                color: '#1976d2', 
                textDecoration: 'underline', 
                fontWeight: '600'
              }}
            >
              Prijavite se
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;