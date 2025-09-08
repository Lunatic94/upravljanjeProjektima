import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { zadatakService } from '../../services/zadatakService';
import { projekatService } from '../../services/projekatService';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';

const ProjekatDetails = ({ projekat, onClose, onEdit }) => {
  const { showToast } = useToast();
  const { token, user } = useAuth();
  const [zadaci, setZadaci] = useState([]);
  const [clanovi, setClanovi] = useState([]);
  const [aktivnosti, setAktivnosti] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showRoleManagementModal, setShowRoleManagementModal] = useState(false);
  const [selectedMemberForRoles, setSelectedMemberForRoles] = useState(null);
  const [dostupniKorisnici, setDostupniKorisnici] = useState([]);
  const [selectedKorisnik, setSelectedKorisnik] = useState('');
  const [selectedUloga, setSelectedUloga] = useState('PROGRAMER');
  const [addingMember, setAddingMember] = useState(false);
  const [availableRoles] = useState(['PROGRAMER', 'TESTER', 'DIZAJNER', 'MENADZER_PROJEKTA']);


  useEffect(() => {
    const loadData = async () => {
      if (!projekat?.id || !token) return;
      
      try {
        const [zadaciData, clanoviData, korisniciData, aktivnostiData] = await Promise.all([
          zadatakService.getZadaciProjekta(token, projekat.id),
          projekatService.getClanoveProjekta(token, projekat.id),
          api.getSviKorisnici(token),
          projekatService.getAktivnosti(token, projekat.id)
        ]);
        
        setZadaci(zadaciData || []);
        setClanovi(clanoviData || []);
        setDostupniKorisnici(korisniciData || []);
        
        const aktivnostiArray = aktivnostiData?.content || aktivnostiData || [];
        setAktivnosti(aktivnostiArray);
      } catch (error) {
        console.error('Error loading project details:', error);
      }
      setLoading(false);
    };

    loadData();
  }, [projekat?.id, token]);

  // Helper funkcije za uloge
  const getRoleIcon = (uloga) => {
    const icons = {
      'MENADZER_PROJEKTA': '👔',
      'PROGRAMER': '👨‍💻', 
      'TESTER': '🧪',
      'DIZAJNER': '🎨'
    };
    return icons[uloga] || '👤';
  };

  const getRoleText = (uloga) => {
    const roleMap = {
      'MENADZER_PROJEKTA': 'Menadžer Projekta',
      'PROGRAMER': 'Programer',
      'TESTER': 'Tester',
      'DIZAJNER': 'Dizajner'
    };
    return roleMap[uloga] || uloga?.replace('_', ' ');
  };

  const getRoleColor = (uloga) => {
    const colors = {
      'MENADZER_PROJEKTA': '#1976d2',
      'PROGRAMER': '#4caf50',
      'TESTER': '#ff9800',
      'DIZAJNER': '#9c27b0'
    };
    return colors[uloga] || '#757575';
  };

  const getStatusColor = (status, type = 'project') => {
    if (type === 'project') {
      const colors = {
        'U_TOKU': '#2196f3',
        'ZAVRSEN': '#4caf50',
        'PLANIRANJE': '#ff9800',
        'OTKAZAN': '#f44336'
      };
      return colors[status] || '#757575';
    } else {
      const colors = {
        'TREBA_URADITI': '#9c27b0',
        'U_TOKU': '#2196f3',
        'NA_PREGLEDU': '#ff5722',
        'ZAVRSENO': '#4caf50'
      };
      return colors[status] || '#757575';
    }
  };

  const getStatusText = (status, type = 'project') => {
    if (type === 'project') {
      const statusMap = {
        'U_TOKU': 'U toku',
        'ZAVRSEN': 'Završen',
        'PLANIRANJE': 'Planiranje',
        'OTKAZAN': 'Otkazan'
      };
      return statusMap[status] || status;
    } else {
      const statusMap = {
        'TREBA_URADITI': 'Treba uraditi',
        'U_TOKU': 'U toku',
        'NA_PREGLEDU': 'Na pregledu',
        'ZAVRSENO': 'Završeno'
      };
      return statusMap[status] || status;
    }
  };

  const formatDate = (date) => {
    const now = new Date();
    const targetDate = new Date(date);
    const diffInDays = Math.floor((now - targetDate) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      return 'Danas';
    } else if (diffInDays === 1) {
      return 'Juče';
    } else if (diffInDays < 7) {
      return `Pre ${diffInDays} dana`;
    } else if (diffInDays <= 30) {
      const weeks = Math.floor(diffInDays / 7);
      return `Pre ${weeks} nedelja`;
    } else {
      return date.toLocaleDateString('sr-RS');
    }
  };

  const canManageMembers = user?.uloga === 'ROLE_ADMIN' || 
                          user?.uloga === 'ROLE_MENADZER_PROJEKTA' || 
                          user?.uloga === 'ADMIN' || 
                          user?.uloga === 'MENADZER_PROJEKTA';

  //const dostupniZaDodavanje = dostupniKorisnici;
    const dostupniZaDodavanje = dostupniKorisnici.filter(korisnik => 
    !clanovi.some(clan => clan.korisnik?.id === korisnik.id)
  );

  // Komponenta za prikaz uloga korisnika
  const UlogeDisplay = ({ uloge }) => {
    if (!uloge || uloge.length === 0) return <span style={{ color: '#999' }}>Nema uloge</span>;
    
    const ulogeArray = Array.isArray(uloge) ? uloge : Array.from(uloge);
    
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
        {ulogeArray.map((uloga, index) => (
          <span
            key={index}
            style={{
              background: getRoleColor(uloga),
              color: 'white',
              padding: '2px 8px',
              borderRadius: '12px',
              fontSize: '10px',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: '2px'
            }}
          >
            {getRoleIcon(uloga)} {getRoleText(uloga)}
          </span>
        ))}
      </div>
    );
  };

  // Handler funkcije
  const handleAddMember = async () => {
    if (!selectedKorisnik) {
      showToast('Molimo izaberite korisnika', 'warning');
      return;
    }

    setAddingMember(true);
    try {
      const newMember = await projekatService.dodajClana(token, projekat.id, {
        korisnikId: parseInt(selectedKorisnik),
        uloga: selectedUloga
      });
      
      setClanovi([...clanovi, newMember]);
      setSelectedKorisnik('');
      setSelectedUloga('PROGRAMER');
      setShowAddMemberModal(false);

      showToast('Član je uspešno dodat na projekat!', 'success');
      
    } catch (error) {
      console.error('Error adding member:', error);
      //alert('Greška pri dodavanju člana: ' + (error.message || 'Nepoznata greška'));
      //showToast('Greška pri dodavanju člana: ' + (error.message || 'Nepoznata greška'), 'error');
    } finally {
      setAddingMember(false);
    }
  };

  const handleRemoveMember = async (clanId) => {
    if (!window.confirm('Da li ste sigurni da želite da uklonite ovog člana sa projekta?')) {
      return;
    }

    try {
      await projekatService.ukloniClana(token, projekat.id, clanId);
      setClanovi(clanovi.filter(c => c.id !== clanId));
     // showToast(`Uloga ${getRoleText(ulogaZaUklanjanje)} je uklonjena`, 'success');
    } catch (error) {
      console.error('Error removing member:', error);
     // alert('Greška pri uklanjanju člana: ' + (error.message || 'Nepoznata greška'));
      showToast(`Greška pri uklanjanju uloge: ${error.message}`, 'error');
    }
  };

  const handleManageRoles = (clan) => {
    setSelectedMemberForRoles(clan);
    setShowRoleManagementModal(true);
  };

