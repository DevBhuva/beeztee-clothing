import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import TopBar from './Componets/topbar/TopBar';
import Sidebar from './Componets/Sidebar/Sidebar';
import { AdminStatsProvider } from './context/AdminStatsContext';
import { ThemeProvider } from './context/ThemeContext';
import './adminLayout.css';

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <ThemeProvider>
      <AdminStatsProvider>
        <div className="admin-layout">
          <TopBar onMenuClick={toggleSidebar} />
          <div className="admin-container">
            <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
            {sidebarOpen && <div className="sidebar-overlay" onClick={closeSidebar}></div>}
            <div className="admin-content">
              <Outlet /> 
            </div>
          </div>
        </div>
      </AdminStatsProvider>
    </ThemeProvider>
  );
}
