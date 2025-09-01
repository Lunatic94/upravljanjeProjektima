import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { zadatakService } from '../services/zadatakService';
import { api } from '../services/api';
import ZadatakDetails from '../components/zadaci/ZadatakDetails';
import CreateZadatak from '../components/zadaci/CreateZadatak';

const Zadaci = () => {
  const { token, user } = useAuth();
  const [zadaci, setZadaci] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedZadatak, setSelectedZadatak] = useState(null);
  const [editingZadatak, setEditingZadatak] = useState(null);

  useEffect(() => {
    const loadZadaci = async () => {
      try {
        const data = await zadatakService.getMojiZadaci(token);
        setZadaci(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error loading zadaci:', error);
        setZadaci([]);
      }
      setLoading(false);
    };

    if (token) {
      loadZadaci();
    }
  }, [token]);

  const getStatusColor = (status) => {
    const colors = {
      'TREBA_URADITI': '#9c27b0',
      'U_TOKU': '#2196f3',
      'NA_PREGLEDU': '#ff5722',
      'ZAVRSENO': '#4caf50'
    };
    return colors[status] || '#757575';
  };

  const getStatusText = (status) => {
    const statusMap = {
      'TREBA_URADITI': 'Treba uraditi',
      'U_TOKU': 'U toku',
      'NA_PREGLEDU': 'Na pregledu',
      'ZAVRSENO': 'Završeno'
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

  const filteredZadaci = zadaci.filter(zadatak => {
    const matchesSearch = zadatak.naslov.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         zadatak.nazivProjekta?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus === '' || zadatak.status === selectedStatus;
    const matchesPriority = selectedPriority === '' || zadatak.prioritet === selectedPriority;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Svi korisnici mogu kreirati i editovati zadatke
  const canCreateTask = !!user; // Bilo koji ulogovan korisnik
  const canEditTask = !!user;   // Bilo koji ulogovan korisnik

  // Debug log
  console.log('Zadaci - User role:', user?.uloga);
  console.log('Zadaci - Can create task:', canCreateTask);

  // Handler funkcije
  const handleSelectZadatak = (zadatak) => {
    setSelectedZadatak(zadatak);
  };

  const handleEditZadatak = (zadatak) => {
    console.log('Editing task:', zadatak);
    setEditingZadatak(zadatak);
    setSelectedZadatak(null);
  };

  const handleDeleteZadatak = async (zadatak) => {
    if (window.confirm(`Da li ste sigurni da želite da obrišete zadatak "${zadatak.naslov}"?`)) {
      try {
        await zadatakService.obrisiZadatak(token, zadatak.id);
        setZadaci(prev => prev.filter(z => z.id !== zadatak.id));
        alert('Zadatak je uspešno obrisan!');
      } catch (error) {
        console.error('Error deleting task:', error);
        alert('Greška pri brisanju zadatka: ' + (error.message || 'Nepoznata greška'));
      }
    }
  };

  const handleCreateZadatak = async (formData) => {
    try {
      console.log('Creating task:', formData);
      const newZadatak = await zadatakService.kreirajZadatak(token, formData);
      setZadaci(prev => [newZadatak, ...prev]);
      setShowCreateForm(false);
      alert('Zadatak je uspešno kreiran!');
    } catch (error) {
      console.error('Error creating task:', error);
      alert('Greška pri kreiranju zadatka: ' + (error.message || 'Nepoznata greška'));
    }
  };

  const handleUpdateZadatak = async (formData) => {
    try {
      console.log('Updating task:', editingZadatak.id, formData);
      const updatedZadatak = await zadatakService.azurirajZadatak(token, editingZadatak.id, formData);
      setZadaci(prev => prev.map(z => z.id === editingZadatak.id ? updatedZadatak : z));
      setEditingZadatak(null);
      alert('Zadatak je uspešno ažuriran!');
    } catch (error) {
      console.error('Error updating task:', error);
      alert('Greška pri ažuriranju zadatka: ' + (error.message || 'Nepoznata greška'));
    }
  };

  const handleStatusChange = async (zadatakId, newStatus) => {
    try {
      await zadatakService.azurirajStatus(token, zadatakId, newStatus);
      setZadaci(prev => prev.map(z => z.id === zadatakId ? {...z, status: newStatus} : z));
    } catch (error) {
      console.error('Error updating task status:', error);
      alert('Greška pri menjanju statusa zadatka');
    }
  };

  const isOverdue = (zadatak) => {
    return zadatak.rokZavrsetka && new Date(zadatak.rokZavrsetka) < new Date() && zadatak.status !== 'ZAVRSENO';
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Učitavanje zadataka...</div>;
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: '#1976d2', margin: 0 }}>📋 Moji Zadaci</h1>
        {canCreateTask && (
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
            + Novi Zadatak
          </button>
        )}
      </div>

      {/* Filteri */}
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
          placeholder="Pretražite zadatke..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            flex: 1,
            minWidth: '250px',
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
            fontSize: '14px'
          }}
        >
          <option value="">Svi statusi</option>
          <option value="TREBA_URADITI">Treba uraditi</option>
          <option value="U_TOKU">U toku</option>
          <option value="NA_PREGLEDU">Na pregledu</option>
          <option value="ZAVRSENO">Završeno</option>
        </select>
        <select
          value={selectedPriority}
          onChange={(e) => setSelectedPriority(e.target.value)}
          style={{
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            fontSize: '14px'
          }}
        >
          <option value="">Svi prioriteti</option>
          <option value="NIZAK">Nizak</option>
          <option value="SREDNJI">Srednji</option>
          <option value="VISOK">Visok</option>
          <option value="KRITICAN">Kritičan</option>
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
          background: 'linear-gradient(135deg, #9c27b0, #ba68c8)',
          color: 'white',
          padding: '20px',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 5px 0', fontSize: '24px' }}>
            {zadaci.filter(z => z.status === 'TREBA_URADITI').length}
          </h3>
          <p style={{ margin: 0, opacity: 0.9 }}>Treba uraditi</p>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #2196f3, #64b5f6)',
          color: 'white',
          padding: '20px',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 5px 0', fontSize: '24px' }}>
            {zadaci.filter(z => z.status === 'U_TOKU').length}
          </h3>
          <p style={{ margin: 0, opacity: 0.9 }}>U toku</p>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #ff5722, #ff8a65)',
          color: 'white',
          padding: '20px',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 5px 0', fontSize: '24px' }}>
            {zadaci.filter(z => z.status === 'NA_PREGLEDU').length}
          </h3>
          <p style={{ margin: 0, opacity: 0.9 }}>Na pregledu</p>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #4caf50, #81c784)',
          color: 'white',
          padding: '20px',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 5px 0', fontSize: '24px' }}>
            {zadaci.filter(z => z.status === 'ZAVRSENO').length}
          </h3>
          <p style={{ margin: 0, opacity: 0.9 }}>Završeno</p>
        </div>
      </div>

      {/* Lista zadataka */}
      <div style={{ display: 'grid', gap: '15px' }}>
        {filteredZadaci.map((zadatak) => (
          <div 
            key={zadatak.id} 
            onClick={() => handleSelectZadatak(zadatak)}
            style={{
              background: 'white',
              border: isOverdue(zadatak) ? '2px solid #f44336' : '1px solid #e0e0e0',
              borderRadius: '8px',
              padding: '20px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              transition: 'box-shadow 0.2s',
              cursor: 'pointer',
              position: 'relative'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
            }}
          >
            {isOverdue(zadatak) && (
              <div style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                background: '#f44336',
                color: 'white',
                padding: '2px 8px',
                borderRadius: '12px',
                fontSize: '10px',
                fontWeight: 'bold'
              }}>
                KASNI
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: '0 0 5px 0', color: '#333', fontSize: '18px' }}>
                  {zadatak.naslov}
                </h3>
                <p style={{ margin: '0 0 10px 0', color: '#666', fontSize: '14px' }}>
                  📁 {zadatak.nazivProjekta}
                </p>
                {zadatak.opis && (
                  <p style={{ margin: '0 0 10px 0', color: '#666', fontSize: '14px', lineHeight: '1.4' }}>
                    {zadatak.opis}
                  </p>
                )}
              </div>
              <div style={{ display: 'flex', gap: '8px', marginLeft: '15px' }}>
                <span style={{
                  background: getStatusColor(zadatak.status),
                  color: 'white',
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '11px',
                  fontWeight: 'bold',
                  whiteSpace: 'nowrap'
                }}>
                  {getStatusText(zadatak.status)}
                </span>
                <span style={{
                  background: getPriorityColor(zadatak.prioritet),
                  color: 'white',
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '11px',
                  fontWeight: 'bold',
                  whiteSpace: 'nowrap'
                }}>
                  {getPriorityText(zadatak.prioritet)}
                </span>
              </div>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
              gap: '15px',
              fontSize: '12px',
              color: '#666',
              marginBottom: canEditTask ? '15px' : '0'
            }}>
              {zadatak.rokZavrsetka && (
                <div>
                  <strong>Rok:</strong><br />
                  <span style={{ color: isOverdue(zadatak) ? '#f44336' : '#666' }}>
                    {new Date(zadatak.rokZavrsetka).toLocaleDateString('sr-RS')}
                  </span>
                </div>
              )}
              {zadatak.procenjeniSati && (
                <div>
                  <strong>Procenjeno:</strong><br />
                  {zadatak.procenjeniSati}h
                </div>
              )}
              {zadatak.stvarniSati && (
                <div>
                  <strong>Utrošeno:</strong><br />
                  {zadatak.stvarniSati}h
                </div>
              )}
              {zadatak.dodeljen && (
                <div>
                  <strong>Dodeljen:</strong><br />
                  {zadatak.dodeljen.ime} {zadatak.dodeljen.prezime}
                </div>
              )}
            </div>

            {/* Akcije */}
            {canEditTask && (
              <div 
                onClick={(e) => e.stopPropagation()}
                style={{ 
                  paddingTop: '15px', 
                  borderTop: '1px solid #eee',
                  display: 'flex',
                  gap: '10px',
                  flexWrap: 'wrap'
                }}
              >
                {zadatak.status !== 'ZAVRSENO' && (
                  <select
                    value={zadatak.status}
                    onChange={(e) => handleStatusChange(zadatak.id, e.target.value)}
                    style={{
                      background: getStatusColor(zadatak.status),
                      color: 'white',
                      border: 'none',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="TREBA_URADITI">Treba uraditi</option>
                    <option value="U_TOKU">U toku</option>
                    <option value="NA_PREGLEDU">Na pregledu</option>
                    <option value="ZAVRSENO">Završeno</option>
                  </select>
                )}
                
                <button 
                  onClick={() => handleEditZadatak(zadatak)}
                  style={{
                    background: '#2196f3',
                    color: 'white',
                    border: 'none',
                    padding: '6px 12px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  ✏️ Ažuriraj
                </button>
                
                <button 
                  onClick={() => handleDeleteZadatak(zadatak)}
                  style={{
                    background: '#f44336',
                    color: 'white',
                    border: 'none',
                    padding: '6px 12px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  🗑️ Obriši
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredZadaci.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          color: '#666'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>📋</div>
          <h3 style={{ marginBottom: '10px' }}>
            {searchTerm || selectedStatus || selectedPriority ? 'Nema rezultata' : 'Nemate zadataka'}
          </h3>
          <p>
            {searchTerm || selectedStatus || selectedPriority 
              ? 'Pokušajte sa drugačijim kriterijumima pretrage.'
              : 'Svi zadaci su završeni ili vam još nisu dodeljeni!'
            }
          </p>
        </div>
      )}

      {/* Modali */}
      {showCreateForm && (
        <CreateZadatak
          onSubmit={handleCreateZadatak}
          onCancel={() => setShowCreateForm(false)}
        />
      )}

      {selectedZadatak && (
        <ZadatakDetails
          zadatak={selectedZadatak}
          onClose={() => setSelectedZadatak(null)}
          onEdit={handleEditZadatak}
          onStatusChange={handleStatusChange}
        />
      )}

      {editingZadatak && (
        <CreateZadatak
          onSubmit={handleUpdateZadatak}
          onCancel={() => setEditingZadatak(null)}
          initialData={editingZadatak}
          isEditing={true}
          loading={false}
        />
      )}
    </div>
  );
};

export default Zadaci;