const handleAddRoleToMember = async (clan, novaUloga) => {
  try {
      // ISPRAVKA: Koristimo ispravan endpoint
      const response = await fetch(`http://localhost:8080/api/projekti/${projekat.id}/clanovi/upravljaj-ulogama`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          korisnikId: clan.korisnik.id,
          uloga: novaUloga,
          akcija: 'DODAJ'
        })
      });

      if (response.ok) {
        const updatedClan = await response.json();
        setClanovi(clanovi.map(c => c.id === clan.id ? updatedClan : c));
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Greška pri dodavanju uloge');
      }
    } catch (error) {
      console.error('Error adding role:', error);
      //alert('Greška pri dodavanju uloge: ' + error.message);
      showToast('Greška pri dodavanju uloge: ${error.message}', 'error');
    }
  };

const handleRemoveRoleFromMember = async (clan, ulogaZaUklanjanje) => {
    try {
      // ISPRAVKA: Koristimo ispravan endpoint
      const response = await fetch(`http://localhost:8080/api/projekti/${projekat.id}/clanovi/upravljaj-ulogama`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          korisnikId: clan.korisnik.id,
          uloga: ulogaZaUklanjanje,
          akcija: 'UKLONI'
        })
      });

      if (response.ok) {
        // Refresh svih članova da dobijemo najnovije podatke
        const updatedClanovi = await projekatService.getClanoveProjekta(token, projekat.id);
        setClanovi(updatedClanovi);
        showToast(`Uloga ${getRoleText(ulogaZaUklanjanje)} je uklonjena`, 'success');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Greška pri uklanjanju uloge');
      }
    } catch (error) {
      console.error('Error removing role:', error);
      //alert('Greška pri uklanjanju uloge: ' + error.message);
      showToast('Greška pri uklanjanju uloge: ${error.message}', 'error');
      
    }
  };

  // Modal za upravljanje ulogama
  const RoleManagementModal = () => {
    const [selectedRole, setSelectedRole] = useState('PROGRAMER');
    const [loading, setLoading] = useState(false);

    if (!selectedMemberForRoles) return null;

    const memberRoles = Array.from(selectedMemberForRoles.uloge || []);
    const availableToAdd = availableRoles.filter(role => !memberRoles.includes(role));

    const handleAddRole = async () => {
      if (!selectedRole) return;
      
      setLoading(true);
      try {
        await handleAddRoleToMember(selectedMemberForRoles, selectedRole);
        setShowRoleManagementModal(false);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    const handleRemoveRole = async (role) => {
      if (memberRoles.length <= 1) {
        //alert('Korisnik mora imati barem jednu ulogu na projektu!');
        showToast('Korisnik mora imati barem jednu ulogu na projektu!', 'warning');
        return;
      }

      if (!window.confirm(`Da li ste sigurni da želite da uklonite ulogu ${getRoleText(role)}?`)) {
        return;
      }

      setLoading(true);
      try {
        await handleRemoveRoleFromMember(selectedMemberForRoles, role);
        setShowRoleManagementModal(false);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
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
        zIndex: 2000
      }}>
        <div style={{
          background: 'white',
          padding: '30px',
          borderRadius: '12px',
          maxWidth: '500px',
          width: '90%',
          maxHeight: '80vh',
          overflow: 'auto',
          boxShadow: '0 10px 25px rgba(0,0,0,0.3)'
        }}>
          <h3 style={{ margin: '0 0 20px 0', color: '#333' }}>
            Upravljanje ulogama - {selectedMemberForRoles.korisnik?.ime} {selectedMemberForRoles.korisnik?.prezime}
          </h3>

          <div style={{ marginBottom: '25px' }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#666', fontSize: '14px' }}>
              Trenutne uloge:
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {memberRoles.map((role) => (
                <div key={role} style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: getRoleColor(role),
                  color: 'white',
                  padding: '6px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}>
                  <span style={{ marginRight: '6px' }}>
                    {getRoleIcon(role)} {getRoleText(role)}
                  </span>
                  {memberRoles.length > 1 && (
                    <button
                      onClick={() => handleRemoveRole(role)}
                      disabled={loading}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'white',
                        cursor: 'pointer',
                        padding: '0 2px',
                        marginLeft: '4px',
                        opacity: loading ? 0.5 : 1
                      }}
                      title="Ukloni ulogu"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {availableToAdd.length > 0 && (
            <div style={{ marginBottom: '25px' }}>
              <h4 style={{ margin: '0 0 10px 0', color: '#666', fontSize: '14px' }}>
                Dodaj novu ulogu:
              </h4>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '8px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                  disabled={loading}
                >
                  {availableToAdd.map(role => (
                    <option key={role} value={role}>
                      {getRoleIcon(role)} {getRoleText(role)}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleAddRole}
                  disabled={loading || !selectedRole}
                  style={{
                    background: loading ? '#ccc' : '#4caf50',
                    color: 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '4px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    fontSize: '12px'
                  }}
                >
                  {loading ? 'Dodavanje...' : 'Dodaj'}
                </button>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button
              onClick={() => setShowRoleManagementModal(false)}
              disabled={loading}
              style={{
                background: '#f5f5f5',
                color: '#333',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '6px',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              Zatvori
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Modal za dodavanje člana
  const AddMemberModal = () => (
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
      zIndex: 2000
    }}>
      <div style={{
        background: 'white',
        padding: '30px',
        borderRadius: '12px',
        maxWidth: '500px',
        width: '90%',
        boxShadow: '0 10px 25px rgba(0,0,0,0.3)'
      }}>
        <h3 style={{ margin: '0 0 20px 0', color: '#333' }}>Dodaj novog člana</h3>
        
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>
            Korisnik:
          </label>
          <select
            value={selectedKorisnik}
            onChange={(e) => setSelectedKorisnik(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '14px'
            }}
            disabled={addingMember}
          >
            <option value="">Izaberite korisnika...</option>
            {dostupniZaDodavanje.map(korisnik => (
              <option key={korisnik.id} value={korisnik.id}>
                {korisnik.ime} {korisnik.prezime} ({korisnik.email})
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>
            Početna uloga:
          </label>
          <select
            value={selectedUloga}
            onChange={(e) => setSelectedUloga(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '14px'
            }}
            disabled={addingMember}
          >
            <option value="PROGRAMER">{getRoleIcon('PROGRAMER')} Programer</option>
            <option value="TESTER">{getRoleIcon('TESTER')} Tester</option>
            <option value="DIZAJNER">{getRoleIcon('DIZAJNER')} Dizajner</option>
            <option value="MENADZER_PROJEKTA">{getRoleIcon('MENADZER_PROJEKTA')} Menadžer Projekta</option>
          </select>
          <p style={{ fontSize: '12px', color: '#666', margin: '5px 0 0 0' }}>
            💡 Možete dodati dodatne uloge nakon dodavanja člana
          </p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button
            onClick={() => setShowAddMemberModal(false)}
            disabled={addingMember}
            style={{
              background: '#f5f5f5',
              color: '#333',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '6px',
              cursor: addingMember ? 'not-allowed' : 'pointer'
            }}
          >
            Otkaži
          </button>
          <button
            onClick={handleAddMember}
            disabled={!selectedKorisnik || addingMember}
            style={{
              background: !selectedKorisnik || addingMember ? '#ccc' : '#1976d2',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '6px',
              cursor: !selectedKorisnik || addingMember ? 'not-allowed' : 'pointer'
            }}
          >
            {addingMember ? 'Dodavanje...' : 'Dodaj člana'}
          </button>
        </div>
      </div>
    </div>
  );

  if (!projekat) return null;

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
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '12px',
        width: '90%',
        maxWidth: '900px',
        maxHeight: '90vh',
        overflow: 'hidden',
        boxShadow: '0 10px 25px rgba(0,0,0,0.3)'
      }}>
        {/* Header */}
        <div style={{
          padding: '25px 30px',
          borderBottom: '1px solid #eee',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h2 style={{ margin: '0 0 8px 0', color: '#1976d2', fontSize: '24px' }}>
              {projekat.naziv}
            </h2>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span style={{
                background: getStatusColor(projekat.status),
                color: 'white',
                padding: '4px 12px',
                borderRadius: '16px',
                fontSize: '12px',
                fontWeight: 'bold'
              }}>
                {getStatusText(projekat.status)}
              </span>
              {projekat.prioritet && (
                <span style={{
                  background: getStatusColor(projekat.prioritet, 'priority'),
                  color: 'white',
                  padding: '4px 12px',
                  borderRadius: '16px',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}>
                  {projekat.prioritet}
                </span>
              )}
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '10px' }}>
            {onEdit && user?.uloga !== 'PROGRAMER' && user?.uloga !== 'ROLE_PROGRAMER' && (
              <button
                onClick={() => onEdit(projekat)}
                style={{
                  background: '#1976d2',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                ✏️ Ažuriraj
              </button>
            )}
            <button
              onClick={onClose}
              style={{
                background: '#6c757d',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              ✕ Zatvori
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div style={{
          padding: '0 30px',
          borderBottom: '1px solid #eee',
          display: 'flex',
          gap: '20px'
        }}>
          {['overview', 'tasks', 'team', 'activity'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                background: 'none',
                border: 'none',
                padding: '15px 0',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                color: activeTab === tab ? '#1976d2' : '#666',
                borderBottom: activeTab === tab ? '2px solid #1976d2' : '2px solid transparent',
                transition: 'all 0.3s'
              }}
            >
              {tab === 'overview' && '📊 Pregled'}
              {tab === 'tasks' && `📋 Zadaci (${zadaci.length})`}
              {tab === 'team' && `👥 Tim (${clanovi.length})`}
              {tab === 'activity' && `📈 Aktivnosti (${aktivnosti?.length || 0})`}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{
          padding: '25px 30px',
          maxHeight: 'calc(90vh - 200px)',
          overflowY: 'auto'
        }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '50px' }}>
              Učitavanje...
            </div>
          ) : (
            <>
              {activeTab === 'overview' && (
                <div>
                  <div style={{ marginBottom: '25px' }}>
                    <h4 style={{ color: '#333', marginBottom: '10px' }}>Opis projekta</h4>
                    <p style={{ color: '#666', lineHeight: '1.6' }}>
                      {projekat.opis || 'Nema opisa projekta.'}
                    </p>
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '20px',
                    marginBottom: '25px'
                  }}>
                    <div>
                      <h5 style={{ margin: '0 0 8px 0', color: '#333' }}>📅 Datum početka</h5>
                      <p style={{ margin: 0, color: '#666' }}>
                        {projekat.datumPocetka ? new Date(projekat.datumPocetka).toLocaleDateString('sr-RS') : 'Nije definisan'}
                      </p>
                    </div>
                    <div>
                      <h5 style={{ margin: '0 0 8px 0', color: '#333' }}>🏁 Datum završetka</h5>
                      <p style={{ margin: 0, color: '#666' }}>
                        {projekat.datumZavrsetka ? new Date(projekat.datumZavrsetka).toLocaleDateString('sr-RS') : 'Nije definisan'}
                      </p>
                    </div>
                    <div>
                      <h5 style={{ margin: '0 0 8px 0', color: '#333' }}>👔 Menadžer</h5>
                      <p style={{ margin: 0, color: '#666' }}>
                        {projekat.menadzer ? `${projekat.menadzer.ime} ${projekat.menadzer.prezime}` : 'Nije dodeljen'}
                      </p>
                    </div>
                    <div>
                      <h5 style={{ margin: '0 0 8px 0', color: '#333' }}>👨‍💻 Kreator</h5>
                      <p style={{ margin: 0, color: '#666' }}>
                        {projekat.kreiraoPKorisnik ? `${projekat.kreiraoPKorisnik.ime} ${projekat.kreiraoPKorisnik.prezime}` : 'Nepoznato'}
                      </p>
                    </div>
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                    gap: '15px'
                  }}>
                    <div style={{
                      background: 'linear-gradient(135deg, #2196f3, #64b5f6)',
                      color: 'white',
                      padding: '20px',
                      borderRadius: '8px',
                      textAlign: 'center'
                    }}>
                      <h3 style={{ margin: '0 0 5px 0', fontSize: '24px' }}>{zadaci.length}</h3>
                      <p style={{ margin: 0, opacity: 0.9, fontSize: '14px' }}>Ukupno zadataka</p>
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
                      <p style={{ margin: 0, opacity: 0.9, fontSize: '14px' }}>Završenih</p>
                    </div>
                    <div style={{
                      background: 'linear-gradient(135deg, #ff9800, #ffb74d)',
                      color: 'white',
                      padding: '20px',
                      borderRadius: '8px',
                      textAlign: 'center'
                    }}>
                      <h3 style={{ margin: '0 0 5px 0', fontSize: '24px' }}>{clanovi.length}</h3>
                      <p style={{ margin: 0, opacity: 0.9, fontSize: '14px' }}>Članova tima</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'tasks' && (
                <div>
                  {zadaci.length > 0 ? (
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                      gap: '15px'
                    }}>
                      {zadaci.map((zadatak) => (
                        <div key={zadatak.id} style={{
                          border: '1px solid #e0e0e0',
                          borderRadius: '8px',
                          padding: '15px',
                          background: '#f8f9fa'
                        }}>
                          <h6 style={{ margin: '0 0 8px 0', color: '#333' }}>{zadatak.naslov}</h6>
                          <p style={{ margin: '0 0 10px 0', fontSize: '12px', color: '#666', lineHeight: '1.4' }}>
                            {zadatak.opis?.substring(0, 100)}{zadatak.opis?.length > 100 ? '...' : ''}
                          </p>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{
                              background: getStatusColor(zadatak.status, 'task'),
                              color: 'white',
                              padding: '4px 8px',
                              borderRadius: '12px',
                              fontSize: '10px',
                              fontWeight: 'bold'
                            }}>
                              {getStatusText(zadatak.status, 'task')}
                            </span>
                            {zadatak.dodeljen && (
                              <span style={{ fontSize: '11px', color: '#666' }}>
                                {zadatak.dodeljen.ime} {zadatak.dodeljen.prezime}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                      <p>Nema zadataka na projektu</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'team' && (
                <div>
                  {clanovi.length > 0 ? (
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                      gap: '15px'
                    }}>
                      {clanovi.map((clan) => (
                        <div key={clan.id} style={{
                          border: '1px solid #e0e0e0',
                          borderRadius: '12px',
                          padding: '18px',
                          background: '#f8f9fa',
                          transition: 'all 0.3s ease',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}>
                          <div style={{ 
                            display: 'flex', 
                            alignItems: 'flex-start', 
                            justifyContent: 'space-between',
                            marginBottom: '12px'
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                              <div style={{
                                width: '45px',
                                height: '45px',
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #1976d2, #42a5f5)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontSize: '16px',
                                fontWeight: 'bold',
                                marginRight: '12px'
                              }}>
                                {clan.korisnik?.ime?.charAt(0)}{clan.korisnik?.prezime?.charAt(0)}
                              </div>
                              <div style={{ flex: 1 }}>
                                <h6 style={{ margin: '0 0 4px 0', color: '#333', fontSize: '15px' }}>
                                  {clan.korisnik?.ime} {clan.korisnik?.prezime}
                                </h6>
                                <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#666' }}>
                                  {clan.korisnik?.email}
                                </p>
                                <p style={{ margin: 0, fontSize: '11px', color: '#999' }}>
                                  Član od {new Date(clan.datumPridruzivanja).toLocaleDateString('sr-RS')}
                                </p>
                              </div>
                            </div>
                            
                            {canManageMembers && (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <button
                                  onClick={() => handleRemoveMember(clan.id)}
                                  style={{
                                    background: '#f44336',
                                    color: 'white',
                                    border: 'none',
                                    padding: '4px 8px',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontSize: '11px'
                                  }}
                                  title="Ukloni člana"
                                >
                                  ✕
                                </button>
                                <button
                                  onClick={() => handleManageRoles(clan)}
                                  style={{
                                    background: '#1976d2',
                                    color: 'white',
                                    border: 'none',
                                    padding: '4px 8px',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontSize: '11px'
                                  }}
                                  title="Upravljaj ulogama"
                                >
                                  ⚙️
                                </button>
                              </div>
                            )}
                          </div>

                          <div style={{
                            borderTop: '1px solid #e0e0e0',
                            paddingTop: '12px'
                          }}>
                            <div style={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'space-between',
                              marginBottom: '8px'
                            }}>
                              <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#666' }}>
                                Uloge na projektu:
                              </span>
                            </div>
                            <UlogeDisplay uloge={clan.uloge} />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                      <p>Nema članova na projektu</p>
                      {canManageMembers && (
                        <button
                          onClick={() => setShowAddMemberModal(true)}
                          style={{
                            background: '#1976d2',
                            color: 'white',
                            border: 'none',
                            padding: '10px 20px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            marginTop: '10px'
                          }}
                        >
                          Dodaj prvog člana
                        </button>
                      )}
                    </div>
                  )}
                  
                  {canManageMembers && clanovi.length > 0 && (
                    <div style={{ textAlign: 'center', marginTop: '20px' }}>
                      <button
                        onClick={() => setShowAddMemberModal(true)}
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
                        + Dodaj novog člana
                      </button>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'activity' && (
                <div>
                  {aktivnosti.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                      {aktivnosti.map((aktivnost, index) => (
                        <div key={index} style={{
                          border: '1px solid #e0e0e0',
                          borderRadius: '8px',
                          padding: '15px',
                          background: '#f8f9fa',
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '12px'
                        }}>
                          <div style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            background: '#1976d2',
                            marginTop: '8px',
                            flexShrink: 0
                          }} />
                          <div style={{ flex: 1 }}>
                            <p style={{ margin: '0 0 4px 0', color: '#333', fontSize: '14px' }}>
                              {aktivnost.opis}
                            </p>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ fontSize: '12px', color: '#666' }}>
                                {aktivnost.korisnik?.ime} {aktivnost.korisnik?.prezime}
                              </span>
                              <span style={{ fontSize: '11px', color: '#999' }}>
                                {aktivnost.datumKreiranja ? formatDate(new Date(aktivnost.datumKreiranja)) : 'Nepoznato'}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                      <p>Nema aktivnosti na projektu</p>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Modals */}
      {showAddMemberModal && <AddMemberModal />}
      {showRoleManagementModal && <RoleManagementModal />}
    </div>
  );
};

export default ProjekatDetails;