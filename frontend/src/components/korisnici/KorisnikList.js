import React from 'react';
import KorisnikCard from './KorisnikCard';
import { useParams } from 'react-router-dom';

const KorisnikList = ({ korisnici, onEdit, onDeactivate, canManage }) => {
  if (!korisnici || korisnici.length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '60px 20px',
        color: '#666'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '20px' }}>👥</div>
        <h3 style={{ marginBottom: '10px' }}>Nema korisnika</h3>
        <p>Nisu pronađeni korisnici koji odgovaraju kriterijumima.</p>
      </div>
    );
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '20px'
    }}>
      {korisnici.map((korisnik) => (
        <KorisnikCard
          key={korisnik.id}
          korisnik={korisnik}
          onEdit={onEdit}
          onDeactivate={onDeactivate}
          canManage={canManage}
        />
      ))}
    </div>
  );
};

export default KorisnikList;