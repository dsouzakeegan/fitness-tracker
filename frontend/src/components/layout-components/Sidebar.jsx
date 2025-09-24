import {
  DashboardOutlined,
  BarChartOutlined,
  CalendarOutlined,
  TrophyOutlined,
  TeamOutlined,
  HeartOutlined,
  CreditCardOutlined,
  SettingOutlined,
} from "@ant-design/icons";

const Sidebar = ({ 
  collapsed = false, 
  setCollapsed, 
  isMobile = false, 
  onMenuItemClick,
  selectedMenuItem = '1'
}) => {

  const handleMenuClick = (e) => {
    if (onMenuItemClick) {
      onMenuItemClick(e);
    }
    
    if (e.key === '11') {
      console.log('Logout clicked');
    }
  };

  return (
    <div className={`gym-sidebar ${collapsed ? 'collapsed' : ''}`}>
      <style jsx>{`
        .gym-sidebar {
          height: 100vh;
          background: rgb(30 41 59); /* slate-800 color to match Progress Tracker's container */
          position: relative;
          display: flex;
          flex-direction: column;
          width: ${collapsed ? '80px' : '260px'};
          transition: all 0.3s ease;
          border-right: 1px solid rgba(255, 255, 255, 0.08);
        }
        
        .sidebar-logo {
          padding: 24px 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          flex-shrink: 0;
        }
        
        .logo-container {
          display: flex;
          align-items: center;
          justify-content: ${collapsed ? 'center' : 'flex-start'};
          gap: 12px;
          transition: all 0.3s ease;
        }
        
        .logo-icon {
          width: 36px;
          height: 36px;
          background: #ff6b35;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        
        .logo-text {
          font-size: 20px;
          font-weight: 600;
          color: white;
          transition: all 0.3s ease;
          opacity: ${collapsed ? '0' : '1'};
          ${collapsed ? 'width: 0; overflow: hidden;' : ''}
        }
        
        .menu-container {
          padding: 32px 0;
          flex: 1;
          overflow-y: auto;
          overflow-x: hidden;
        }
        
        .menu-container::-webkit-scrollbar {
          width: 4px;
        }
        
        .menu-container::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .menu-container::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 2px;
        }
        
        .menu-section {
          margin-bottom: 32px;
        }
        
        .menu-section-title {
          color: rgba(255, 255, 255, 0.5);
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          padding: 0 20px 16px;
          margin: 0;
          transition: all 0.3s ease;
          opacity: ${collapsed ? '0' : '1'};
          ${collapsed ? 'height: 0; padding: 0; overflow: hidden;' : ''}
        }
        
        .menu-item {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 16px 20px;
          color: rgba(255, 255, 255, 0.7);
          text-decoration: none;
          transition: all 0.2s ease;
          cursor: pointer;
          position: relative;
          font-weight: 400;
          font-size: 15px;
          justify-content: ${collapsed ? 'center' : 'flex-start'};
          margin: 0 12px 2px 0;
          border-radius: 0 12px 12px 0;
          border-left: 4px solid transparent;
        }
        
        .menu-item:hover {
          background: rgba(255, 255, 255, 0.06);
          color: rgba(255, 255, 255, 0.9);
          border-left: 4px solid rgba(255, 107, 53, 0.3);
        }
        
        .menu-item.active {
          background: rgba(255, 107, 53, 0.1);
          color: #ff6b35;
          border-left: 4px solid #ff6b35;
        }
        
        .menu-item.danger:hover {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
        }
        
        .menu-item-icon {
          font-size: 18px;
          width: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        
        .menu-item-text {
          font-size: 15px;
          flex: 1;
          transition: all 0.3s ease;
          opacity: ${collapsed ? '0' : '1'};
          ${collapsed ? 'width: 0; overflow: hidden;' : ''}
        }
        
        .menu-divider {
          height: 1px;
          background: rgba(255, 255, 255, 0.08);
          margin: 16px 20px;
        }
        
        @media (max-width: 768px) {
          .gym-sidebar {
            width: 260px !important;
          }
          
          .logo-text,
          .menu-section-title,
          .menu-item-text {
            opacity: 1 !important;
            width: auto !important;
            overflow: visible !important;
          }
          
          .logo-container,
          .menu-item {
            justify-content: flex-start !important;
          }
          
          .menu-item {
            padding: 12px 20px !important;
          }
          
          .menu-section-title {
            height: auto !important;
            padding: 0 20px 16px !important;
          }
        }
      `}</style>

      {/* Logo Section */}
      {/* <div className="sidebar-logo">
        <div className="logo-container">
          <div className="logo-icon">
            <span style={{ color: 'white', fontSize: '16px', fontWeight: '700' }}>FH</span>
          </div>
          <span className="logo-text">FitHub</span>
        </div>
      </div> */}

      {/* Menu Section */}
      <div className="menu-container">
        <div className="menu-section">
          <h6 className="menu-section-title">Main</h6>
          <div
            className={`menu-item ${selectedMenuItem === '1' ? 'active' : ''}`}
            onClick={() => handleMenuClick({ key: '1' })}
          >
            <div className="menu-item-icon"><DashboardOutlined /></div>
            <span className="menu-item-text">Dashboard</span>
          </div>
          <div
            className={`menu-item ${selectedMenuItem === '2' ? 'active' : ''}`}
            onClick={() => handleMenuClick({ key: '2' })}
          >
            <div className="menu-item-icon"><BarChartOutlined /></div>
            <span className="menu-item-text">Analytics</span>
          </div>
          <div
            className={`menu-item ${selectedMenuItem === '3' ? 'active' : ''}`}
            onClick={() => handleMenuClick({ key: '3' })}
          >
            <div className="menu-item-icon"><CalendarOutlined /></div>
            <span className="menu-item-text">Workouts</span>
          </div>
          <div
            className={`menu-item ${selectedMenuItem === '4' ? 'active' : ''}`}
            onClick={() => handleMenuClick({ key: '4' })}
          >
            <div className="menu-item-icon"><TrophyOutlined /></div>
            <span className="menu-item-text">Progress</span>
          </div>
        </div>

        <div className="menu-section">
          <h6 className="menu-section-title">Manage</h6>
          <div
            className={`menu-item ${selectedMenuItem === '5' ? 'active' : ''}`}
            onClick={() => handleMenuClick({ key: '5' })}
          >
            <div className="menu-item-icon"><TeamOutlined /></div>
            <span className="menu-item-text">Members</span>
          </div>
          <div
            className={`menu-item ${selectedMenuItem === '6' ? 'active' : ''}`}
            onClick={() => handleMenuClick({ key: '6' })}
          >
            <div className="menu-item-icon"><HeartOutlined /></div>
            <span className="menu-item-text">Health</span>
          </div>
          <div
            className={`menu-item ${selectedMenuItem === '7' ? 'active' : ''}`}
            onClick={() => handleMenuClick({ key: '7' })}
          >
            <div className="menu-item-icon"><CreditCardOutlined /></div>
            <span className="menu-item-text">Billing</span>
          </div>
        </div>

        <div className="menu-divider"></div>

        <div className="menu-section">
          <div
            className={`menu-item ${selectedMenuItem === '9' ? 'active' : ''}`}
            onClick={() => handleMenuClick({ key: '9' })}
          >
            <div className="menu-item-icon"><SettingOutlined /></div>
            <span className="menu-item-text">Settings</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;