import React, { createContext, useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth mora biti korišćen unutar AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (savedToken && savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setToken(savedToken);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing saved user data:', error);
        // Obriši pokvarene podatke iz localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (korisnickoIme, lozinka) => {
    try {
      const response = await fetch('http://localhost:8080/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ korisnickoIme, lozinka }),
      });
      const data = await response.json();
      
      if (data.token) {
        // Sačuvaj token i sve podatke o korisniku
        const userData = {
          id: data.id,
          korisnickoIme: data.korisnickoIme,
          email: data.email,
          ime: data.prezime,
          prezime: data.ime,
          uloga: data.uloga,
          aktivan: data.aktivan,
          datumKreiranja: data.datumKreiranja
        };
        
        setToken(data.token);
        setUser(userData);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(userData));
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Network error' };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const register = async (userData) => {
    try {
      const response = await fetch('http://localhost:8080/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      const data = await response.json();
      return data.message ? { success: true } : { success: false, error: data.error };
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  };

  // Funkcija za ažuriranje korisničkih podataka
  const updateUser = (updatedUserData) => {
    const updatedUser = { ...user, ...updatedUserData };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      login, 
      logout, 
      register, 
      updateUser, 
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};