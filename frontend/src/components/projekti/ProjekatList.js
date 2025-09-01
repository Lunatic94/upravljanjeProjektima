import React from 'react';
import ProjekatCard from './ProjekatCard';
import { useParams } from 'react-router-dom';

const ProjekatList = ({ projekti, onSelect, onEdit, onDelete }) => {
  if (!projekti || projekti.length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '60px 20px',
        color: '#666'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '20px' }}>📁</div>
        <h3 style={{ marginBottom: '10px' }}>Nema projekata</h3>
        <p>Nisu pronađeni projekti koji odgovaraju kriterijumima.</p>
      </div>
    );
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
      gap: '20px'
    }}>
      {projekti.map((projekat) => (
        <ProjekatCard
          key={projekat.id}
          projekat={projekat}
          onSelect={onSelect}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default ProjekatList;