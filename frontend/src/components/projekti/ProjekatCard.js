import React from 'react';
import { useParams } from 'react-router-dom';

const ProjekatCard = ({ projekat, onSelect, onEdit, onDelete }) => {
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

  return (
    <div 
      onClick={() => onSelect?.(projekat)}
      style={{
        background: 'white',
        border: '1px solid #e0e0e0',
        borderRadius: '12px',
        padding: '20px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        transition: 'transform 0.2s, box-shadow 0.2s',
        cursor: 'pointer'
      }}
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

      <div style={{ fontSize: '11px', color: '#999', borderTop: '1px solid #eee', paddingTop: '10px' }}>
        {projekat.menadzer && (
          <div>Menadžer: {projekat.menadzer.ime} {projekat.menadzer.prezime}</div>
        )}
        {projekat.kreiraoPKorisnik && (
          <div>Kreirao: {projekat.kreiraoPKorisnik.ime} {projekat.kreiraoPKorisnik.prezime}</div>
        )}
      </div>

      {(onEdit || onDelete) && (
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
          {onEdit && (
            <button 
              onClick={() => onEdit(projekat)}
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
          )}
          {onDelete && (
            <button 
              onClick={() => onDelete(projekat)}
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
          )}
        </div>
      )}
    </div>
  );
};

export default ProjekatCard;