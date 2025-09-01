import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const CreateKorisnik = ({ onSubmit, onCancel, loading = false, initialData = null, isEditing = false }) => {
  const [formData, setFormData] = useState({
    ime: '',
    prezime: '',
    korisnickoIme: '',
    email: '',
    lozinka: '',
    uloga: 'PROGRAMER',
    aktivan: true
  });

  // Popuni formu sa podacima za edit
  useEffect(() => {
    if (initialData && isEditing) {
      setFormData({
        ime: initialData.ime || '',
        prezime: initialData.prezime || '',
        korisnickoIme: initialData.korisnickoIme || '',
        email: initialData.email || '',
        lozinka: '', // Ne prikazujemo postojeću lozinku
        uloga: initialData.uloga || 'PROGRAMER',
        aktivan: initialData.aktivan !== undefined ? initialData.aktivan : true
      });
    } else if (!isEditing) {
      // Resetuj formu za kreiranje novog korisnika
      setFormData({
        ime: '',
        prezime: '',
        korisnickoIme: '',
        email: '',
        lozinka: '',
        uloga: 'PROGRAMER',
        aktivan: true
      });
    }
  }, [initialData, isEditing]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Ne šaljemo lozinku ako je prazan i editujemo
    const submitData = { ...formData };
    if (isEditing && !submitData.lozinka) {
      delete submitData.lozinka;
    }
    onSubmit?.(submitData);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
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
          👤 {isEditing ? 'Ažuriranje Korisnika' : 'Kreiranje Novog Korisnika'}
        </h2>
        
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>
                Ime *
              </label>
              <input
                type="text"
                name="ime"
                value={formData.ime}
                onChange={handleChange}
                required
                placeholder="Unesite ime"
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

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>
                Prezime *
              </label>
              <input
                type="text"
                name="prezime"
                value={formData.prezime}
                onChange={handleChange}
                required
                placeholder="Unesite prezime"
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
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>
              Korisničko ime *
            </label>
            <input
              type="text"
              name="korisnickoIme"
              value={formData.korisnickoIme}
              onChange={handleChange}
              required
              disabled={isEditing} // Ne dozvoljavaj menjanje korisničkog imena
              placeholder="Unesite korisničko ime"
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e0e0e0',
                borderRadius: '6px',
                fontSize: '14px',
                outline: 'none',
                transition: 'border-color 0.3s',
                backgroundColor: isEditing ? '#f5f5f5' : 'white',
                cursor: isEditing ? 'not-allowed' : 'text'
              }}
              onFocus={(e) => !isEditing && (e.target.style.borderColor = '#1976d2')}
              onBlur={(e) => !isEditing && (e.target.style.borderColor = '#e0e0e0')}
            />
            {isEditing && (
              <small style={{ color: '#666', fontSize: '12px' }}>
                Korisničko ime se ne može menjati
              </small>
            )}
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Unesite email adresu"
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
              {isEditing ? 'Nova lozinka (ostavite prazno da zadržite postojeću)' : 'Lozinka *'}
            </label>
            <input
              type="password"
              name="lozinka"
              value={formData.lozinka}
              onChange={handleChange}
              required={!isEditing}
              placeholder={isEditing ? "Unesite novu lozinku (opciono)" : "Unesite lozinku"}
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

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '15px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>
                Uloga
              </label>
              <select
                name="uloga"
                value={formData.uloga}
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
                <option value="PROGRAMER">👨‍💻 Programer</option>
                <option value="MENADZER_PROJEKTA">👔 Menadžer Projekta</option>
                <option value="ADMIN">👑 Administrator</option>
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', paddingTop: '30px' }}>
              <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  name="aktivan"
                  checked={formData.aktivan}
                  onChange={handleChange}
                  style={{ marginRight: '8px' }}
                />
                <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#333' }}>
                  ✅ Aktivan
                </span>
              </label>
            </div>
          </div>

          {/* Prikaz trenutne uloge za edit mode */}
          {isEditing && (
            <div style={{
              background: '#f8f9fa',
              padding: '15px',
              borderRadius: '6px',
              marginBottom: '20px',
              fontSize: '14px',
              color: '#666'
            }}>
              <strong>💡 Napomena:</strong> Menjanje uloge može uticati na dozvole korisnika u sistemu.
            </div>
          )}

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
              disabled={loading || !formData.ime.trim() || !formData.prezime.trim() || !formData.email.trim()}
              style={{
                background: loading || !formData.ime.trim() || !formData.prezime.trim() || !formData.email.trim() ? '#ccc' : '#1976d2',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '6px',
                cursor: loading || !formData.ime.trim() || !formData.prezime.trim() || !formData.email.trim() ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              {loading 
                ? (isEditing ? 'Ažuriranje...' : 'Kreiranje...') 
                : (isEditing ? '💾 Ažuriraj Korisnika' : '👤 Kreiraj Korisnika')
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateKorisnik;