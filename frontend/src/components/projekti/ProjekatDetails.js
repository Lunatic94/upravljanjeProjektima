import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { zadatakService } from '../../services/zadatakService';
import { projekatService } from '../../services/projekatService';
import { api } from '../../services/api';
import { useParams } from 'react-router-dom';

const ProjekatDetails = ({ projekat, onClose, onEdit }) => {
  const { token, user } = useAuth();
  const [zadaci, setZadaci] = useState([]);
  const [clanovi, setClanovi] = useState([]);
  const [aktivnosti, setAktivnosti] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [dostupniKorisnici, setDostupniKorisnici] = useState([]);
  const [selectedKorisnik, setSelectedKorisnik] = useState('');
  const [selectedUloga, setSelectedUloga] = useState('PROGRAMER');
  const [addingMember, setAddingMember] = useState(false);

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
        
        // Aktivnosti dolaze u paginated formatu sa 'content' arrayom
        const aktivnostiArray = aktivnostiData?.content || aktivnostiData || [];
        setAktivnosti(aktivnostiArray);
        
        // Debug log za aktivnosti
        console.log('Aktivnosti raw data:', aktivnostiData);
        console.log('Aktivnosti content array:', aktivnostiArray);
        console.log('Aktivnosti length:', aktivnostiArray?.length);
      } catch (error) {
        console.error('Error loading project details:', error);
      }
      setLoading(false);
    };

    loadData();
  }, [projekat?.id, token]);

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

  const getRoleText = (uloga) => {
    const roleMap = {
      'MENADZER_PROJEKTA': 'Menadžer Projekta',
      'PROGRAMER': 'Programer',
      'TESTER': 'Tester',
      'DIZAJNER': 'Dizajner'
    };
    return roleMap[uloga] || uloga;
  };

  const getRoleColor = (uloga) => {
    const colors = {
      'MENADZER_PROJEKTA': '#2196f3',
      'PROGRAMER': '#4caf50',
      'TESTER': '#ff9800',
      'DIZAJNER': '#9c27b0'
    };
    return colors[uloga] || '#757575';
  };

  const getActivityTypeText = (tipAktivnosti) => {
    const activityTypeMap = {
      'KREIRAN': '➕ Kreiran',
      'AZURIRAN': '✏️ Ažuriran',
      'OBRISAN': '🗑️ Obrisan',
      'ZAVRSEN': '✅ Završen',
      'DODELJEN': '👤 Dodeljen',
      'STATUS_PROMENJEN': '🔄 Status promenjen',
      'KOMENTAR_DODAT': '💬 Dodat komentar'
    };
    return activityTypeMap[tipAktivnosti] || tipAktivnosti;
  };

  const getActivityTypeColor = (tipAktivnosti) => {
    const colors = {
      'KREIRAN': '#4caf50',
      'AZURIRAN': '#2196f3',
      'OBRISAN': '#f44336',
      'ZAVRSEN': '#4caf50',
      'DODELJEN': '#ff9800',
      'STATUS_PROMENJEN': '#9c27b0',
      'KOMENTAR_DODAT': '#607d8b'
    };
    return colors[tipAktivnosti] || '#757575';
  };

  const getEntityTypeText = (tipEntiteta) => {
    const entityTypeMap = {
      'PROJEKAT': '📁 Projekat',
      'ZADATAK': '📋 Zadatak',
      'KORISNIK': '👤 Korisnik',
      'KOMENTAR': '💬 Komentar'
    };
    return entityTypeMap[tipEntiteta] || tipEntiteta;
  };

  const formatActivityDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return 'Juče';
    } else if (diffDays <= 7) {
      return `Pre ${diffDays} dana`;
    } else if (diffDays <= 30) {
      const weeks = Math.floor(diffDays / 7);
      return `Pre ${weeks} nedelja`;
    } else {
      return date.toLocaleDateString('sr-RS');
    }
  };

  const canManageMembers = user?.uloga === 'ROLE_ADMIN' || 
                          user?.uloga === 'ROLE_MENADZER_PROJEKTA' || 
                          user?.uloga === 'ADMIN' || 
                          user?.uloga === 'MENADZER_PROJEKTA';

  // Filtriramo korisnike koji već nisu članovi projekta
  const dostupniZaDodavanje = dostupniKorisnici;
  //.filter(korisnik => 
    //!clanovi.some(clan => clan.korisnik?.id === korisnik.id)
  //);

  const handleAddMember = async () => {
    if (!selectedKorisnik) {
      alert('Molimo izaberite korisnika');
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
      
      // Refresh dostupni korisnici
      //setDostupniKorisnici(prev => prev.filter(k => k.id !== parseInt(selectedKorisnik)));
      
    } catch (error) {
      console.error('Error adding member:', error);
      alert('Greška pri dodavanju člana: ' + (error.message || 'Nepoznata greška'));
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
      const removedMember = clanovi.find(c => c.id === clanId);
      setClanovi(clanovi.filter(c => c.id !== clanId));
      
      // Dodaj korisnika nazad u dostupne
      if (removedMember?.korisnik) {
       // setDostupniKorisnici(prev => [...prev, removedMember.korisnik]);
      }
      
    } catch (error) {
      console.error('Error removing member:', error);
      alert('Greška pri uklanjanju člana: ' + (error.message || 'Nepoznata greška'));
    }
  };

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
        <h3 style={{ marginBottom: '20px', color: '#1976d2' }}>👥 Dodaj člana na projekat</h3>
        
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            Korisnik:
          </label>
          <select
            value={selectedKorisnik}
            onChange={(e) => setSelectedKorisnik(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #ccc',
              borderRadius: '6px',
              fontSize: '14px'
            }}
          >
            <option value="">Izaberite korisnika</option>
            {dostupniZaDodavanje.map(korisnik => (
              <option key={korisnik.id} value={korisnik.id}>
                {korisnik.ime} {korisnik.prezime} (@{korisnik.korisnickoIme})
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: '25px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            Uloga na projektu:
          </label>
          <select
            value={selectedUloga}
            onChange={(e) => setSelectedUloga(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #ccc',
              borderRadius: '6px',
              fontSize: '14px'
            }}
          >
            <option value="PROGRAMER">Programer</option>
            <option value="TESTER">Tester</option>
            <option value="DIZAJNER">Dizajner</option>
            <option value="MENADZER_PROJEKTA">Menadžer Projekta</option>
          </select>
        </div>

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button
            onClick={() => setShowAddMemberModal(false)}
            disabled={addingMember}
            style={{
              background: '#ccc',
              color: 'white',
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
                      <h5 style={{ margin: '0 0 8px 0', color: '#333' }}>👤 Menadžer</h5>
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

                  {/* Statistike */}
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
                    <div style={{ display: 'grid', gap: '15px' }}>
                      {zadaci.map((zadatak) => (
                        <div key={zadatak.id} style={{
                          border: '1px solid #e0e0e0',
                          borderRadius: '8px',
                          padding: '15px',
                          background: '#f8f9fa'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                            <h5 style={{ margin: '0 0 5px 0', color: '#333' }}>
                              {zadatak.naslov}
                            </h5>
                            <span style={{
                              background: getStatusColor(zadatak.status, 'task'),
                              color: 'white',
                              padding: '3px 8px',
                              borderRadius: '12px',
                              fontSize: '11px',
                              fontWeight: 'bold'
                            }}>
                              {getStatusText(zadatak.status, 'task')}
                            </span>
                          </div>
                          {zadatak.opis && (
                            <p style={{ margin: '0 0 10px 0', color: '#666', fontSize: '14px' }}>
                              {zadatak.opis}
                            </p>
                          )}
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#666' }}>
                            <span>
                              {zadatak.dodeljen ? `👤 ${zadatak.dodeljen.ime} ${zadatak.dodeljen.prezime}` : '👤 Nedodeljen'}
                            </span>
                            {zadatak.rokZavrsetka && (
                              <span>📅 {new Date(zadatak.rokZavrsetka).toLocaleDateString('sr-RS')}</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                      <div style={{ fontSize: '48px', marginBottom: '15px' }}>📋</div>
                      <p>Nema zadataka na ovom projektu.</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'team' && (
                <div>
                  {/* Add Member Button */}
                  {canManageMembers && (
                    <div style={{ marginBottom: '20px', textAlign: 'right' }}>
                      <button
                        onClick={() => setShowAddMemberModal(true)}
                        style={{
                          background: '#1976d2',
                          color: 'white',
                          border: 'none',
                          padding: '10px 20px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '14px'
                        }}
                      >
                        + Dodaj člana
                      </button>
                    </div>
                  )}

                  {clanovi.length > 0 ? (
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                      gap: '15px'
                    }}>
                      {clanovi.map((clan) => (
                        <div key={clan.id} style={{
                          border: '1px solid #e0e0e0',
                          borderRadius: '8px',
                          padding: '15px',
                          background: '#f8f9fa',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div style={{
                              width: '40px',
                              height: '40px',
                              borderRadius: '50%',
                              background: getRoleColor(clan.uloga),
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
                            <div>
                              <h6 style={{ margin: '0 0 4px 0', color: '#333' }}>
                                {clan.korisnik?.ime} {clan.korisnik?.prezime}
                              </h6>
                              <p style={{ margin: '0 0 2px 0', fontSize: '12px', color: '#666' }}>
                                {getRoleText(clan.uloga)}
                              </p>
                              <p style={{ margin: 0, fontSize: '11px', color: '#999' }}>
                                Od {new Date(clan.datumPridruljivanja).toLocaleDateString('sr-RS')}
                              </p>
                            </div>
                          </div>
                          {canManageMembers && (
                            <button
                              onClick={() => handleRemoveMember(clan.id)}
                              style={{
                                background: '#f44336',
                                color: 'white',
                                border: 'none',
                                padding: '6px 10px',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '12px'
                              }}
                            >
                              Ukloni
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                      <div style={{ fontSize: '48px', marginBottom: '15px' }}>👥</div>
                      <p>Nema članova na ovom projektu.</p>
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
                            fontSize: '14px',
                            marginTop: '15px'
                          }}
                        >
                          + Dodaj prvog člana
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'activity' && (
                <div>
                  {aktivnosti.length > 0 ? (
                    <div style={{ display: 'grid', gap: '12px' }}>
                      {aktivnosti
                        .sort((a, b) => new Date(b.datumKreiranja) - new Date(a.datumKreiranja))
                        .map((aktivnost, index) => (
                        <div key={aktivnost.id || index} style={{
                          border: '1px solid #e0e0e0',
                          borderRadius: '8px',
                          padding: '15px',
                          background: '#f8f9fa',
                          borderLeft: `4px solid ${getActivityTypeColor(aktivnost.tipAktivnosti)}`
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{
                                background: getActivityTypeColor(aktivnost.tipAktivnosti),
                                color: 'white',
                                padding: '3px 8px',
                                borderRadius: '12px',
                                fontSize: '11px',
                                fontWeight: 'bold'
                              }}>
                                {getActivityTypeText(aktivnost.tipAktivnosti)}
                              </span>
                              <span style={{
                                background: '#607d8b',
                                color: 'white',
                                padding: '3px 8px',
                                borderRadius: '12px',
                                fontSize: '11px',
                                fontWeight: 'bold'
                              }}>
                                {getEntityTypeText(aktivnost.tipEntiteta)}
                              </span>
                            </div>
                            <span style={{ fontSize: '12px', color: '#999' }}>
                              {formatActivityDate(aktivnost.datumKreiranja)}
                            </span>
                          </div>
                          
                          <p style={{ 
                            margin: '0 0 8px 0', 
                            color: '#333', 
                            fontSize: '14px',
                            lineHeight: '1.4'
                          }}>
                            {aktivnost.opis}
                          </p>
                          
                          {aktivnost.korisnik && (
                            <div style={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              fontSize: '12px', 
                              color: '#666',
                              marginTop: '8px'
                            }}>
                              <div style={{
                                width: '20px',
                                height: '20px',
                                borderRadius: '50%',
                                background: '#1976d2',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontSize: '10px',
                                fontWeight: 'bold',
                                marginRight: '6px'
                              }}>
                                {aktivnost.korisnik.ime?.charAt(0)}{aktivnost.korisnik.prezime?.charAt(0)}
                              </div>
                              <span>
                                {aktivnost.korisnik.ime} {aktivnost.korisnik.prezime}
                              </span>
                              <span style={{ margin: '0 8px', color: '#ddd' }}>•</span>
                              <span>
                                {new Date(aktivnost.datumKreiranja).toLocaleString('sr-RS')}
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                      <div style={{ fontSize: '48px', marginBottom: '15px' }}>📈</div>
                      <p>Nema aktivnosti na ovom projektu.</p>
                      <p style={{ fontSize: '14px', marginTop: '10px' }}>
                        Aktivnosti će se prikazivati kada se dese promene na projektu.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Add Member Modal */}
      {showAddMemberModal && <AddMemberModal />}
    </div>
  );
};

export default ProjekatDetails;