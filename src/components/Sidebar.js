import React, { useEffect, useState } from 'react';
import './Sidebar.css';

const Sidebar = ({ userData, onLogout, menuItems, activeTab, onTabChange, isOpen, onOpenChange }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Detectar cambios de tamaño de pantalla
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      // Cerrar sidebar automáticamente en desktop
      if (!mobile && isOpen) {
        onOpenChange(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen, onOpenChange]);

  const handleTabClick = (tabId) => {
    onTabChange(tabId);
    if (isMobile) {
      onOpenChange(false);
    }
  };

  const handleLogoutClick = async () => {
    onOpenChange(false);
    await onLogout();
  };

  return (
    <>
      {/* Overlay para cerrar sidebar en mobile */}
      {isOpen && isMobile && (
        <div 
          className="sidebar-overlay" 
          onClick={() => onOpenChange(false)}
          aria-hidden="true"
        ></div>
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        {/* Header con logo y cerrar */}
        

        {/* Divider */}
        <div className="sidebar-divider"></div>

        {/* User Info Section */}
        <div className="sidebar-user-section">
          <div className="user-avatar-container">
            <div className="user-avatar">
              {userData?.name ?? '👤'}
            </div>
          </div>
          <div className="user-details">
            <h3 className="user-name">{userData?.name || 'Usuario'}</h3>
            <p className="user-role">
              {userData?.role === 'staff' ? 'Staff' : 'Participante'}
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="sidebar-divider"></div>

        {/* Navigation Menu */}
        <nav className="sidebar-menu">
          <ul>
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  className={`menu-item ${activeTab === item.id ? 'active' : ''}`}
                  onClick={() => handleTabClick(item.id)}
                >
                  <span className="menu-icon">{item.icon}</span>
                  <span className="menu-label">{item.label}</span>
                  {item.badge && (
                    <span className="menu-badge">{item.badge}</span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer con Logout */}
        <div className="sidebar-footer">
          <button 
            className="logout-btn" 
            onClick={handleLogoutClick}
            title="Cerrar sesión"
          >
            <span className="logout-icon">🚪</span>
            <span className="logout-text">Cerrar Sesión</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
