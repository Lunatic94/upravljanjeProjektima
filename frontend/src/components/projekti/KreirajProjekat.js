import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const KreirajProjekat = ({ onSubmit, onCancel, loading = false, initialData = null, isEditing = false }) => {
  const [formData, setFormData] = useState({
    naziv: '',
    opis: '',
    datumPocetka: '',
    datumZavrsetka: '',
    prioritet: 'SREDNJI',
    status: 'PLANIRANJE',
    menadzerId: ''
  });

  // Popuni formu sa podacima za edit
  useEffect(() => {
    if (initialData && isEditing) {
      // Formatiramo datume za input type="date"
      const formatDateForInput = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
      };

      setFormData({
        naziv: initialData.naziv || '',
        opis: initialData.opis || '',
        datumPocetka: formatDateForInput(initialData.datumPocetka),
        datumZavrsetka: formatDateForInput(initialData.datumZavrsetka),
        prioritet: initialData.prioritet || 'SREDNJI',
        status: initialData.status || 'PLANIRANJE',
        menadzerId: initialData.menadzerId || ''
      });
    } else if (!isEditing) {
      // Resetuj formu za kreiranje novog projekta
      setFormData({
        naziv: '',
        opis: '',
        datumPocetka: '',
        datumZavrsetka: '',
        prioritet: 'SREDNJI',
        status: 'PLANIRANJE',
        menadzerId: ''
      });
    }
  }, [initialData, isEditing]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.(formData);
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
          📝 {isEditing ? 'Ažuriranje Projekta' : 'Kreiranje Novog Projekta'}
        </h2>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>
              Naziv projekta *
            </label>
            <input
              type="text"
              name="naziv"
              value={formData.naziv}
              onChange={handleChange}
              required
              placeholder="Unesite naziv projekta"
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
              Opis projekta
            </label>
            <textarea
              name="opis"
              value={formData.opis}
              onChange={handleChange}
              rows="4"
              placeholder="Opišite projekat..."
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
                Datum početka
              </label>
              <input
                type="date"
                name="datumPocetka"
                value={formData.datumPocetka}
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

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>
                Datum završetka
              </label>
              <input
                type="date"
                name="datumZavrsetka"
                value={formData.datumZavrsetka}
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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
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

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                disabled={!isEditing} // Onemogući menjanje statusa pri kreiranju
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '6px',
                  fontSize: '14px',
                  outline: 'none',
                  backgroundColor: !isEditing ? '#f5f5f5' : 'white',
                  cursor: !isEditing ? 'not-allowed' : 'pointer'
                }}
              >
                <option value="PLANIRANJE">📋 Planiranje</option>
                <option value="U_TOKU">⚡ U toku</option>
                <option value="ZAVRSEN">✅ Završen</option>
                <option value="OTKAZAN">❌ Otkazan</option>
              </select>
              {!isEditing && (
                <small style={{ color: '#666', fontSize: '12px' }}>
                  Novi projekti počinju sa statusom "Planiranje"
                </small>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '25px' }}>
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
              disabled={loading || !formData.naziv.trim()}
              style={{
                background: loading || !formData.naziv.trim() ? '#ccc' : '#1976d2',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '6px',
                cursor: loading || !formData.naziv.trim() ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: '500'
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