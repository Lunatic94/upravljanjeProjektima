const API_BASE_URL = 'http://localhost:8080/api';

export const projekatService = {
  // Dobijanje projekata
  getMojiProjekti: async (token) => {
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
      const errorData = await response.json().catch(() => ({ error: `HTTP error! status: ${response.status}` }));
      throw new Error(errorData.error || errorData.message || `HTTP error! status: ${response.status}`);
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
      const errorData = await response.json().catch(() => ({ error: `HTTP error! status: ${response.status}` }));
      throw new Error(errorData.error || errorData.message || `HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  obrisiProjekat: async (token, id) => {
    const response = await fetch(`${API_BASE_URL}/projekti/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: `HTTP error! status: ${response.status}` }));
      throw new Error(errorData.error || errorData.message || `HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  // Pretraga i filteri
  pretragaProjekta: async (token, search) => {
    const response = await fetch(`${API_BASE_URL}/projekti/pretraga?search=${encodeURIComponent(search)}`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  projektiPoStatusu: async (token, status) => {
    const response = await fetch(`${API_BASE_URL}/projekti/status/${status}`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  // Članovi projekta
  getClanoveProjekta: async (token, projekatId) => {
    const response = await fetch(`${API_BASE_URL}/projekti/${projekatId}/clanovi`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  dodajClana: async (token, projekatId, clanData) => {
    const response = await fetch(`${API_BASE_URL}/projekti/${projekatId}/clanovi`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(clanData),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: `HTTP error! status: ${response.status}` }));
      throw new Error(errorData.error || errorData.message || `HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  ukloniClana: async (token, projekatId, clanId) => {
    const response = await fetch(`${API_BASE_URL}/projekti/${projekatId}/clanovi/${clanId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: `HTTP error! status: ${response.status}` }));
      throw new Error(errorData.error || errorData.message || `HTTP error! status: ${response.status}`);
    }
    return response.json();
  },
  getAktivnosti: async (token, projekatId) => {
    const response = await fetch(`${API_BASE_URL}/projekti/${projekatId}/aktivnosti`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }
};