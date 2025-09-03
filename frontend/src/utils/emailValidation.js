// src/components/common/EmailProviderLink.js
import React from 'react';
//import { getEmailProvider } from '../../utils/emailValidation'; // 👈 MISSING IMPORT

const EmailProviderLink = ({ email }) => {
  const providerUrl = getEmailProvider(email);
  
  if (!providerUrl) return null;
  
  return (
    <div style={{
      marginTop: '15px',
      textAlign: 'center'
    }}>
      <p style={{ color: '#666', fontSize: '14px', marginBottom: '10px' }}>
        Otvorite vaš email provajder:
      </p>
      <a
        href={providerUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          color: '#2196f3',
          textDecoration: 'none',
          fontWeight: '600',
          padding: '8px 16px',
          border: '2px solid #2196f3',
          borderRadius: '4px',
          display: 'inline-block'
        }}
      >
        Otvorite Email
      </a>
    </div>
  );
};

export default EmailProviderLink;