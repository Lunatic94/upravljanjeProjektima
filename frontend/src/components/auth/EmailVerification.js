// src/components/auth/EmailVerification.js
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const EmailVerification = () => {
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  useEffect(() => {
    const token = searchParams.get('token');
    
    if (!token) {
      setStatus('error');
      setMessage('Nedostaje verifikacioni token.');
      return;
    }
    
    verifyEmail(token);
  }, [searchParams]);
  
  const verifyEmail = async (token) => {
    try {
      const response = await fetch(`http://localhost:8080/api/auth/verify-email?token=${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setStatus('success');
        setMessage('Email je uspešno verifikovan! Možete se prijaviti.');
        
        // Preusmeravanje na login nakon 3 sekunde
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setStatus('error');
        setMessage(data.error || 'Došlo je do greške pri verifikaciji email-a.');
      }
    } catch (error) {
      console.error('Verification error:', error);
      setStatus('error');
      setMessage('Došlo je do greške pri verifikaciji email-a.');
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
        textAlign: 'center',
        maxWidth: '500px',
        width: '100%'
      }}>
        {status === 'loading' && (
          <div>
            <div style={{
              width: '40px',
              height: '40px',
              border: '4px solid #e3f2fd',
              borderTop: '4px solid #2196f3',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 20px'
            }}></div>
            <h2 style={{ color: '#333', marginBottom: '16px' }}>Verifikacija email-a...</h2>
            <p style={{ color: '#666' }}>Molimo sačekajte dok verifikujemo vašu email adresu.</p>
          </div>
        )}
        
        {status === 'success' && (
          <div>
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
            <h2 style={{ color: '#4caf50', marginBottom: '16px' }}>Uspešno!</h2>
            <p style={{ color: '#333', marginBottom: '20px' }}>{message}</p>
            <p style={{ color: '#666', fontSize: '14px' }}>
              Biće preusmereni na stranicu za prijavu za 3 sekunde...
            </p>
            <button
              onClick={() => navigate('/login')}
              style={{
                backgroundColor: '#2196f3',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                cursor: 'pointer',
                marginTop: '10px',
                fontWeight: '600'
              }}
            >
              Idite na prijavu
            </button>
          </div>
        )}
        
        {status === 'error' && (
          <div>
            <div style={{
              width: '60px',
              height: '60px',
              backgroundColor: '#f44336',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px'
            }}>
              <span style={{ color: 'white', fontSize: '30px' }}>✕</span>
            </div>
            <h2 style={{ color: '#f44336', marginBottom: '16px' }}>Greška</h2>
            <p style={{ color: '#333', marginBottom: '20px' }}>{message}</p>
            <div>
              <button
                onClick={() => navigate('/register')}
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
                Nazad na registraciju
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
        )}
      </div>
      
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default EmailVerification;