import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { korisnikService } from '../services/korisnikService';
import { useToast } from '../context/ToastContext';

const Profile = () => {
  //const { user, token, setUser } = useAuth(); // Dodajemo setUser da ažuriramo korisnika
  const { showToast } = useToast();
  const { user, token, updateUser } = useAuth(); //novi
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    ime: '',
    prezime: '',
    email: ''
  });

  // Popuni formu kada se user učita
  useEffect(() => {
    if (user) {
      setFormData({
        ime: user.ime ,
        prezime: user.prezime || '',
        email: user.email || ''
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validacija
    if (!formData.ime.trim() || !formData.prezime.trim() || !formData.email.trim()) {
      alert('Molimo vas da popunite sva polja');
      return;
    }
    
    setLoading(true);
    
    try {
      // Pozivamo API za ažuriranje profila
      const updatedUser = await korisnikService.azurirajProfil(token, user.id, formData);
      
      // Ažuriramo user u AuthContext-u
      //const newUserData = { ...user, ...formData };
      //setUser(newUserData);
      //localStorage.setItem('user', JSON.stringify(newUserData)); novi
      updateUser(formData);
      
      setIsEditing(false);
      //alert('Profil je uspešno ažuriran!');
      showToast('Korisnik je uspešno ažuriran!', 'success');
    } catch (error) {
      console.error('Error updating profile:', error);
      //alert('Greška pri ažuriranju profila: ' + (error.message || 'Nepoznata greška'));
      //showToast('Greška pri ažuriranju profila:', 'success');
      showToast(`${error.message}`, 'error');
    }
    
    setLoading(false);
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

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ color: '#1976d2', marginBottom: '30px' }}>👤 Moj Profil</h1>

      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '30px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        marginBottom: '30px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '30px' }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: getRoleColor(user?.uloga),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '28px',
            fontWeight: 'bold',
            marginRight: '20px'
          }}>
            {user?.korisnickoIme?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 style={{ margin: '0 0 5px 0', color: '#333' }}>
              {user?.ime} {user?.prezime}
            </h2>
            <p style={{ margin: '0 0 5px 0', color: '#666', fontSize: '16px' }}>
              @{user?.korisnickoIme}
            </p>
            <span style={{
              background: getRoleColor(user?.uloga),
              color: 'white',
              padding: '4px 12px',
              borderRadius: '16px',
              fontSize: '12px',
              fontWeight: 'bold'
            }}>
              {getRoleText(user?.uloga)}
            </span>
          </div>
        </div>

        {!isEditing ? (
          <div>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
              gap: '20px',
              marginBottom: '30px'
            }}>
              <div>
                <label style={{ display: 'block', fontWeight: 'bold', color: '#333', marginBottom: '5px' }}>
                  Ime:
                </label>
                <p style={{ margin: 0, color: '#666', fontSize: '16px' }}>{user?.ime}</p>
              </div>
              
              <div>
                <label style={{ display: 'block', fontWeight: 'bold', color: '#333', marginBottom: '5px' }}>
                  Prezime:
                </label>
                <p style={{ margin: 0, color: '#666', fontSize: '16px' }}>{user?.prezime}</p>
              </div>
              
              <div>
                <label style={{ display: 'block', fontWeight: 'bold', color: '#333', marginBottom: '5px' }}>
                  Email:
                </label>
                <p style={{ margin: 0, color: '#666', fontSize: '16px' }}>{user?.email}</p>
              </div>
              
              <div>
                <label style={{ display: 'block', fontWeight: 'bold', color: '#333', marginBottom: '5px' }}>
                  Korisničko ime:
                </label>
                <p style={{ margin: 0, color: '#666', fontSize: '16px' }}>{user?.korisnickoIme}</p>
              </div>
            </div>

            <button
              onClick={() => setIsEditing(true)}
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
              ✏️ Azuriraj profil
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
              gap: '20px',
              marginBottom: '30px'
            }}>
              <div>
                <label style={{ display: 'block', fontWeight: 'bold', color: '#333', marginBottom: '5px' }}>
                  Ime:
                </label>
                <input
                  type="text"
                  value={formData.ime}
                  onChange={(e) => setFormData({...formData, ime: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', fontWeight: 'bold', color: '#333', marginBottom: '5px' }}>
                  Prezime:
                </label>
                <input
                  type="text"
                  value={formData.prezime}
                  onChange={(e) => setFormData({...formData, prezime: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', fontWeight: 'bold', color: '#333', marginBottom: '5px' }}>
                  Email:
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 'bold', color: '#333', marginBottom: '5px' }}>
                  Korisničko ime:
                </label>
                <input
                  type="text"
                  value={user?.korisnickoIme}
                  disabled
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    fontSize: '14px',
                    backgroundColor: '#f5f5f5',
                    cursor: 'not-allowed'
                  }}
                />
                <small style={{ color: '#666', fontSize: '12px' }}>
                  Korisničko ime se ne može menjati
                </small>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="submit"
                disabled={loading}
                style={{
                  background: loading ? '#ccc' : '#4caf50',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '6px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontSize: '14px'
                }}
              >
                {loading ? 'Čuvanje...' : '💾 Sačuvaj'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  // Resetuj formu na originalne vrednosti
                  setFormData({
                    ime: user?.ime || '',
                    prezime: user?.prezime || '',
                    email: user?.email || ''
                  });
                }}
                disabled={loading}
                style={{
                  background: '#ccc',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '6px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontSize: '14px'
                }}
              >
                ❌ Otkaži
              </button>
            </div>
          </form>
        )}

        <div style={{
          background: '#e3f2fd',
          padding: '15px',
          borderRadius: '8px',
          marginTop: '20px',
          fontSize: '14px',
          color: '#1565c0'
        }}>
          <strong>💡 Napomena:</strong> Ovde možete ažurirati svoje lične podatke. Za promenu uloge ili deaktiviranje naloga, obratite se administratoru.
        </div>
      </div>

      {/* Statistike korisnika */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '30px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ color: '#333', marginBottom: '20px' }}>📊 Moje Statistike</h3>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #1976d2, #42a5f5)',
            color: 'white',
            padding: '20px',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <h3 style={{ margin: '0 0 5px 0', fontSize: '24px' }}>0</h3>
            <p style={{ margin: 0, opacity: 0.9 }}>Aktivni Projekti</p>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #9c27b0, #ba68c8)',
            color: 'white',
            padding: '20px',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <h3 style={{ margin: '0 0 5px 0', fontSize: '24px' }}>0</h3>
            <p style={{ margin: 0, opacity: 0.9 }}>Dodeljeni Zadaci</p>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #4caf50, #81c784)',
            color: 'white',
            padding: '20px',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <h3 style={{ margin: '0 0 5px 0', fontSize: '24px' }}>0</h3>
            <p style={{ margin: 0, opacity: 0.9 }}>Završeni Zadaci</p>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #ff9800, #ffb74d)',
            color: 'white',
            padding: '20px',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <h3 style={{ margin: '0 0 5px 0', fontSize: '24px' }}>0</h3>
            <p style={{ margin: 0, opacity: 0.9 }}>Sati Rada</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;