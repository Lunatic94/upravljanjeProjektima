// frontend/src/components/zadaci/CreateZadatak.js
// Primer kako ažurirati CreateZadatak komponentu da koristi validaciju

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { useFormValidation, zadatakValidationRules } from '../../hooks/useFormValidation';
import { formatDateForInput } from '../../utils/dateValidation';

const CreateZadatak = ({ onSubmit, onCancel, loading = false, defaultProjekatId = null, initialData = null, isEditing = false }) => {
  const { token } = useAuth();
  const [projekti, setProjekti] = useState([]);
  const [korisnici, setKorisnici] = useState([]);

  const initialValues = {
    naslov: '',
    opis: '',
    prioritet: 'SREDNJI',
    status: 'TREBA_URADITI',
    procenjeniSati: '',
    rokZavrsetka: '',
    projekatId: defaultProjekatId || '',
    dodeljKorisnikId: ''
  };

  const {
    values,
    errors,
    touched,
    setValue,
    setFieldTouched,
    setAllTouched,
    validateForm,
    setFormValues,
    hasErrors,
    isFieldInvalid
  } = useFormValidation(initialValues, zadatakValidationRules);

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
      setFormValues({
        naslov: initialData.naslov || '',
        opis: initialData.opis || '',
        prioritet: initialData.prioritet || 'SREDNJI',
        status: initialData.status || 'TREBA_URADITI',
        procenjeniSati: initialData.procenjeniSati ? initialData.procenjeniSati.toString() : '',
        rokZavrsetka: formatDateForInput(initialData.rokZavrsetka),
        projekatId: initialData.projekatId || initialData.projekat?.id || '',
        dodeljKorisnikId: initialData.dodeljKorisnikId || initialData.dodeljen?.id || ''
      });
    }
  }, [initialData, isEditing, setFormValues]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setAllTouched();
    
    if (validateForm()) {
      const submitData = {
        ...values,
        procenjeniSati: values.procenjeniSati ? parseInt(values.procenjeniSati, 10) : null
      };
      onSubmit?.(submitData);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValue(name, value);
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setFieldTouched(name);
  };

  const canSubmit = !loading && values.naslov.trim() && values.projekatId && !hasErrors;

  // Helper funkcija za stil input polja
  const getInputStyle = (fieldName) => ({
    width: '100%',
    padding: '12px',
    border: `2px solid ${isFieldInvalid(fieldName) ? '#f44336' : '#e0e0e0'}`,
    borderRadius: '6px',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.3s'
  });

  // Helper funkcija za prikaz greške
  const renderFieldError = (fieldName) => {
    if (!isFieldInvalid(fieldName)) return null;
    
    return (
      <div style={{ 
        color: '#f44336', 
        fontSize: '12px', 
        marginTop: '4px',
        display: 'flex',
        alignItems: 'center',
        gap: '4px'
      }}>
        ⚠️ {errors[fieldName]}
      </div>
    );
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
          {isEditing ? '✏️ Ažuriraj Zadatak' : '➕ Kreiraj Novi Zadatak'}
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Naslov zadatka */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: 'bold', 
              color: '#333' 
            }}>
              Naslov zadatka *
            </label>
            <input
              type="text"
              name="naslov"
              value={values.naslov}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Unesite naslov zadatka..."
              style={getInputStyle('naslov')}
              onFocus={(e) => {
                if (!isFieldInvalid('naslov')) {
                  e.target.style.borderColor = '#1976d2';
                }
              }}
            />
            {renderFieldError('naslov')}
          </div>

          {/* Opis */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: 'bold', 
              color: '#333' 
            }}>
              Opis zadatka
            </label>
            <textarea
              name="opis"
              value={values.opis}
              onChange={handleChange}
              placeholder="Opišite zadatak..."
              rows="3"
              style={{
                ...getInputStyle('opis'),
                resize: 'vertical',
                minHeight: '80px'
              }}
              onFocus={(e) => e.target.style.borderColor = '#1976d2'}
              onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
            />
          </div>

          {/* Projekat */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: 'bold', 
              color: '#333' 
            }}>
              Projekat *
            </label>
            <select
              name="projekatId"
              value={values.projekatId}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={!!defaultProjekatId}
              style={{
                ...getInputStyle('projekatId'),
                opacity: defaultProjekatId ? 0.6 : 1
              }}
            >
              <option value="">Izaberite projekat</option>
              {projekti.map((projekat) => (
                <option key={projekat.id} value={projekat.id}>
                  {projekat.naziv}
                </option>
              ))}
            </select>
            {renderFieldError('projekatId')}
          </div>

          {/* Prioritet i Procenjeni sati */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '15px', 
            marginBottom: '20px' 
          }}>
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontWeight: 'bold', 
                color: '#333' 
              }}>
                Prioritet
              </label>
              <select
                name="prioritet"
                value={values.prioritet}
                onChange={handleChange}
                style={getInputStyle('prioritet')}
              >
                <option value="NIZAK">🟢 Nizak</option>
                <option value="SREDNJI">🟡 Srednji</option>
                <option value="VISOK">🟠 Visok</option>
                <option value="KRITICAN">🔴 Kritičan</option>
              </select>
            </div>

            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontWeight: 'bold', 
                color: '#333' 
              }}>
                Procenjeni sati
              </label>
              <input
                type="number"
                name="procenjeniSati"
                value={values.procenjeniSati}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="8"
                min="0"
                style={getInputStyle('procenjeniSati')}
              />
              {renderFieldError('procenjeniSati')}
            </div>
          </div>

          {/* Rok završetka */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: 'bold', 
              color: '#333' 
            }}>
              Rok završetka
            </label>
            <input
              type="date"
              name="rokZavrsetka"
              value={values.rokZavrsetka}
              onChange={handleChange}
              onBlur={handleBlur}
              style={getInputStyle('rokZavrsetka')}
              onFocus={(e) => {
                if (!isFieldInvalid('rokZavrsetka')) {
                  e.target.style.borderColor = '#1976d2';
                }
              }}
            />
            {renderFieldError('rokZavrsetka')}
          </div>

          {/* Dodeli korisniku */}
          <div style={{ marginBottom: '25px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: 'bold', 
              color: '#333' 
            }}>
              Dodeli korisniku
            </label>
            <select
              name="dodeljKorisnikId"
              value={values.dodeljKorisnikId}
              onChange={handleChange}
              style={getInputStyle('dodeljKorisnikId')}
            >
              <option value="">Nije dodeljen</option>
              {korisnici.map((korisnik) => (
                <option key={korisnik.id} value={korisnik.id}>
                  {korisnik.ime} {korisnik.prezime} (@{korisnik.korisnickoIme})
                </option>
              ))}
            </select>
          </div>

          {/* Validacione greške - summary */}
          {hasErrors && Object.keys(touched).length > 0 && (
            <div style={{
              background: '#ffebee',
              border: '1px solid #f44336',
              borderRadius: '6px',
              padding: '12px',
              marginBottom: '20px',
              fontSize: '13px',
              color: '#c62828'
            }}>
              <strong>⚠️ Molimo ispravite sledeće greške:</strong>
              <ul style={{ margin: '5px 0 0 20px', padding: 0 }}>
                {Object.keys(errors).map(key => 
                  errors[key] && touched[key] && (
                    <li key={key}>{errors[key]}</li>
                  )
                )}
              </ul>
            </div>
          )}

          {/* Dugmad */}
          <div style={{ 
            display: 'flex', 
            gap: '12px', 
            justifyContent: 'flex-end' 
          }}>
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
              disabled={!canSubmit}
              style={{
                background: canSubmit ? '#1976d2' : '#ccc',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '6px',
                cursor: canSubmit ? 'pointer' : 'not-allowed',
                fontSize: '14px',
                fontWeight: '500',
                opacity: canSubmit ? 1 : 0.6
              }}
            >
              {loading 
                ? (isEditing ? 'Ažuriranje...' : 'Kreiranje...') 
                : (isEditing ? '💾 Ažuriraj Zadatak' : '➕ Kreiraj Zadatak')
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateZadatak;