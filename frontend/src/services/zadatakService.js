const API_BASE_URL = 'http://localhost:8080/api';

const handleApiResponse = async (response) => {
  if (!response.ok) {
    const errorText = await response.text();
    console.error('API Error:', response.status, errorText);
    throw new Error(`HTTP ${response.status}: ${errorText}`);
  }
  return response.json();
};

export const zadatakService = {
  // Dobijanje zadataka
  getMojiZadaci: async (token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/zadaci/moji`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await handleApiResponse(response);
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error fetching moji zadaci:', error);
      return [];
    }
  },

  getSviZadaci: async (token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/zadaci`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await handleApiResponse(response);
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error fetching svi zadaci:', error);
      return [];
    }
  },

  getZadaciProjekta: async (token, projekatId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/zadaci/projekat/${projekatId}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await handleApiResponse(response);
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error fetching zadaci projekta:', error);
      return [];
    }
  },

  getZadatak: async (token, id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/zadaci/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      return await handleApiResponse(response);
    } catch (error) {
      console.error('Error fetching zadatak:', error);
      return null;
    }
  },

  // Kreiranje i ažuriranje
  kreirajZadatak: async (token, zadatakData) => {
    try {
      console.log('API: Creating task with data:', zadatakData);
      const response = await fetch(`${API_BASE_URL}/zadaci`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(zadatakData),
      });
      const result = await handleApiResponse(response);
      console.log('API: Task created successfully:', result);
      return result;
    } catch (error) {
      console.error('Error creating zadatak:', error);
      throw error;
    }
  },

  azurirajZadatak: async (token, id, zadatakData) => {
    try {
      console.log('API: Updating task', id, 'with data:', zadatakData);
      const response = await fetch(`${API_BASE_URL}/zadaci/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(zadatakData),
      });
      const result = await handleApiResponse(response);
      console.log('API: Task updated successfully:', result);
      return result;
    } catch (error) {
      console.error('Error updating zadatak:', error);
      throw error;
    }
  },

  azurirajStatus: async (token, id, status) => {
    try {
      console.log('API: Updating task status', id, 'to', status);
      const response = await fetch(`${API_BASE_URL}/zadaci/${id}/status?status=${status}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const result = await handleApiResponse(response);
      console.log('API: Task status updated successfully');
      return result;
    } catch (error) {
      console.error('Error updating task status:', error);
      throw error;
    }
  },

  dodeliZadatak: async (token, id, korisnikId) => {
    try {
      console.log('API: Assigning task', id, 'to user', korisnikId);
      const response = await fetch(`${API_BASE_URL}/zadaci/${id}/dodeli/${korisnikId}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const result = await handleApiResponse(response);
      console.log('API: Task assigned successfully');
      return result;
    } catch (error) {
      console.error('Error assigning task:', error);
      throw error;
    }
  },

  // Brisanje
  obrisiZadatak: async (token, id) => {
    try {
      console.log('API: Deleting task', id);
      const response = await fetch(`${API_BASE_URL}/zadaci/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', response.status, errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      
      console.log('API: Task deleted successfully');
      return { success: true };
    } catch (error) {
      console.error('Error deleting zadatak:', error);
      throw error;
    }
  },

  // Pretraga i filteri
  pretragaZadataka: async (token, projekatId, search) => {
    try {
      const response = await fetch(`${API_BASE_URL}/zadaci/pretraga?projekatId=${projekatId}&search=${search}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await handleApiResponse(response);
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error searching zadaci:', error);
      return [];
    }
  },

  getKasniZadaci: async (token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/zadaci/kasni`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await handleApiResponse(response);
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error fetching overdue tasks:', error);
      return [];
    }
  }
};