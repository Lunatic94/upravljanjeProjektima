import React from 'react';
import { useParams } from 'react-router-dom';

const KorisnikCard = ({ korisnik, onEdit, onDeactivate, canManage }) => {
  const getRoleText = (uloga) => {
    const roleMap = {
      'ADMIN': 'Administrator',
      'ROLE_ADMIN': 'Administrator',
      'MENADZER_PROJEKTA': 'Menadžer Projekta',
      'ROLE_MENADZER_PROJEKTA': 'Menadžer Projekta',
      'PROGRAMER': 'Programer',
      'ROLE_PROGRAMER': 'Programer'
    };
    return roleMap[uloga] || uloga?.replace('ROLE_', '').replace('_', ' ');
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

  const handleEdit = () => {
    if (canManage && onEdit) {
      onEdit(korisnik);
    }
  };

  const handleDeactivate = () => {
    if (canManage && onDeactivate) {
      onDeactivate(korisnik);
    }
  };

  return (
    <div style={{
      background: 'white',
      border: '1px solid #e0e0e0',
      borderRadius: '12px',
      padding: '20px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      transition: 'transform 0.2s, box-shadow 0.2s'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-2px)';
      e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.15)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
    }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
        <div style={{
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          background: getRoleColor(korisnik.uloga),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '20px',
          fontWeight: 'bold',
          marginRight: '15px'
        }}>
          {korisnik.ime?.charAt(0).toUpperCase()}{korisnik.prezime?.charAt(0).toUpperCase()}
        </div>
        <div>
          <h3 style={{ margin: '0 0 5px 0', color: '#333', fontSize: '16px' }}>
            {korisnik.ime} {korisnik.prezime}
          </h3>
          <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
            @{korisnik.korisnickoIme}
          </p>
        </div>
      </div>

      <div style={{ marginBottom: '15px' }}>
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
      </div>

      <div style={{ fontSize: '13px', color: '#666' }}>
        <div style={{ marginBottom: '5px' }}>
          📧 {korisnik.email}
        </div>
        <div style={{ marginBottom: '5px' }}>
          📅 Registrovan: {korisnik.datumKreiranja ? new Date(korisnik.datumKreiranja).toLocaleDateString('sr-RS') : 'N/A'}
        </div>
        <div>
          ✅ Status: {korisnik.aktivan ? 'Aktivan' : 'Neaktivan'}
        </div>
      </div>

      {/* Dugmad za upravljanje - prikazuju se samo ako korisnik ima dozvolu */}
      {canManage && (
        <div style={{ 
          marginTop: '15px', 
          paddingTop: '15px', 
          borderTop: '1px solid #eee',
          display: 'flex',
          gap: '10px'
        }}>
          <button 
            onClick={handleEdit}
            style={{
              background: '#2196f3',
              color: 'white',
              border: 'none',
              padding: '6px 12px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
              flex: 1,
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#1976d2'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#2196f3'}
          >
            ✏️ Ažuriraj
          </button>
          <button 
            onClick={handleDeactivate}
            style={{
              background: korisnik.aktivan ? '#ff9800' : '#4caf50',
              color: 'white',
              border: 'none',
              padding: '6px 12px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
              flex: 1,
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => {
              if (korisnik.aktivan) {
                e.target.style.backgroundColor = '#f57c00';
              } else {
                e.target.style.backgroundColor = '#388e3c';
              }
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = korisnik.aktivan ? '#ff9800' : '#4caf50';
            }}
          >
            {korisnik.aktivan ? '🚫 Deaktiviraj' : '✅ Aktiviraj'}
          </button>
        </div>
      )}
      
      {/* Info za obične korisnike da ne mogu da uređuju */}
      {!canManage && (
        <div style={{
          marginTop: '15px',
          paddingTop: '15px',
          borderTop: '1px solid #eee',
          textAlign: 'center',
          fontSize: '12px',
          color: '#999',
          fontStyle: 'italic'
        }}>
          Samo administratori mogu uređivati korisnike
        </div>
      )}
    </div>
  );
};

export default KorisnikCard;