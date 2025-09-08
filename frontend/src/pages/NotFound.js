import React from 'react';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';

const NotFound = () => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '60vh',
      textAlign: 'center',
      color: '#666'
    }}>
      <div style={{ fontSize: '72px', marginBottom: '20px' }}>🔍</div>
      <h1 style={{ fontSize: '48px', margin: '0 0 10px 0', color: '#1976d2' }}>404</h1>
      <h2 style={{ fontSize: '24px', margin: '0 0 20px 0', color: '#333' }}>
        Stranica nije pronađena
      </h2>
      <p style={{ fontSize: '16px', marginBottom: '30px', maxWidth: '400px' }}>
        Izvinjavamo se, ali stranica koju tražite ne postoji ili je pomerena.
      </p>
      
      <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link
          to="/dashboard"
          style={{
            background: '#1976d2',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '6px',
            textDecoration: 'none',
            fontSize: '16px',
            fontWeight: '500'
          }}
        >
          🏠 Početna stranica
        </Link>
        
        <Link
          to="/projekti"
          style={{
            background: '#4caf50',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '6px',
            textDecoration: 'none',
            fontSize: '16px',
            fontWeight: '500'
          }}
        >
          📁 Projekti
        </Link>
        
        <Link
          to="/zadaci"
          style={{
            background: '#ff9800',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '6px',
            textDecoration: 'none',
            fontSize: '16px',
            fontWeight: '500'
          }}
        >
          📋 Zadaci
        </Link>
      </div>
      
      <div style={{ marginTop: '40px', fontSize: '14px', color: '#999' }}>
        <p>Korisni linkovi:</p>
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/korisnici" style={{ color: '#1976d2', textDecoration: 'none' }}>
            👥 Korisnici
          </Link>
          <Link to="/profile" style={{ color: '#1976d2', textDecoration: 'none' }}>
            👤 Moj profil
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;