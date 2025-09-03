// src/components/auth/ResendVerification.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ResendVerification = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [cooldown, setCooldown] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // Učitaj email iz localStorage ako postoji
    const savedEmail = localStorage.getItem('registrationEmail');
    if (savedEmail) {
      setEmail(savedEmail);
    }
    
    // Proveri da li je cooldown aktivan
    const lastSent = localStorage.getItem('lastVerificationSent');
    if (lastSent) {
      const timePassed = Date.now() - parseInt(lastSent);
      const cooldownTime = 60000; // 1 minut
      if (timePassed < cooldownTime) {
        setCooldown(Math.ceil((cooldownTime - timePassed) / 1000));
      }
    }
  }, []);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => {
        setCooldown(cooldown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (cooldown > 0) {
      setError(`Molimo sačekajte ${cooldown} sekundi pre ponovnog slanja.`);
      return;
    }
    
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await fetch(`http://localhost:8080/api/auth/resend-verification?email=${email}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setMessage('Verifikacioni email je poslat! Proverite vaš inbox.');
        // Postavi cooldown
        localStorage.setItem('lastVerificationSent', Date.now().toString());
        setCooldown(60);
      } else {
        setError(data.error || 'Došlo je do greške.');
      }
    } catch (err) {
      console.error('Resend verification error:', err);
      setError('Došlo je do greške pri slanju email-a.');
    } finally {
      setLoading(false);
    }
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
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
        maxWidth: '400px',
        width: '100%'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>
          Ponovi Verifikaciju Email-a
        </h2>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: '600', 
              color: '#333' 
            }}>
              Email adresa
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Unesite email adresu"
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
              backgroundColor: '#ffebee',
              color: '#c62828',
              padding: '12px',
              borderRadius: '4px',
              marginBottom: '20px',
              fontSize: '14px'
            }}>
              {error}
            </div>
          )}

          {message && (
            <div style={{
              backgroundColor: '#e8f5e8',
              color: '#2e7d32',
              padding: '12px',
              borderRadius: '4px',
              marginBottom: '20px',
              fontSize: '14px'
            }}>
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || cooldown > 0}
            style={{
              width: '100%',
              padding: '14px',
              backgroundColor: (loading || cooldown > 0) ? '#ccc' : '#2196f3',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: (loading || cooldown > 0) ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {loading ? 'Šalje se...' : 
             cooldown > 0 ? `Sačekajte ${cooldown}s` : 
             'Pošalji verifikaciju'}
          </button>
        </form>
        
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <button
            onClick={() => navigate('/login')}
            style={{
              background: 'none',
              border: 'none',
              color: '#2196f3',
              textDecoration: 'underline',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            Nazad na prijavu
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResendVerification;