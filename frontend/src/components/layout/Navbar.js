import React from 'react';
import { useAuth } from '../../context/AuthContext';

const Navbar = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();

  const formatRole = (uloga) => {
    if (!uloga) return 'Nepoznato';
    // Uklanjanje ROLE_ prefiksa ako postoji i zamena _ sa space
    return uloga.replace('ROLE_', '').replace('_', ' ');
  };

  return (
    <nav style={{
      background: '#1976d2',
      color: 'white',
      padding: '0 20px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '60px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <button
            onClick={onToggleSidebar}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'white',
              fontSize: '20px',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '4px',
              marginRight: '15px'
            }}
          >
            ☰
          </button>
          <h2 style={{ margin: 0 }}>📊 Upravljanje Projektima</h2>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '35px',
              height: '35px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold'
            }}>
              {user?.korisnickoIme?.charAt(0).toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: '500' }}>
                {user?.korisnickoIme}
              </div>
              <div style={{ fontSize: '11px', opacity: 0.8 }}>
                {formatRole(user?.uloga)}
              </div>
            </div>
          </div>
          <button
            onClick={logout}
            style={{
              background: '#dc004e',
              border: 'none',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Odjavi se
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;