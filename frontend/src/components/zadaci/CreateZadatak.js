import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { useParams } from 'react-router-dom';

const CreateZadatak = ({ onSubmit, onCancel, loading = false, defaultProjekatId = null, initialData = null, isEditing = false }) => {
  const { token } = useAuth();
  const [projekti, setProjekti] = useState([]);
  const [korisnici, setKorisnici] = useState([]);
  const [formData, setFormData] = useState({
    naslov: '',
    opis: '',
    prioritet: 'SREDNJI',
    status: 'TREBA_URADITI',
    procenjeniSati: '',
    rokZavrsetka: '',
    projekatId: defaultProjekatId || '',
    dodeljKorisnikId: ''
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [projektiData, korisniciData] = await Promise.all([
          api.getProjekti(token).catch(err => {
            console.warn('Error loading projekti:', err);
            return [];
          }),
          api.getKorisnici(token).catch(err => {
            console.warn('Error loading korisnici:', err);
            return [];
          })
        ]);
        setProjekti(Array.isArray(projektiData) ? projektiData : []);
        setKorisnici(Array.isArray(korisniciData) ? korisniciData : []);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    if (token) {
      loadData();
    }
  }, [token]);

  // Popuni formu sa podacima za edit
  useEffect(() => {
    if (initialData && isEditing) {
      // Formatiramo datum za input type="date"
      const formatDateForInput = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
      };

      setFormData({
        naslov: initialData.naslov || '',
        opis: initialData.opis || '',
        prioritet: initialData.prioritet || 'SREDNJI',
        status: initialData.status || 'TREBA_URADITI',
        procenjeniSati: initialData.procenjeniSati ? initialData.procenjeniSati.toString() : '',
        rokZavrsetka: formatDateForInput(initialData.rokZavrsetka),
        projekatId: initialData.projekatId || initialData.projekat?.id || '',
        dodeljKorisnikId: initialData.dodeljKorisnikId || initialData.dodeljen?.id || ''
      });
    } else if (!isEditing) {
      // Resetuj formu za kreiranje novog zadatka
      setFormData({
        naslov: '',
        opis: '',
        prioritet: 'SREDNJI',
        status: 'TREBA_URADITI',
        procenjeniSati: '',
        rokZavrsetka: '',
        projekatId: defaultProjekatId || '',
        dodeljKorisnikId: ''
      });
    }
  }, [initialData, isEditing, defaultProjekatId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      procenjeniSati: formData.procenjeniSati ? parseInt(formData.procenjeniSati) : null,
      dodeljKorisnikId: formData.dodeljKorisnikId || null
    };
    onSubmit?.(submitData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: 'white',
        padding: '30px',
        borderRadius: '12px',
        maxWidth: '600px',
        width: '90%',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 10px 25px rgba(0,0,0,0.3)'
      }}>
        <h2 style={{ marginBottom: '25px', color: '#1976d2', textAlign: 'center' }}>
          📋 {isEditing ? 'Ažuriranje Zadatka' : 'Kreiranje Novog Zadatka'}
        </h2>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>
              Naslov zadatka *
            </label>
            <input
              type="text"
              name="naslov"
              value={formData.naslov}
              onChange={handleChange}
              required
              placeholder="Unesite naslov zadatka"
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e0e0e0',
                borderRadius: '6px',
                fontSize: '14px',
                outline: 'none',
                transition: 'border-color 0.3s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#1976d2'}
              onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>
              Opis zadatka
            </label>
            <textarea
              name="opis"
              value={formData.opis}
              onChange={handleChange}
              rows="3"
              placeholder="Opišite zadatak..."
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e0e0e0',
                borderRadius: '6px',
                fontSize: '14px',
                resize: 'vertical',
                outline: 'none',
                transition: 'border-color 0.3s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#1976d2'}
              onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>
                Projekat *
              </label>
              <select
                name="projekatId"
                value={formData.projekatId}
                onChange={handleChange}
                required
                disabled={isEditing} // Onemogući menjanje projekta pri editovanju
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '6px',
                  fontSize: '14px',
                  outline: 'none',
                  backgroundColor: isEditing ? '#f5f5f5' : 'white',
                  cursor: isEditing ? 'not-allowed' : 'pointer'
                }}
              >
                <option value="">Izaberite projekat</option>
                {projekti.map((projekat) => (
                  <option key={projekat.id} value={projekat.id}>
                    {projekat.naziv}
                  </option>
                ))}
              </select>
              {isEditing && (
                <small style={{ color: '#666', fontSize: '12px' }}>
                  Projekat se ne može menjati pri ažuriranju zadatka
                </small>
              )}
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>
                Prioritet
              </label>
              <select
                name="prioritet"
                value={formData.prioritet}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '6px',
                  fontSize: '14px',
                  outline: 'none'
                }}
              >
                <option value="NIZAK">🟢 Nizak</option>
                <option value="SREDNJI">🟡 Srednji</option>
                <option value="VISOK">🟠 Visok</option>
                <option value="KRITICAN">🔴 Kritičan</option>
              </select>
            </div>
          </div>

          {isEditing && (
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '6px',
                  fontSize: '14px',
                  outline: 'none'
                }}
              >
                <option value="TREBA_URADITI">📝 Treba uraditi</option>
                <option value="U_TOKU">⚡ U toku</option>
                <option value="NA_PREGLEDU">👀 Na pregledu</option>
                <option value="ZAVRSENO">✅ Završeno</option>
              </select>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>
                Procenjeni sati
              </label>
              <input
                type="number"
                name="procenjeniSati"
                value={formData.procenjeniSati}
                onChange={handleChange}
                min="1"
                placeholder="npr. 8"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '6px',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>
                Rok završetka
              </label>
              <input
                type="date"
                name="rokZavrsetka"
                value={formData.rokZavrsetka}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '6px',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '25px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>
              Dodeli korisniku
            </label>
            <select
              name="dodeljKorisnikId"
              value={formData.dodeljKorisnikId}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e0e0e0',
                borderRadius: '6px',
                fontSize: '14px',
                outline: 'none'
              }}
            >
              <option value="">Nije dodeljen</option>
              {korisnici.map((korisnik) => (
                <option key={korisnik.id} value={korisnik.id}>
                  {korisnik.ime} {korisnik.prezime} (@{korisnik.korisnickoIme})
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              style={{
                background: '#6c757d',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '6px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              Otkaži
            </button>
            <button
              type="submit"
              disabled={loading || !formData.naslov.trim() || !formData.projekatId}
              style={{
                background: loading || !formData.naslov.trim() || !formData.projekatId ? '#ccc' : '#1976d2',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '6px',
                cursor: loading || !formData.naslov.trim() || !formData.projekatId ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              {loading 
                ? (isEditing ? 'Ažuriranje...' : 'Kreiranje...') 
                : (isEditing ? '💾 Ažuriraj Zadatak' : '📋 Kreiraj Zadatak')
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateZadatak;