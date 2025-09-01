import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f5f5f5' }}>
      <Sidebar 
        isOpen={sidebarOpen} 
        onToggle={() => setSidebarOpen(!sidebarOpen)} 
      />
      <div style={{
        flex: 1,
        marginLeft: sidebarOpen ? '250px' : '60px',
        transition: 'margin-left 0.3s ease'
      }}>
        <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main style={{ padding: '20px' }}>
          {/* Koristimo children umesto Outlet ako prosleđujemo decu */}
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;