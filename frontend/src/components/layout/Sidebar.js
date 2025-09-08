import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ isOpen, onToggle }) => {
  const location = useLocation();
  const currentPath = location.pathname;

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', path: '/dashboard' },
    { id: 'projekti', label: 'Projekti', icon: '📁', path: '/projekti' },
    { id: 'zadaci', label: 'Zadaci', icon: '📋', path: '/zadaci' },
    { id: 'korisnici', label: 'Korisnici', icon: '👥', path: '/korisnici' },
    { id: 'profil', label: 'Profil', icon: '👤', path: '/profile' }
  ];

  return (
    <div style={{
      position: 'fixed',
      left: 0,
      top: 0,
      height: '100vh',
      width: isOpen ? '250px' : '60px',
      background: '#2c3e50',
      transition: 'width 0.3s ease',
      zIndex: 200,
      overflow: 'hidden'
    }}>
      <div style={{
        padding: '20px',
        borderBottom: '1px solid #34495e',
        color: 'white',
        fontSize: '18px',
        fontWeight: 'bold',
        whiteSpace: 'nowrap'
      }}>
        {isOpen ? '📊 Projekti' : '📊'}
      </div>

      <nav style={{ padding: '20px 0' }}>
        {menuItems.map((item) => (
          <Link
            key={item.id}
            to={item.path}
            style={{
              width: '100%',
              background: currentPath === item.path ? '#3498db' : 'transparent',
              border: 'none',
              color: 'white',
              padding: '15px 20px',
              textAlign: 'left',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '16px',
              transition: 'background-color 0.3s ease',
              textDecoration: 'none'
            }}
            onMouseEnter={(e) => {
              if (currentPath !== item.path) {
                e.target.style.backgroundColor = '#34495e';
              }
            }}
            onMouseLeave={(e) => {
              if (currentPath !== item.path) {
                e.target.style.backgroundColor = 'transparent';
              }
            }}
          >
            <span style={{ fontSize: '20px' }}>{item.icon}</span>
            {isOpen && <span>{item.label}</span>}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;