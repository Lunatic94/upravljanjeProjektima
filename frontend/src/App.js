// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import EmailVerification from './components/auth/EmailVerification';
import ResendVerification from './components/auth/ResendVerification';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Projekti from './pages/Projekti';
import Zadaci from './pages/Zadaci';
import Korisnici from './pages/Korisnici';
import Profile from './pages/Profile';

// Protected Route komponenta
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px'
      }}>
        Učitavanje aplikacije...
      </div>
    );
  }
  
  return user ? children : <Navigate to="/login" replace />;
};

// Public Route komponenta (za login/register stranice)
const PublicRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? <Navigate to="/dashboard" replace /> : children;
};

// Glavna App komponenta sa rutama
function AppContent() {
  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <Routes>
        {/* Public routes */}
        <Route 
          path="/login" 
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } 
        />
        <Route 
          path="/register" 
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          } 
        />
        
        {/* Email verification routes - DOSTUPNE SVIMA */}
        <Route path="/verify-email" element={<EmailVerification />} />
        <Route path="/resend-verification" element={<ResendVerification />} />
        
        {/* Protected routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Layout currentView="dashboard">
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/projekti" 
          element={
            <ProtectedRoute>
              <Layout currentView="projekti">
                <Projekti />
              </Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/zadaci" 
          element={
            <ProtectedRoute>
              <Layout currentView="zadaci">
                <Zadaci />
              </Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/korisnici" 
          element={
            <ProtectedRoute>
              <Layout currentView="korisnici">
                <Korisnici />
              </Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <Layout currentView="profile">
                <Profile />
              </Layout>
            </ProtectedRoute>
          } 
        />
        
        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* 404 page */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  );
}

// Glavna export komponenta sa AuthProvider i Router
export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}