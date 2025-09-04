import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import ProjekatDetails from '../components/projekti/ProjekatDetails';
import KreirajProjekat from '../components/projekti/KreirajProjekat';

const Projekti = () => {
  const { token, user } = useAuth();
  const [projekti, setProjekti] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedProjekat, setSelectedProjekat] = useState(null);
  const [editingProjekat, setEditingProjekat] = useState(null);

  const loadProjekti = async () => {
    try {
      const data = await api.getProjekti(token);
      setProjekti(data || []);
    } catch (error) {
      console.error('Error loading projekti:', error);
    }
    setLoading(false);
  };
  useEffect(() => {
    if (token) {
      loadProjekti();
    }
  }, [token]);

  const getStatusColor = (status) => {
    const colors = {
      'U_TOKU': '#2196f3',
      'ZAVRSEN': '#4caf50',
      'PLANIRANJE': '#ff9800',
      'OTKAZAN': '#f44336'
    };
    return colors[status] || '#757575';
  };

  const getStatusText = (status) => {
    const statusMap = {
      'U_TOKU': 'U toku',
      'ZAVRSEN': 'Završen',
      'PLANIRANJE': 'Planiranje',
      'OTKAZAN': 'Otkazan'
    };
    return statusMap[status] || status;
  };

  const getPriorityColor = (prioritet) => {
    const colors = {
      'NIZAK': '#4caf50',
      'SREDNJI': '#ff9800',
      'VISOK': '#f44336',
      'KRITICAN': '#9c27b0'
    };
    return colors[prioritet] || '#757575';
  };

  const getPriorityText = (prioritet) => {
    const priorityMap = {
      'NIZAK': 'Nizak',
      'SREDNJI': 'Srednji',
      'VISOK': 'Visok',
      'KRITICAN': 'Kritičan'
    };
    return priorityMap[prioritet] || prioritet;
  };

  const filteredProjekti = projekti.filter(projekat => {
    const matchesSearch = projekat.naziv.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         projekat.opis?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus === '' || projekat.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  // Svi korisnici mogu kreirati i editovati projekte
  const canCreateProject = !!user; // Bilo koji ulogovan korisnik
  const canEditProject = user?.uloga === 'ROLE_ADMIN' || 
                          user?.uloga === 'ROLE_MENADZER_PROJEKTA' || 
                          user?.uloga === 'ADMIN' || 
                          user?.uloga === 'MENADZER_PROJEKTA';

  // Debug log
  console.log('Projekti - User role:', user?.uloga);
  console.log('Projekti - Can create project:', canCreateProject);

  // Handler funkcije
  const handleSelectProjekat = (projekat) => {
    setSelectedProjekat(projekat);
  };

  const handleEditProjekat = (projekat) => {
    console.log('Editing project:', projekat); // Za debug
    setEditingProjekat(projekat);
    setSelectedProjekat(null); // Zatvaram details ako je otvoren
  };

  const handleDeleteProjekat = async (projekat) => {
    if (window.confirm(`Da li ste sigurni da želite da obrišete projekat "${projekat.naziv}"?`)) {
      try {
        // Pozivamo pravi API za brisanje projekta
        await api.obrisiProjekat(token, projekat.id);
        
        // Uklanjamo projekat iz liste
        //setProjekti(prev => prev.filter(p => p.id !== projekat.id));
        loadProjekti();
        
        alert('Projekat je uspešno obrisan!');
      } catch (error) {
        console.error('Error deleting project:', error);
        alert('Greška pri brisanju projekta: ' + (error.message || 'Nepoznata greška'));
      }
    }
  };

  const handleKreirajProjekat = async (formData) => {
    try {
      console.log('Creating project:', formData);
      
      // Pozivamo pravi API za kreiranje projekta
      const newProjekat = await api.kreirajProjekat(token, formData);
      
      // Dodajemo novi projekat u listu
      //setProjekti(prev => [newProjekat, ...prev]);
      loadProjekti();
      setShowCreateForm(false);
      
      alert('Projekat je uspešno kreiran!');
    } catch (error) {
      console.error('Error creating project:', error);
      alert('Greška pri kreiranju projekta: ' + (error.message || 'Nepoznata greška'));
    }
  };

  const handleUpdateProjekat = async (formData) => {
    try {
      console.log('Updating project:', editingProjekat.id, formData);
      
      // Pozivamo pravi API za ažuriranje projekta
      const updatedProjekat = await api.azurirajProjekat(token, editingProjekat.id, formData);
      
      // Ažuriramo projekat u listi
      //setProjekti(prev => prev.map(p => p.id === editingProjekat.id ? updatedProjekat : p));
      loadProjekti();
      setEditingProjekat(null);
      
      alert('Projekat je uspešno ažuriran!');
    } catch (error) {
      console.error('Error updating project:', error);
      alert('Greška pri ažuriranju projekta: ' + (error.message || 'Nepoznata greška'));
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Učitavanje projekata...</div>;
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: '#1976d2' }}>📁 Moji Projekti</h1>
        {canCreateProject && (user?.uloga === 'ROLE_ADMIN' || user?.uloga === 'ROLE_MENADZER_PROJEKTA') && (
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
            + Novi Projekat
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
          placeholder="Pretražite projekte po nazivu ili opisu..."
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
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          style={{
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            fontSize: '14px',
            minWidth: '150px'
          }}
        >
          <option value="">Svi statusi</option>
          <option value="PLANIRANJE">Planiranje</option>
          <option value="U_TOKU">U toku</option>
          <option value="ZAVRSEN">Završen</option>
          <option value="OTKAZAN">Otkazan</option>
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
          <h3 style={{ margin: '0 0 5px 0', fontSize: '24px' }}>{projekti.length}</h3>
          <p style={{ margin: 0, opacity: 0.9 }}>Ukupno projekata</p>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #2196f3, #64b5f6)',
          color: 'white',
          padding: '20px',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 5px 0', fontSize: '24px' }}>
            {projekti.filter(p => p.status === 'U_TOKU').length}
          </h3>
          <p style={{ margin: 0, opacity: 0.9 }}>U toku</p>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #4caf50, #81c784)',
          color: 'white',
          padding: '20px',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 5px 0', fontSize: '24px' }}>
            {projekti.filter(p => p.status === 'ZAVRSEN').length}
          </h3>
          <p style={{ margin: 0, opacity: 0.9 }}>Završeni</p>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #ff9800, #ffb74d)',
          color: 'white',
          padding: '20px',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 5px 0', fontSize: '24px' }}>
            {projekti.filter(p => p.status === 'PLANIRANJE').length}
          </h3>
          <p style={{ margin: 0, opacity: 0.9 }}>Planiranje</p>
        </div>
      </div>

      {/* Lista projekata */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
        gap: '20px'
      }}>
        {filteredProjekti.map((projekat) => (
          <div key={projekat.id} style={{
            background: 'white',
            border: '1px solid #e0e0e0',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            transition: 'transform 0.2s, box-shadow 0.2s',
            cursor: 'pointer'
          }}
          onClick={() => handleSelectProjekat(projekat)}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
          }}>
            <div style={{ marginBottom: '15px' }}>
              <h3 style={{ margin: '0 0 8px 0', color: '#1976d2', fontSize: '18px' }}>
                {projekat.naziv}
              </h3>
              <p style={{ margin: 0, color: '#666', fontSize: '14px', lineHeight: '1.4' }}>
                {projekat.opis || 'Nema opisa'}
              </p>
            </div>
            
            <div style={{ marginBottom: '15px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{
                background: getStatusColor(projekat.status),
                color: 'white',
                padding: '6px 12px',
                borderRadius: '16px',
                fontSize: '12px',
                fontWeight: 'bold'
              }}>
                {getStatusText(projekat.status)}
              </span>
              {projekat.prioritet && (
                <span style={{
                  background: getPriorityColor(projekat.prioritet),
                  color: 'white',
                  padding: '6px 12px',
                  borderRadius: '16px',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}>
                  {getPriorityText(projekat.prioritet)}
                </span>
              )}
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '15px',
              fontSize: '12px',
              color: '#666',
              marginBottom: '15px'
            }}>
              <div>
                <div style={{ marginBottom: '5px' }}>📋 {projekat.brojZadataka || 0} zadataka</div>
                <div>👥 {projekat.brojClanova || 0} članova</div>
              </div>
              <div>
                {projekat.datumPocetka && (
                  <div style={{ marginBottom: '5px' }}>
                    📅 {new Date(projekat.datumPocetka).toLocaleDateString('sr-RS')}
                  </div>
                )}
                {projekat.datumZavrsetka && (
                  <div>
                    🏁 {new Date(projekat.datumZavrsetka).toLocaleDateString('sr-RS')}
                  </div>
                )}
              </div>
            </div>

            {/* Menadžer i kreator */}
            <div style={{ fontSize: '11px', color: '#999', borderTop: '1px solid #eee', paddingTop: '10px' }}>
              {projekat.menadzer && (
                <div>Menadžer: {projekat.menadzer.ime} {projekat.menadzer.prezime}</div>
              )}
              {projekat.kreiraoPKorisnik && (
                <div>Kreirao: {projekat.kreiraoPKorisnik.ime} {projekat.kreiraoPKorisnik.prezime}</div>
              )}
            </div>

            {/* Akcije */}
            {canEditProject && (
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
                  onClick={() => handleEditProjekat(projekat)}
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
                  onClick={() => handleDeleteProjekat(projekat)}
                  style={{
                    background: '#f44336',
                    color: 'white',
                    border: 'none',
                    padding: '6px 12px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    flex: 1
                  }}
                >
                  Obriši
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredProjekti.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          color: '#666'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>📁</div>
          <h3 style={{ marginBottom: '10px' }}>
            {searchTerm || selectedStatus ? 'Nema rezultata' : 'Nemate projekata'}
          </h3>
          <p>
            {searchTerm || selectedStatus 
              ? 'Pokušajte sa drugačijim kriterijumima pretrage.'
              : canCreateProject 
                ? 'Kreirajte svoj prvi projekat da biste počeli!'
                : 'Čekate da vam bude dodeljen projekat.'
            }
          </p>
        </div>
      )}

      {/* Modali */}
      {showCreateForm && (
        <KreirajProjekat
          onSubmit={handleKreirajProjekat}
          onCancel={() => setShowCreateForm(false)}
        />
      )}

      {selectedProjekat && (
        <ProjekatDetails
          projekat={selectedProjekat}
          onClose={() => setSelectedProjekat(null)}
          onEdit={handleEditProjekat}
        />
      )}

      {editingProjekat && (
        <KreirajProjekat
          onSubmit={handleUpdateProjekat}
          onCancel={() => setEditingProjekat(null)}
          initialData={editingProjekat}
          isEditing={true}
          loading={false}
        />
      )}
    </div>
  );
};

export default Projekti;