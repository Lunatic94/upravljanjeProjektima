import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { komentarService } from '../../services/komentarService';
import { useParams } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';

const ZadatakDetails = ({ zadatak, onClose, onEdit, onStatusChange }) => {
  const { showToast } = useToast();
  const { user, token } = useAuth();
  const [komentari, setKomentari] = useState([]);
  const [noviKomentar, setNoviKomentar] = useState('');
  const [loadingKomentari, setLoadingKomentari] = useState(false);
  const [submittingKomentar, setSubmittingKomentar] = useState(false);

  // Učitaj komentare kada se komponenta mount-uje ili kada se zadatak promeni
  useEffect(() => {
    const loadKomentari = async () => {
      if (!zadatak?.id || !token) return;
      
      setLoadingKomentari(true);
      try {
        const komentariData = await komentarService.getKomentareZadatka(token, zadatak.id);
        setKomentari(komentariData || []);
      } catch (error) {
        console.error('Error loading komentari:', error);
        setKomentari([]);
      } finally {
        setLoadingKomentari(false);
      }
    };

    loadKomentari();
  }, [zadatak?.id, token]);

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

  const isOverdue = zadatak?.rokZavrsetka && new Date(zadatak.rokZavrsetka) < new Date() && zadatak.status !== 'ZAVRSENO';
  const canEdit = user?.uloga === 'ROLE_ADMIN' || user?.uloga === 'ROLE_MENADZER_PROJEKTA' || zadatak?.dodeljen?.id === user?.id;

  const handleStatusChange = (newStatus) => {
    onStatusChange?.(zadatak.id, newStatus);
  };

  const handleAddComment = async () => {
    if (!noviKomentar.trim()) return;
    
    setSubmittingKomentar(true);
    
    try {
      const newComment = await komentarService.dodajKomentar(token, zadatak.id, noviKomentar.trim());
      showToast(`Komentar je uspešno dodat na zadatak`, 'success');
      setKomentari([...komentari, newComment]);
      setNoviKomentar('');
    } catch (error) {
      console.error('Error adding comment:', error);
      //alert('Greška pri dodavanju komentara: ' + (error.message || 'Nepoznata greška'));
      showToast(`Greška prilikom dodavanja komentara`, 'error');
    } finally {
      setSubmittingKomentar(false);
    }
  };

  const handleDeleteComment = async (komentarId) => {
    if (!window.confirm('Da li ste sigurni da želite da obrišete ovaj komentar?')) return;
    
    try {
      await komentarService.obrisiKomentar(token, zadatak.id, komentarId);
      setKomentari(komentari.filter(k => k.id !== komentarId));
      showToast(`Komentar je uspešno obrisan`, 'success');
    } catch (error) {
      console.error('Error deleting comment:', error);
      //alert('Greška pri brisanju komentara: ' + (error.message || 'Nepoznata greška'));
      showToast(`Greška prilikom dodavanja komentara`, 'error');
    }
  };

  if (!zadatak) return null;

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
        maxWidth: '800px',
        maxHeight: '90vh',
        overflow: 'hidden',
        boxShadow: '0 10px 25px rgba(0,0,0,0.3)'
      }}>
        {/* Header */}
        <div style={{
          padding: '25px 30px',
          borderBottom: '1px solid #eee',
          background: isOverdue ? '#ffebee' : 'white'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>
              <h2 style={{ margin: '0 0 10px 0', color: '#1976d2', fontSize: '24px' }}>
                {zadatak.naslov}
              </h2>
              <p style={{ margin: '0 0 15px 0', color: '#666', fontSize: '16px' }}>
                📁 {zadatak.nazivProjekta}
              </p>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                <span style={{
                  background: getStatusColor(zadatak.status),
                  color: 'white',
                  padding: '6px 12px',
                  borderRadius: '16px',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}>
                  {getStatusText(zadatak.status)}
                </span>
                <span style={{
                  background: getPriorityColor(zadatak.prioritet),
                  color: 'white',
                  padding: '6px 12px',
                  borderRadius: '16px',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}>
                  {zadatak.prioritet}
                </span>
                {isOverdue && (
                  <span style={{
                    background: '#f44336',
                    color: 'white',
                    padding: '6px 12px',
                    borderRadius: '16px',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>
                    ⚠️ KASNI
                  </span>
                )}
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '10px' }}>
              {canEdit && onEdit && (
                <button
                  onClick={() => onEdit(zadatak)}
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
        </div>

        {/* Content */}
        <div style={{
          padding: '25px 30px',
          maxHeight: 'calc(90vh - 250px)',
          overflowY: 'auto'
        }}>
          {/* Opis */}
          {zadatak.opis && (
            <div style={{ marginBottom: '25px' }}>
              <h4 style={{ color: '#333', marginBottom: '10px' }}>📝 Opis</h4>
              <p style={{ color: '#666', lineHeight: '1.6', background: '#f8f9fa', padding: '15px', borderRadius: '8px' }}>
                {zadatak.opis}
              </p>
            </div>
          )}

          {/* Informacije */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            marginBottom: '25px'
          }}>
            <div>
              <h5 style={{ margin: '0 0 8px 0', color: '#333', fontSize: '14px', fontWeight: 'bold' }}>👤 Dodeljen</h5>
              <p style={{ margin: 0, color: '#666' }}>
                {zadatak.dodeljen ? `${zadatak.dodeljen.ime} ${zadatak.dodeljen.prezime}` : 'Nije dodeljen'}
              </p>
            </div>
            
            <div>
              <h5 style={{ margin: '0 0 8px 0', color: '#333', fontSize: '14px', fontWeight: 'bold' }}>📅 Rok</h5>
              <p style={{ margin: 0, color: isOverdue ? '#f44336' : '#666' }}>
                {zadatak.rokZavrsetka ? new Date(zadatak.rokZavrsetka).toLocaleDateString('sr-RS') : 'Nije definisan'}
              </p>
            </div>
            
            <div>
              <h5 style={{ margin: '0 0 8px 0', color: '#333', fontSize: '14px', fontWeight: 'bold' }}>⏱️ Procenjeno</h5>
              <p style={{ margin: 0, color: '#666' }}>
                {zadatak.procenjeniSati ? `${zadatak.procenjeniSati}h` : 'Nije procenjeno'}
              </p>
            </div>

            <div>
              <h5 style={{ margin: '0 0 8px 0', color: '#333', fontSize: '14px', fontWeight: 'bold' }}>✅ Utrošeno</h5>
              <p style={{ margin: 0, color: '#666' }}>
                {zadatak.stvarniSati ? `${zadatak.stvarniSati}h` : 'Nije zabeleženo'}
              </p>
            </div>
          </div>

          {/* Status Change */}
          {canEdit && onStatusChange && zadatak.status !== 'ZAVRSENO' && (
            <div style={{ marginBottom: '25px' }}>
              <h4 style={{ color: '#333', marginBottom: '15px' }}>🔄 Promeni Status</h4>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {['TREBA_URADITI', 'U_TOKU', 'NA_PREGLEDU', 'ZAVRSENO'].map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(status)}
                    disabled={status === zadatak.status}
                    style={{
                      background: status === zadatak.status ? '#ccc' : getStatusColor(status),
                      color: 'white',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      cursor: status === zadatak.status ? 'not-allowed' : 'pointer',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}
                  >
                    {getStatusText(status)}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Komentari */}
          <div>
            <h4 style={{ color: '#333', marginBottom: '15px' }}>💬 Komentari ({komentari.length})</h4>
            
            {/* Dodaj komentar */}
            <div style={{ 
              background: '#f8f9fa', 
              padding: '15px', 
              borderRadius: '8px', 
              marginBottom: '20px' 
            }}>
              <textarea
                value={noviKomentar}
                onChange={(e) => setNoviKomentar(e.target.value)}
                placeholder="Dodaj komentar..."
                rows="3"
                disabled={submittingKomentar}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '14px',
                  resize: 'vertical',
                  marginBottom: '10px',
                  outline: 'none',
                  opacity: submittingKomentar ? 0.6 : 1
                }}
              />
              <button
                onClick={handleAddComment}
                disabled={!noviKomentar.trim() || submittingKomentar}
                style={{
                  background: !noviKomentar.trim() || submittingKomentar ? '#ccc' : '#1976d2',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  cursor: !noviKomentar.trim() || submittingKomentar ? 'not-allowed' : 'pointer',
                  fontSize: '14px'
                }}
              >
                {submittingKomentar ? 'Dodavanje...' : 'Dodaj komentar'}
              </button>
            </div>

            {/* Lista komentara */}
            {loadingKomentari ? (
              <div style={{
                textAlign: 'center',
                padding: '30px',
                color: '#666',
                fontSize: '14px'
              }}>
                Učitavanje komentara...
              </div>
            ) : komentari.length > 0 ? (
              <div style={{ display: 'grid', gap: '15px' }}>
                {komentari.map((komentar) => (
                  <div key={komentar.id} style={{
                    background: '#fff',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    padding: '15px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <strong style={{ color: '#333', fontSize: '14px' }}>
                          {komentar.korisnik?.ime} {komentar.korisnik?.prezime}
                        </strong>
                        <span style={{ color: '#999', fontSize: '12px', marginLeft: '10px' }}>
                          {new Date(komentar.datumKreiranja).toLocaleString('sr-RS')}
                        </span>
                        {komentar.datumAzuriranja && (
                          <span style={{ color: '#999', fontSize: '11px', marginLeft: '5px', fontStyle: 'italic' }}>
                            (izmenjeno)
                          </span>
                        )}
                      </div>
                      {komentar.korisnik?.id === user?.id && (
                        <button
                          onClick={() => handleDeleteComment(komentar.id)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#f44336',
                            cursor: 'pointer',
                            fontSize: '12px',
                            padding: '2px 4px'
                          }}
                          title="Obriši komentar"
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                    <p style={{ margin: 0, color: '#666', fontSize: '14px', lineHeight: '1.4' }}>
                      {komentar.sadrzaj}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{
                textAlign: 'center',
                padding: '30px',
                color: '#999',
                fontSize: '14px'
              }}>
                Nema komentara na ovom zadatku
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ZadatakDetails;