import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Projekti from './pages/Projekti';
import Zadaci from './pages/Zadaci';
import Korisnici from './pages/Korisnici';
import Profile from './pages/Profile';
import ProtectedRoute from './components/auth/ProtectedRoute';
import NotFound from './pages/NotFound';
import { useAuth } from './context/AuthContext';
import KreirajProjekat from './components/projekti/KreirajProjekat';
import ProjekatDetails from './components/projekti/ProjekatDetails';
import ProjekatCard from './components/projekti/ProjekatCard';
import CreateZadatak from './components/zadaci/CreateZadatak';
import ZadatakDetails from './/components/zadaci/ZadatakDetails';
import ZadatakCard from './components/zadaci/ZadatakCard';
import KorisnikDetails from './components/korisnici/KorisnikDetails';
import KorisnikCard from './components/korisnici/KorisnikCard';

// Wrapper komponenta za authenticated routes
const AuthenticatedApp = () => {
  return (
    <Layout>
      <Routes>
        {/* Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Projekti stranice */}
        <Route path="/projekti" element={<Projekti />} />
        <Route path="/projekti/novi" element={<KreirajProjekat />} />
        <Route path="/projekti/:id" element={<ProjekatDetails />} />
        <Route path="/projekti/:id/edit" element={<ProjekatCard />} />
        
        {/* Zadaci stranice */}
        <Route path="/zadaci" element={<Zadaci />} />
        <Route path="/zadaci/novi" element={<CreateZadatak />} />
        <Route path="/zadaci/:id" element={<ZadatakDetails />} />
        <Route path="/zadaci/:id/edit" element={<ZadatakCard />} />
        
        {/* Korisnici stranice */}
        <Route path="/korisnici" element={<Korisnici />} />
        <Route path="/korisnici/:id" element={<KorisnikDetails />} />
        
        {/* Profil stranica */}
        <Route path="/profil" element={<Profile />} />
        <Route path="/profil/edit" element={<KorisnikCard />} />
        
        {/* Podrazumevana ruta */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        {/* 404 stranica */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
};

// Main App routing komponenta
const AppRoutes = () => {
  const { user } = useAuth();

  if (user) {
    return <AuthenticatedApp />;
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <ProtectedRoute>
          <AppRoutes />
        </ProtectedRoute>
      </AuthProvider>
    </Router>
  );
}

export default App;