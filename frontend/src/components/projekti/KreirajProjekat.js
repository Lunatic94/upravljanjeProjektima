// frontend/src/components/projekti/KreirajProjekat.js

import React, { useEffect } from 'react';
import { useFormValidation, projekatValidationRules } from '../../hooks/useFormValidation';
import { formatDateForInput } from '../../utils/dateValidation';

const KreirajProjekat = ({ onSubmit, onCancel, loading = false, initialData = null, isEditing = false }) => {
  
  const initialValues = {
    naziv: '',
    opis: '',
    datumPocetka: '',
    datumZavrsetka: '',
    prioritet: 'SREDNJI',
    status: 'PLANIRANJE',
    menadzerId: ''
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
  } = useFormValidation(initialValues, projekatValidationRules);

  // Popuni formu sa podacima za edit
  useEffect(() => {
    if (initialData && isEditing) {
      setFormValues({
        naziv: initialData.naziv || '',
        opis: initialData.opis || '',
        datumPocetka: formatDateForInput(initialData.datumPocetka),
        datumZavrsetka: formatDateForInput(initialData.datumZavrsetka),
        prioritet: initialData.prioritet || 'SREDNJI',
        status: initialData.status || 'PLANIRANJE',
        menadzerId: initialData.menadzerId || ''
      });
    }
  }, [initialData, isEditing, setFormValues]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setAllTouched();
    
    if (validateForm()) {
      onSubmit?.(values);
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

  const canSubmit = !loading && values.naziv.trim() && !hasErrors;

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
          📝 {isEditing ? 'Ažuriraj Projekat' : 'Kreiraj Novi Projekat'}
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Naziv projekta */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: 'bold', 
              color: '#333' 
            }}>
              Naziv projekta *
            </label>
            <input
              type="text"
              name="naziv"
              value={values.naziv}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Unesite naziv projekta..."
              style={getInputStyle('naziv')}
              onFocus={(e) => {
                if (!isFieldInvalid('naziv')) {
                  e.target.style.borderColor = '#1976d2';
                }
              }}
            />
            {renderFieldError('naziv')}
          </div>

          {/* Opis */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: 'bold', 
              color: '#333' 
            }}>
              Opis projekta
            </label>
            <textarea
              name="opis"
              value={values.opis}
              onChange={handleChange}
              placeholder="Opišite projekat..."
              rows="4"
              style={{
                ...getInputStyle('opis'),
                resize: 'vertical',
                minHeight: '100px'
              }}
              onFocus={(e) => e.target.style.borderColor = '#1976d2'}
              onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
            />
          </div>

          {/* Datumi */}
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
                Datum početka
              </label>
              <input
                type="date"
                name="datumPocetka"
                value={values.datumPocetka}
                onChange={handleChange}
                onBlur={handleBlur}
                style={getInputStyle('datumPocetka')}
                onFocus={(e) => {
                  if (!isFieldInvalid('datumPocetka')) {
                    e.target.style.borderColor = '#1976d2';
                  }
                }}
              />
              {renderFieldError('datumPocetka')}
            </div>

            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontWeight: 'bold', 
                color: '#333' 
              }}>
                Datum završetka
              </label>
              <input
                type="date"
                name="datumZavrsetka"
                value={values.datumZavrsetka}
                onChange={handleChange}
                onBlur={handleBlur}
                style={getInputStyle('datumZavrsetka')}
                onFocus={(e) => {
                  if (!isFieldInvalid('datumZavrsetka')) {
                    e.target.style.borderColor = '#1976d2';
                  }
                }}
              />
              {renderFieldError('datumZavrsetka')}
            </div>
          </div>

          {/* Info poruka o validaciji datuma */}
          {(values.datumPocetka || values.datumZavrsetka) && !errors.datumZavrsetka && (
            <div style={{
              background: '#e3f2fd',
              border: '1px solid #2196f3',
              borderRadius: '6px',
              padding: '12px',
              marginBottom: '20px',
              fontSize: '13px',
              color: '#1976d2'
            }}>
              💡 <strong>Napomena:</strong> Ako unesete oba datuma, datum završetka mora biti nakon ili isti kao datum početka.
            </div>
          )}

          {/* Prioritet i Status */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: isEditing ? '1fr 1fr' : '1fr', 
            gap: '15px', 
            marginBottom: '25px' 
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

            {isEditing && (
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: 'bold', 
                  color: '#333' 
                }}>
                  Status
                </label>
                <select
                  name="status"
                  value={values.status}
                  onChange={handleChange}
                  style={getInputStyle('status')}
                >
                  <option value="PLANIRANJE">📋 Planiranje</option>
                  <option value="U_TOKU">⚡ U toku</option>
                  <option value="ZAVRSEN">✅ Završen</option>
                  <option value="OTKAZAN">❌ Otkazan</option>
                </select>
              </div>
            )}
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
                fontWeight: '500',
                transition: 'background-color 0.3s'
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
                opacity: canSubmit ? 1 : 0.6,
                transition: 'all 0.3s'
              }}
            >
              {loading 
                ? (isEditing ? 'Ažuriranje...' : 'Kreiranje...') 
                : (isEditing ? '💾 Ažuriraj Projekat' : '📝 Kreiraj Projekat')
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default KreirajProjekat;