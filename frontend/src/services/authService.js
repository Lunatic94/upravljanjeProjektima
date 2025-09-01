const API_BASE_URL = 'http://localhost:8080/api';

export const authService = {
  login: async (korisnickoIme, lozinka) => {
    const response = await fetch(`${API_BASE_URL}/auth/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ korisnickoIme, lozinka }),
    });
    return response.json();
  },
  
  register: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    return response.json();
  },

  getCurrentUser: async (token) => {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.json();
  },

  logout: async (token) => {
    const response = await fetch(`${API_BASE_URL}/auth/signout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.json();
  }
};