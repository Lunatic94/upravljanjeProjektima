const API_BASE_URL = 'http://localhost:8080/api';
export const korisnikService = {
  // Ažuriranje profila korisnika
  azurirajProfil: async (token, korisnikId, profileData) => {
    const response = await fetch(`${API_BASE_URL}/korisnici/${korisnikId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profileData),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: `HTTP error! status: ${response.status}` }));
      throw new Error(errorData.error || errorData.message || `HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  // Dobijanje korisnika po ID-u
  getKorisnikById: async (token, korisnikId) => {
    const response = await fetch(`${API_BASE_URL}/korisnici/${korisnikId}`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  // Pretraga korisnika
  pretragaKorisnika: async (token, searchTerm) => {
    const response = await fetch(`${API_BASE_URL}/korisnici/pretraga?search=${encodeURIComponent(searchTerm)}`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  // Dobijanje svih korisnika
  sviKorisnici: async (token) => {
    const response = await fetch(`${API_BASE_URL}/korisnici`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  // Deaktiviranje korisnika
  deaktivirajKorisnika: async (token, korisnikId) => {
    const response = await fetch(`${API_BASE_URL}/korisnici/${korisnikId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }
};