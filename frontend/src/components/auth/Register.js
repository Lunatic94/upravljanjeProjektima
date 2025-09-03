// src/components/auth/Register.js - KOMPLETNA verzija sa React Router
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    korisnickoIme: '',
    email: '',
    lozinka: '',
    potvrdaLozinke: '',
    ime: '',
    prezime: '',
    uloga: 'PROGRAMER'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.lozinka !== formData.potvrdaLozinke) {
      setError('Lozinke se ne poklapaju');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8080/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          korisnickoIme: formData.korisnickoIme,
          email: formData.email,
          lozinka: formData.lozinka,
          ime: formData.ime,
          prezime: formData.prezime,
          uloga: formData.uloga
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Uspešna registracija - prikaži poruku o verifikaciji
        setRegistrationSuccess(true);
        // Sacuvaj email u localStorage za slučaj da korisnik treba ponovo da pošalje verifikaciju
        localStorage.setItem('registrationEmail', formData.email);
      } else {
        setError(data.error || 'Greška pri registraciji');
      }
    } catch (err) {
      setError('Greška pri registraciji');
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Inline funkcija za email provider linkove (da izbegnemo import greške)
  const getEmailProviderLink = (email) => {
    if (!email || !email.includes('@')) return null;
    
    const domain = email.split('@')[1]?.toLowerCase();
    const providers = {
      'gmail.com': 'https://mail.google.com',
      'yahoo.com': 'https://mail.yahoo.com',
      'outlook.com': 'https://outlook.live.com',
      'hotmail.com': 'https://outlook.live.com'
    };
    
    return providers[domain] || null;
  };

  // Ako je registracija uspešna, prikaži poruku o verifikaciji
  if (registrationSuccess) {
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
          backgroundColor: 'white',
          padding: '40px',
          borderRadius: '12px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
          textAlign: 'center',
          maxWidth: '500px',
          width: '100%'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            backgroundColor: '#4caf50',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px'
          }}>
            <span style={{ color: 'white', fontSize: '30px' }}>✓</span>
          </div>
          
          <h2 style={{ color: '#4caf50', marginBottom: '16px' }}>
            Registracija je uspešna!
          </h2>
          
          <p style={{ color: '#333', marginBottom: '20px', lineHeight: '1.5' }}>
            Poslat je verifikacioni email na <strong>{formData.email}</strong>.
            <br />
            Molimo kliknite na link u email-u da aktivirate svoj nalog.
          </p>
          
          <p style={{ color: '#666', fontSize: '14px', marginBottom: '30px' }}>
            Proverite svoj inbox i spam folder ako ne vidite email.
          </p>
          
          {/* Email Provider Link */}
          {getEmailProviderLink(formData.email) && (
            <div style={{ marginBottom: '20px' }}>
              <p style={{ color: '#666', fontSize: '14px', marginBottom: '10px' }}>
                Otvorite vaš email provajder:
              </p>
              <a
                href={getEmailProviderLink(formData.email)}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: '#2196f3',
                  textDecoration: 'none',
                  fontWeight: '600',
                  padding: '8px 16px',
                  border: '2px solid #2196f3',
                  borderRadius: '4px',
                  display: 'inline-block'
                }}
              >
                Otvorite Email
              </a>
            </div>
          )}
          
          <div>
            <button
              onClick={() => navigate('/login')}
              style={{
                backgroundColor: '#2196f3',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                cursor: 'pointer',
                marginRight: '10px',
                fontWeight: '600'
              }}
            >
              Idite na prijavu
            </button>
            
            <button
              onClick={() => navigate('/resend-verification')}
              style={{
                backgroundColor: '#666',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              Ponovi verifikaciju
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Osnovna registracijska forma
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
          <p style={{ color: '#666', margin: 0 }}>Kreirajte novi nalog</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>
                Ime
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
                  transition: 'border-color 0.3s',
                  outline: 'none'
                }}
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>
                Prezime
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
                  transition: 'border-color 0.3s',
                  outline: 'none'
                }}
              />
            </div>
          </div>

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
              Email
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

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>
              Potvrda lozinke
            </label>
            <input
              type="password"
              name="potvrdaLozinke"
              value={formData.potvrdaLozinke}
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
              Uloga
            </label>
            <select
              name="uloga"
              value={formData.uloga}
              onChange={handleChange}
              style={{ 
                width: '100%', 
                padding: '12px 16px', 
                border: '2px solid #e0e0e0', 
                borderRadius: '8px',
                fontSize: '16px',
                transition: 'border-color 0.3s',
                outline: 'none'
              }}
            >
              <option value="PROGRAMER">Programer</option>
              <option value="MENADZER_PROJEKTA">Menadžer Projekta</option>
            </select>
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
            {loading ? 'Registrovanje...' : 'Registruj se'}
          </button>
        </form>

        <div style={{ textAlign: 'center' }}>
          <p style={{ margin: 0, color: '#666' }}>
            Već imate nalog?{' '}
            <button 
              onClick={() => navigate('/login')}
              style={{ 
                background: 'none', 
                border: 'none', 
                color: '#1976d2', 
                textDecoration: 'underline', 
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              Prijavite se
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;