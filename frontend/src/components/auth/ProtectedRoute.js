import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useParams } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px'
      }}>
        Učitavanje...
      </div>
    );
  }

  // Ako korisnik nije ulogovan i pokušava pristup zaštićenoj ruti
  if (!user && !['/login', '/register'].includes(location.pathname)) {
    return <Navigate to="/login" replace />;
  }

  // Ako je korisnik ulogovan a pokušava pristup login/register stranicama
  if (user && ['/login', '/register'].includes(location.pathname)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;