import React from 'react';
import ZadatakCard from './ZadatakCard';
import { useParams } from 'react-router-dom';

const ZadatakList = ({ zadaci, onSelect, onEdit, onDelete, onStatusChange }) => {
  if (!zadaci || zadaci.length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '60px 20px',
        color: '#666'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '20px' }}>📋</div>
        <h3 style={{ marginBottom: '10px' }}>Nema zadataka</h3>
        <p>Nisu pronađeni zadaci koji odgovaraju kriterijumima.</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gap: '15px' }}>
      {zadaci.map((zadatak) => (
        <ZadatakCard
          key={zadatak.id}
          zadatak={zadatak}
          onSelect={onSelect}
          onEdit={onEdit}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
        />
      ))}
    </div>
  );
};

export default ZadatakList;