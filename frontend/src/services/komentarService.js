const API_BASE_URL = 'http://localhost:8080/api';

export const komentarService = {
  // Dobijanje komentara zadatka
  getKomentareZadatka: async (token, zadatakId) => {
    const response = await fetch(`${API_BASE_URL}/zadaci/${zadatakId}/komentari`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  // Dodavanje novog komentara
  dodajKomentar: async (token, zadatakId, sadrzaj) => {
    const response = await fetch(`${API_BASE_URL}/zadaci/${zadatakId}/komentari`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sadrzaj }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  // Ažuriranje komentara
  azurirajKomentar: async (token, zadatakId, komentarId, sadrzaj) => {
    const response = await fetch(`${API_BASE_URL}/zadaci/${zadatakId}/komentari/${komentarId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sadrzaj }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  // Brisanje komentara
  obrisiKomentar: async (token, zadatakId, komentarId) => {
    const response = await fetch(`${API_BASE_URL}/zadaci/${zadatakId}/komentari/${komentarId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }
};