import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useParams } from 'react-router-dom';

const KorisnikDetails = ({ korisnik, onClose, onEdit, onDeactivate }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const getRoleText = (uloga) => {
    const roleMap = {
      'ADMIN': 'Administrator',
      'ROLE_ADMIN': 'Administrator',
      'MENADZER_PROJEKTA': 'Menadžer Projekta',
      'ROLE_MENADZER_PROJEKTA': 'Menadžer Projekta',
      'PROGRAMER': 'Programer',
      'ROLE_PROGRAMER': 'Programer'
    };
    return roleMap[uloga] || uloga;
  };

  const getRoleColor = (uloga) => {
    const colors = {
      'ADMIN': '#f44336',
      'ROLE_ADMIN': '#f44336',
      'MENADZER_PROJEKTA': '#2196f3',
      'ROLE_MENADZER_PROJEKTA': '#2196f3',
      'PROGRAMER': '#4caf50',
      'ROLE_PROGRAMER': '#4caf50'
    };
    return colors[uloga] || '#757575';
  };

  const canManage = user?.uloga === 'ADMIN' || user?.uloga === 'ROLE_ADMIN'; // Samo administratori mogu upravljati

  const handleDeactivate = async () => {
    if (loading) return;
    
    const action = korisnik.aktivan ? 'deaktivirati' : 'aktivirati';
    const confirmMessage = `Da li ste sigurni da želite da ${action} korisnika ${korisnik.ime} ${korisnik.prezime}?`;
    
    if (window.confirm(confirmMessage)) {
      setLoading(true);
      try {
        await onDeactivate(korisnik);
      } catch (error) {
        console.error('Error changing user status:', error);
      }
      setLoading(false);
    }
  };

  if (!korisnik) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '12px',
        width: '90%',
        maxWidth: '600px',
        maxHeight: '90vh',
        overflow: 'hidden',
        boxShadow: '0 10px 25px rgba(0,0,0,0.3)'
      }}>
        {/* Header */}
        <div style={{
          padding: '25px 30px',
          borderBottom: '1px solid #eee',
          background: !korisnik.aktivan ? '#ffebee' : 'white'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: getRoleColor(korisnik.uloga),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '28px',
                fontWeight: 'bold',
                marginRight: '20px'
              }}>
                {korisnik.ime.charAt(0).toUpperCase()}{korisnik.prezime.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 style={{ margin: '0 0 8px 0', color: '#1976d2', fontSize: '24px' }}>
                  {korisnik.ime} {korisnik.prezime}
                </h2>
                <p style={{ margin: '0 0 10px 0', color: '#666', fontSize: '16px' }}>
                  @{korisnik.korisnickoIme}
                </p>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <span style={{
                    background: getRoleColor(korisnik.uloga),
                    color: 'white',
                    padding: '6px 12px',
                    borderRadius: '16px',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>
                    {getRoleText(korisnik.uloga)}
                  </span>
                  <span style={{
                    background: korisnik.aktivan ? '#4caf50' : '#f44336',
                    color: 'white',
                    padding: '6px 12px',
                    borderRadius: '16px',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>
                    {korisnik.aktivan ? '✅ Aktivan' : '❌ Neaktivan'}
                  </span>
                </div>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '10px' }}>
              {canManage && onEdit && (
                <button
                  onClick={() => onEdit(korisnik)}
                  style={{
                    background: '#1976d2',
                    color: 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  ✏️ Ažuriraj
                </button>
              )}
              <button
                onClick={onClose}
                style={{
                  background: '#6c757d',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                ✕ Zatvori
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{
          padding: '25px 30px',
          maxHeight: 'calc(90vh - 150px)',
          overflowY: 'auto'
        }}>
          {/* Osnovne informacije */}
          <div style={{ marginBottom: '25px' }}>
            <h4 style={{ color: '#333', marginBottom: '15px' }}>📝 Osnovne Informacije</h4>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '15px',
              background: '#f8f9fa',
              padding: '20px',
              borderRadius: '8px'
            }}>
              <div>
                <strong style={{ color: '#333', fontSize: '14px' }}>📧 Email:</strong>
                <p style={{ margin: '5px 0 0 0', color: '#666' }}>{korisnik.email}</p>
              </div>
              <div>
                <strong style={{ color: '#333', fontSize: '14px' }}>👤 Korisničko ime:</strong>
                <p style={{ margin: '5px 0 0 0', color: '#666' }}>@{korisnik.korisnickoIme}</p>
              </div>
              <div>
                <strong style={{ color: '#333', fontSize: '14px' }}>🎭 Uloga:</strong>
                <p style={{ margin: '5px 0 0 0', color: '#666' }}>{getRoleText(korisnik.uloga)}</p>
              </div>
              <div>
                <strong style={{ color: '#333', fontSize: '14px' }}>📅 Datum registracije:</strong>
                <p style={{ margin: '5px 0 0 0', color: '#666' }}>
                  {korisnik.datumKreiranja ? new Date(korisnik.datumKreiranja).toLocaleDateString('sr-RS') : 'Nepoznato'}
                </p>
              </div>
            </div>
          </div>

          {/* Statistike korisnika */}
          <div style={{ marginBottom: '25px' }}>
            <h4 style={{ color: '#333', marginBottom: '15px' }}>📊 Statistike</h4>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '15px'
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #1976d2, #42a5f5)',
                color: 'white',
                padding: '20px',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <h3 style={{ margin: '0 0 5px 0', fontSize: '24px' }}>0</h3>
                <p style={{ margin: 0, opacity: 0.9, fontSize: '14px' }}>Aktivni Projekti</p>
              </div>

              <div style={{
                background: 'linear-gradient(135deg, #9c27b0, #ba68c8)',
                color: 'white',
                padding: '20px',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <h3 style={{ margin: '0 0 5px 0', fontSize: '24px' }}>0</h3>
                <p style={{ margin: 0, opacity: 0.9, fontSize: '14px' }}>Dodeljeni Zadaci</p>
              </div>

              <div style={{
                background: 'linear-gradient(135deg, #4caf50, #81c784)',
                color: 'white',
                padding: '20px',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <h3 style={{ margin: '0 0 5px 0', fontSize: '24px' }}>0</h3>
                <p style={{ margin: 0, opacity: 0.9, fontSize: '14px' }}>Završeni Zadaci</p>
              </div>
            </div>
          </div>

          {/* Akcije */}
          {canManage && onDeactivate && (
            <div style={{
              background: '#f8f9fa',
              padding: '20px',
              borderRadius: '8px',
              borderTop: '1px solid #eee'
            }}>
              <h4 style={{ color: '#333', marginBottom: '15px' }}>🔧 Administratorske Akcije</h4>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={handleDeactivate}
                  disabled={loading}
                  style={{
                    background: loading ? '#ccc' : (korisnik.aktivan ? '#ff9800' : '#4caf50'),
                    color: 'white',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '6px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                >
                  {loading ? 'Procesiranje...' : (korisnik.aktivan ? '🚫 Deaktiviraj korisnika' : '✅ Aktiviraj korisnika')}
                </button>
              </div>
              <p style={{ 
                margin: '10px 0 0 0', 
                fontSize: '12px', 
                color: '#666',
                lineHeight: '1.4'
              }}>
                {korisnik.aktivan 
                  ? 'Deaktiviranje korisnika će onemogućiti pristup sistemu.'
                  : 'Aktiviranje korisnika će omogućiti pristup sistemu.'
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KorisnikDetails;