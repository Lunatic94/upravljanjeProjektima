import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import CreateKorisnik from '../components/korisnici/CreateKorisnik';
import KorisnikDetails from '../components/korisnici/KorisnikDetails';

const Korisnici = () => {
  const { token, user } = useAuth();
  const [korisnici, setKorisnici] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  
  // Modal states
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedKorisnik, setSelectedKorisnik] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    loadKorisnici();
  }, [token, user?.uloga]);

  const loadKorisnici = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      console.log('Loading korisnici...', { token, user }); // Debug log
      let data;
      if (user?.uloga === 'ROLE_ADMIN' || user?.uloga === 'ADMIN') {
        data = await api.getSviKorisnici(token);
      } else {
        data = await api.getKorisnici(token);
      }
      console.log('Loaded korisnici:', data); // Debug log
      setKorisnici(data || []);
    } catch (error) {
      console.error('Error loading korisnici:', error);
      // Pokušaj sa drugim endpoint-om ako prvi ne radi
      try {
        const data = await api.getKorisnici(token);
        setKorisnici(data || []);
      } catch (secondError) {
        console.error('Second attempt failed:', secondError);
        setKorisnici([]);
      }
    }
    setLoading(false);
  };

  const handleCreateKorisnik = async (formData) => {
    setFormLoading(true);
    try {
      // Pozovi API za kreiranje korisnika
      const response = await fetch('http://localhost:8080/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || errorData.error || 'Greška pri kreiranju korisnika');
      }

      // Refresh lista korisnika
      await loadKorisnici();
      setShowCreateForm(false);
      alert('Korisnik je uspešno kreiran!');
    } catch (error) {
      console.error('Error creating user:', error);
      alert('Greška pri kreiranju korisnika: ' + error.message);
    }
    setFormLoading(false);
  };

  const handleEditKorisnik = (korisnik) => {
    setSelectedKorisnik(korisnik);
    setShowEditForm(true);
  };

  const handleUpdateKorisnik = async (formData) => {
    if (!selectedKorisnik) return;
    
    setFormLoading(true);
    try {
      const response = await fetch(`http://localhost:8080/api/korisnici/${selectedKorisnik.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || errorData.error || 'Greška pri ažuriranju korisnika');
      }

      await loadKorisnici();
      setShowEditForm(false);
      setSelectedKorisnik(null);
      alert('Korisnik je uspešno ažuriran!');
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Greška pri ažuriranju korisnika: ' + error.message);
    }
    setFormLoading(false);
  };

  const handleDeactivateKorisnik = async (korisnik) => {
    const action = korisnik.aktivan ? 'deaktivirati' : 'aktivirati';
    const confirmMessage = `Da li ste sigurni da želite da ${action} korisnika ${korisnik.ime} ${korisnik.prezime}?`;
    
    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/korisnici/${korisnik.id}`, {
        method: 'DELETE', // Backend koristi DELETE za deaktivaciju
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || errorData.error || 'Greška pri promeni statusa korisnika');
      }

      await loadKorisnici();
      alert(`Korisnik je uspešno ${korisnik.aktivan ? 'deaktiviran' : 'aktiviran'}!`);
    } catch (error) {
      console.error('Error changing user status:', error);
      alert('Greška pri promeni statusa korisnika: ' + error.message);
    }
  };

  const handleShowDetails = (korisnik) => {
    setSelectedKorisnik(korisnik);
    setShowDetailsModal(true);
  };

  const getRoleText = (uloga) => {
    const roleMap = {
      'ADMIN': 'Administrator',
      'ROLE_ADMIN': 'Administrator',
      'MENADZER_PROJEKTA': 'Menadžer Projekta',
      'ROLE_MENADZER_PROJEKTA': 'Menadžer Projekta',
      'PROGRAMER': 'Programer',
      'ROLE_PROGRAMER': 'Programer'
    };
    return roleMap[uloga] || uloga?.replace('ROLE_', '').replace('_', ' ');
  };

  const getRoleColor = (uloga) => {
    const colors = {
      'ADMIN': '#f44336',
      'ROLE_ADMIN': '#f44336',
      'MENADZER_PROJEKTA': '#2196f3',
      'ROLE_MENADZER_PROJEKTA': '#2196f3',
      'PROGRAMER': '#4caf50',
      'ROLE_PROGRAMER': '#4caf50'
    };
    return colors[uloga] || '#757575';
  };

  const filteredKorisnici = korisnici.filter(korisnik => {
    const matchesSearch = korisnik.ime?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         korisnik.prezime?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         korisnik.korisnickoIme?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         korisnik.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = selectedRole === '' || korisnik.uloga === selectedRole;
    
    return matchesSearch && matchesRole;
  });

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Učitavanje korisnika...</div>;
  }

  const canViewAllUsers = user?.uloga === 'ROLE_ADMIN' || user?.uloga === 'ROLE_MENADZER_PROJEKTA' || 
                          user?.uloga === 'ADMIN' || user?.uloga === 'MENADZER_PROJEKTA';

  const canManageUsers = user?.uloga === 'ROLE_ADMIN' || user?.uloga === 'ADMIN';

  if (!canViewAllUsers) {
    return (
      <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
        <h1 style={{ color: '#1976d2', marginBottom: '20px' }}>👥 Korisnici</h1>
        <div style={{ 
          background: '#fff3cd', 
          border: '1px solid #ffeaa7', 
          borderRadius: '8px', 
          padding: '20px',
          color: '#856404'
        }}>
          <h3>Nemate dozvolu</h3>
          <p>Samo administratori i menadžeri projekata mogu videti listu svih korisnika.</p>
          <p>Vaša uloga: {getRoleText(user?.uloga)}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: '#1976d2' }}>👥 Korisnici</h1>
        {canManageUsers && (
          <button
            onClick={() => setShowCreateForm(true)}
            style={{
              background: '#1976d2',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            + Novi Korisnik
          </button>
        )}
      </div>

      {/* Filteri i pretraga */}
      <div style={{ 
        background: 'white', 
        padding: '20px', 
        borderRadius: '8px', 
        marginBottom: '20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        display: 'flex',
        gap: '15px',
        alignItems: 'center',
        flexWrap: 'wrap'
      }}>
        <input
          type="text"
          placeholder="Pretražite po imenu, prezimenu, korisničkom imenu ili email-u..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            flex: 1,
            minWidth: '300px',
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            fontSize: '14px'
          }}
        />
        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          style={{
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            fontSize: '14px',
            minWidth: '150px'
          }}
        >
          <option value="">Sve uloge</option>
          <option value="ADMIN">Administrator</option>
          <option value="ROLE_ADMIN">Administrator</option>
          <option value="MENADZER_PROJEKTA">Menadžer Projekta</option>
          <option value="ROLE_MENADZER_PROJEKTA">Menadžer Projekta</option>
          <option value="PROGRAMER">Programer</option>
          <option value="ROLE_PROGRAMER">Programer</option>
        </select>
      </div>

      {/* Statistike */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '15px',
        marginBottom: '30px'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #1976d2, #42a5f5)',
          color: 'white',
          padding: '20px',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 5px 0', fontSize: '24px' }}>{korisnici.length}</h3>
          <p style={{ margin: 0, opacity: 0.9 }}>Ukupno korisnika</p>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #4caf50, #81c784)',
          color: 'white',
          padding: '20px',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 5px 0', fontSize: '24px' }}>
            {korisnici.filter(k => k.uloga === 'PROGRAMER' || k.uloga === 'ROLE_PROGRAMER').length}
          </h3>
          <p style={{ margin: 0, opacity: 0.9 }}>Programeri</p>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #2196f3, #64b5f6)',
          color: 'white',
          padding: '20px',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 5px 0', fontSize: '24px' }}>
            {korisnici.filter(k => k.uloga === 'MENADZER_PROJEKTA' || k.uloga === 'ROLE_MENADZER_PROJEKTA').length}
          </h3>
          <p style={{ margin: 0, opacity: 0.9 }}>Menadžeri</p>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #f44336, #e57373)',
          color: 'white',
          padding: '20px',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 5px 0', fontSize: '24px' }}>
            {korisnici.filter(k => k.uloga === 'ADMIN' || k.uloga === 'ROLE_ADMIN').length}
          </h3>
          <p style={{ margin: 0, opacity: 0.9 }}>Administratori</p>
        </div>
      </div>

      {/* Lista korisnika */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '20px'
      }}>
        {filteredKorisnici.map((korisnik) => (
          <div key={korisnik.id} style={{
            background: 'white',
            border: '1px solid #e0e0e0',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            transition: 'transform 0.2s, box-shadow 0.2s',
            cursor: 'pointer'
          }}
          onClick={() => handleShowDetails(korisnik)}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                background: getRoleColor(korisnik.uloga),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '20px',
                fontWeight: 'bold',
                marginRight: '15px'
              }}>
                {korisnik.ime?.charAt(0)?.toUpperCase()}{korisnik.prezime?.charAt(0)?.toUpperCase()}
              </div>
              <div>
                <h3 style={{ margin: '0 0 5px 0', color: '#333', fontSize: '16px' }}>
                  {korisnik.ime} {korisnik.prezime}
                </h3>
                <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
                  @{korisnik.korisnickoIme}
                </p>
              </div>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <span style={{
                background: getRoleColor(korisnik.uloga),
                color: 'white',
                padding: '6px 12px',
                borderRadius: '16px',
                fontSize: '12px',
                fontWeight: 'bold'
              }}>
                {getRoleText(korisnik.uloga)}
              </span>
            </div>

            <div style={{ fontSize: '13px', color: '#666' }}>
              <div style={{ marginBottom: '5px' }}>
                📧 {korisnik.email}
              </div>
              <div style={{ marginBottom: '5px' }}>
                📅 Registrovan: {korisnik.datumKreiranja ? new Date(korisnik.datumKreiranja).toLocaleDateString('sr-RS') : 'N/A'}
              </div>
              <div>
                ✅ Status: {korisnik.aktivan ? 'Aktivan' : 'Neaktivan'}
              </div>
            </div>

            {canManageUsers && (
              <div 
                onClick={(e) => e.stopPropagation()}
                style={{ 
                  marginTop: '15px', 
                  paddingTop: '15px', 
                  borderTop: '1px solid #eee',
                  display: 'flex',
                  gap: '10px'
                }}
              >
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditKorisnik(korisnik);
                  }}
                  style={{
                    background: '#2196f3',
                    color: 'white',
                    border: 'none',
                    padding: '6px 12px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    flex: 1
                  }}
                >
                  Ažuriraj
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeactivateKorisnik(korisnik);
                  }}
                  style={{
                    background: korisnik.aktivan ? '#ff9800' : '#4caf50',
                    color: 'white',
                    border: 'none',
                    padding: '6px 12px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    flex: 1
                  }}
                >
                  {korisnik.aktivan ? 'Deaktiviraj' : 'Aktiviraj'}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredKorisnici.length === 0 && !loading && (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          color: '#666'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>👥</div>
          <h3 style={{ marginBottom: '10px' }}>Nema rezultata</h3>
          <p>Pokušajte sa drugačijim kriterijumima pretrage.</p>
        </div>
      )}

      {/* Modals */}
      {showCreateForm && (
        <CreateKorisnik
          onSubmit={handleCreateKorisnik}
          onCancel={() => setShowCreateForm(false)}
          loading={formLoading}
        />
      )}

      {showEditForm && selectedKorisnik && (
        <CreateKorisnik
          onSubmit={handleUpdateKorisnik}
          onCancel={() => {
            setShowEditForm(false);
            setSelectedKorisnik(null);
          }}
          loading={formLoading}
          initialData={selectedKorisnik}
          isEditing={true}
        />
      )}

      {showDetailsModal && selectedKorisnik && (
        <KorisnikDetails
          korisnik={selectedKorisnik}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedKorisnik(null);
          }}
          onEdit={canManageUsers ? handleEditKorisnik : null}
          onDeactivate={canManageUsers ? handleDeactivateKorisnik : null}
        />
      )}
    </div>
  );
};

export default Korisnici;