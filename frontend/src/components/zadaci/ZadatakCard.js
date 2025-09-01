import React from 'react';
import { useParams } from 'react-router-dom';

const ZadatakCard = ({ zadatak, onSelect, onEdit, onDelete, onStatusChange }) => {
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

  const isOverdue = zadatak.rokZavrsetka && new Date(zadatak.rokZavrsetka) < new Date() && zadatak.status !== 'ZAVRSENO';

  return (
    <div 
      onClick={() => onSelect?.(zadatak)}
      style={{
        background: 'white',
        border: isOverdue ? '2px solid #f44336' : '1px solid #e0e0e0',
        borderRadius: '8px',
        padding: '20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        transition: 'box-shadow 0.2s',
        cursor: onSelect ? 'pointer' : 'default',
        position: 'relative'
      }}
      onMouseEnter={(e) => {
        if (onSelect) e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
      }}
      onMouseLeave={(e) => {
        if (onSelect) e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
      }}>
      
      {isOverdue && (
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
        <div style={{ flex: 1, marginRight: '15px' }}>
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
        
        <div style={{ display: 'flex', gap: '8px', flexDirection: 'column', alignItems: 'flex-end' }}>
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
        marginBottom: '15px'
      }}>
        {zadatak.rokZavrsetka && (
          <div>
            <strong>Rok:</strong><br />
            <span style={{ color: isOverdue ? '#f44336' : '#666' }}>
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

      {(onEdit || onDelete || onStatusChange) && (
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
          {onStatusChange && zadatak.status !== 'ZAVRSENO' && (
            <select
              value={zadatak.status}
              onChange={(e) => onStatusChange(zadatak.id, e.target.value)}
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
          
          {onEdit && (
            <button 
              onClick={() => onEdit(zadatak)}
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
          )}
          
          {onDelete && (
            <button 
              onClick={() => onDelete(zadatak)}
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
          )}
        </div>
      )}
    </div>
  );
};

export default ZadatakCard;