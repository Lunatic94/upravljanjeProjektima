const API_BASE_URL = 'http://localhost:8080/api';

export const api = {
  // Projekti
  getProjekti: async (token) => {
    const response = await fetch(`${API_BASE_URL}/projekti/moji`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  getSviProjekti: async (token) => {
    const response = await fetch(`${API_BASE_URL}/projekti`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  getProjekat: async (token, id) => {
    const response = await fetch(`${API_BASE_URL}/projekti/${id}`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  // Zadaci
  getZadaci: async (token) => {
    const response = await fetch(`${API_BASE_URL}/zadaci/moji`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  getSviZadaci: async (token) => {
    const response = await fetch(`${API_BASE_URL}/zadaci`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  getZadaciProjekta: async (token, projekatId) => {
    const response = await fetch(`${API_BASE_URL}/zadaci/projekat/${projekatId}`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  // Korisnici
  getKorisnici: async (token) => {
    const response = await fetch(`${API_BASE_URL}/korisnici/aktivni`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  getSviKorisnici: async (token) => {
    const response = await fetch(`${API_BASE_URL}/korisnici`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  getKorisnik: async (token, id) => {
    const response = await fetch(`${API_BASE_URL}/korisnici/${id}`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  pretragaKorisnika: async (token, search) => {
    const response = await fetch(`${API_BASE_URL}/korisnici/pretraga?search=${encodeURIComponent(search)}`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  // Kreiranje i ažuriranje
  kreirajProjekat: async (token, projekatData) => {
    const response = await fetch(`${API_BASE_URL}/projekti`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(projekatData),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  azurirajProjekat: async (token, id, projekatData) => {
    const response = await fetch(`${API_BASE_URL}/projekti/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(projekatData),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  kreirajZadatak: async (token, zadatakData) => {
    const response = await fetch(`${API_BASE_URL}/zadaci`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(zadatakData),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  azurirajZadatak: async (token, id, zadatakData) => {
    const response = await fetch(`${API_BASE_URL}/zadaci/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(zadatakData),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  azurirajStatusZadatka: async (token, id, status) => {
    const response = await fetch(`${API_BASE_URL}/zadaci/${id}/status?status=${status}`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  azurirajKorisnika: async (token, id, korisnikData) => {
    const response = await fetch(`${API_BASE_URL}/korisnici/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(korisnikData),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: `HTTP error! status: ${response.status}` }));
      throw new Error(errorData.error || errorData.message || `HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  // Brisanje
  obrisiProjekat: async (token, id) => {
    const response = await fetch(`${API_BASE_URL}/projekti/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  obrisiZadatak: async (token, id) => {
    const response = await fetch(`${API_BASE_URL}/zadaci/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  deaktivirajKorisnika: async (token, id) => {
    const response = await fetch(`${API_BASE_URL}/korisnici/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }
};