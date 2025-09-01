import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { useParams } from 'react-router-dom';

const Dashboard = () => {
  const { user, token } = useAuth();
  const [projekti, setProjekti] = useState([]);
  const [zadaci, setZadaci] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setError(null);
        const [projektiData, zadaciData] = await Promise.all([
          api.getProjekti(token).catch(err => {
            console.warn('Error loading projekti:', err);
            return [];
          }),
          api.getZadaci(token).catch(err => {
            console.warn('Error loading zadaci:', err);
            return [];
          })
        ]);
        
        // Ensure arrays are never null/undefined
        setProjekti(Array.isArray(projektiData) ? projektiData : []);
        setZadaci(Array.isArray(zadaciData) ? zadaciData : []);
      } catch (error) {
        console.error('Error loading data:', error);
        setError('Greška pri učitavanju podataka');
        // Set empty arrays as fallback
        setProjekti([]);
        setZadaci([]);
      }
      setLoading(false);
    };

    if (token) {
      loadData();
    }
  }, [token]);

  const getStatusColor = (status) => {
    const colors = {
      'U_TOKU': '#2196f3',
      'ZAVRSEN': '#4caf50',
      'PLANIRANJE': '#ff9800',
      'OTKAZAN': '#f44336',
      'TREBA_URADITI': '#9c27b0',
      'NA_PREGLEDU': '#ff5722',
      'ZAVRSENO': '#4caf50'
    };
    return colors[status] || '#757575';
  };

  const getStatusText = (status) => {
    const statusMap = {
      'U_TOKU': 'U toku',
      'ZAVRSEN': 'Završen',
      'PLANIRANJE': 'Planiranje',
      'OTKAZAN': 'Otkazan',
      'TREBA_URADITI': 'Treba uraditi',
      'NA_PREGLEDU': 'Na pregledu',
      'ZAVRSENO': 'Završeno'
    };
    return statusMap[status] || status;
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh',
        fontSize: '18px'
      }}>
        Učitavanje...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh',
        flexDirection: 'column'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '20px' }}>⚠️</div>
        <div style={{ color: '#f44336', fontSize: '18px', marginBottom: '10px' }}>{error}</div>
        <button 
          onClick={() => window.location.reload()} 
          style={{
            background: '#1976d2',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Pokušaj ponovo
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ color: '#1976d2', marginBottom: '10px' }}>
          Dobrodošli, {user?.korisnickoIme || 'korisnice'}! 👋
        </h1>
        <p style={{ color: '#666', fontSize: '16px' }}>
          Uloga: <strong>{user?.uloga?.replace('ROLE_', '').replace('_', ' ') || 'Nepoznato'}</strong>
        </p>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '20px',
        marginBottom: '30px'
      }}>
        {/* Statistike */}
        <div style={{ 
          background: 'linear-gradient(135deg, #1976d2, #42a5f5)', 
          color: 'white', 
          padding: '20px', 
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '24px' }}>{projekti.length}</h3>
          <p style={{ margin: 0, opacity: 0.9 }}>Aktivni Projekti</p>
        </div>
        
        <div style={{ 
          background: 'linear-gradient(135deg, #9c27b0, #ba68c8)', 
          color: 'white', 
          padding: '20px', 
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '24px' }}>{zadaci.length}</h3>
          <p style={{ margin: 0, opacity: 0.9 }}>Moji Zadaci</p>
        </div>

        <div style={{ 
          background: 'linear-gradient(135deg, #4caf50, #81c784)', 
          color: 'white', 
          padding: '20px', 
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '24px' }}>
            {zadaci.filter(z => z.status === 'ZAVRSENO').length}
          </h3>
          <p style={{ margin: 0, opacity: 0.9 }}>Završeni Zadaci</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
        {/* Nedavni Projekti */}
        <div>
          <h2 style={{ color: '#333', marginBottom: '20px' }}>📁 Nedavni Projekti</h2>
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {projekti.length > 0 ? (
              projekti.slice(0, 5).map((projekat) => (
                <div key={projekat.id} style={{
                  background: 'white',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  padding: '15px',
                  marginBottom: '10px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                  <h4 style={{ margin: '0 0 8px 0', color: '#1976d2' }}>
                    {projekat.naziv}
                  </h4>
                  <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px' }}>
                    {projekat.opis?.substring(0, 80)}{projekat.opis?.length > 80 ? '...' : ''}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{
                      background: getStatusColor(projekat.status),
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '12px'
                    }}>
                      {getStatusText(projekat.status)}
                    </span>
                    <span style={{ fontSize: '12px', color: '#999' }}>
                      {projekat.brojZadataka || 0} zadataka
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ 
                textAlign: 'center', 
                color: '#666', 
                fontStyle: 'italic',
                padding: '40px 20px',
                background: 'white',
                borderRadius: '8px',
                border: '1px solid #e0e0e0'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '15px' }}>📁</div>
                <p style={{ margin: 0 }}>Nemate aktivnih projekata</p>
              </div>
            )}
          </div>
        </div>

        {/* Nedavni Zadaci */}
        <div>
          <h2 style={{ color: '#333', marginBottom: '20px' }}>📋 Nedavni Zadaci</h2>
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {zadaci.length > 0 ? (
              zadaci.slice(0, 5).map((zadatak) => (
                <div key={zadatak.id} style={{
                  background: 'white',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  padding: '15px',
                  marginBottom: '10px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                  <h4 style={{ margin: '0 0 8px 0', color: '#9c27b0' }}>
                    {zadatak.naslov}
                  </h4>
                  <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px' }}>
                    {zadatak.nazivProjekta}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{
                      background: getStatusColor(zadatak.status),
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '12px'
                    }}>
                      {getStatusText(zadatak.status)}
                    </span>
                    {zadatak.rokZavrsetka && (
                      <span style={{ fontSize: '12px', color: '#999' }}>
                        {new Date(zadatak.rokZavrsetka).toLocaleDateString('sr-RS')}
                      </span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div style={{ 
                textAlign: 'center', 
                color: '#666', 
                fontStyle: 'italic',
                padding: '40px 20px',
                background: 'white',
                borderRadius: '8px',
                border: '1px solid #e0e0e0'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '15px' }}>📋</div>
                <p style={{ margin: 0 }}>Nemate dodeljenih zadataka</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;