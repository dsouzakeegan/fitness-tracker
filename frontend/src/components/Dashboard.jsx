import { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import CustomHeader from "./layout-components/CustomHeader";
import Sidebar from "./layout-components/Sidebar";
import DashboardPanel from "./dashboard/DashboardPanel";
import { Layout, Drawer } from "antd";
import { setActivePanel } from "../store/slices/workoutSlice";
import WorkoutTracking from "./dashboard/WorkoutTracking";
import ProgressTracker from "./progress-tracker/ProgressTracker";
import GymHub from "./community-members/GymHub";
import BillingAndPlans from "./stripe/BillingAndPlans";

const { Content, Sider } = Layout;

function Dashboard() {
  const dispatch = useDispatch();
  const activePanelId = useSelector((state) => state.workout.activePanelId);
  
  // Screen size states
  const [screenSize, setScreenSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
    isMobile: window.innerWidth < 768,
    isTablet: window.innerWidth >= 768 && window.innerWidth <= 1024,
    isDesktop: window.innerWidth > 1024
  });
  
  const [collapsed, setCollapsed] = useState(() => {
    // Initialize collapsed state based on screen size
    const width = window.innerWidth;
    if (width < 992) return true;
    return JSON.parse(localStorage.getItem('sidebarCollapsed') || 'false');
  });
  
  const [mobileDrawerVisible, setMobileDrawerVisible] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState(() => {
    // Initialize from Redux state or default to '1'
    return activePanelId || '1';
  });

  // Debounced resize handler for better performance
  const handleResize = useCallback(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    setScreenSize({
      width,
      height,
      isMobile: width < 768,
      isTablet: width >= 768 && width <= 1024,
      isDesktop: width > 1024
    });
    
    // Auto-collapse sidebar on smaller screens
    if (width < 992 && !collapsed) {
      setCollapsed(true);
    }
    
    // Auto-close mobile drawer on resize to desktop
    if (width >= 768 && mobileDrawerVisible) {
      setMobileDrawerVisible(false);
    }
  }, [collapsed, mobileDrawerVisible]);

  useEffect(() => {
    let timeoutId;
    
    const debouncedResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleResize, 100);
    };
    
    window.addEventListener("resize", debouncedResize);
    handleResize(); // Initial call
    
    return () => {
      window.removeEventListener("resize", debouncedResize);
      clearTimeout(timeoutId);
    };
  }, [handleResize]);

  // Persist sidebar collapsed state
  useEffect(() => {
    if (!screenSize.isMobile) {
      localStorage.setItem('sidebarCollapsed', JSON.stringify(collapsed));
    }
  }, [collapsed, screenSize.isMobile]);

  // Sync selectedMenuItem with Redux state
  useEffect(() => {
    if (activePanelId && activePanelId !== selectedMenuItem) {
      setSelectedMenuItem(activePanelId);
    } else if (!activePanelId && selectedMenuItem !== '1') {
      // Set default if no active panel in Redux
      dispatch(setActivePanel('1'));
    }
  }, [activePanelId, selectedMenuItem, dispatch]);

  // Initialize Redux state on component mount
  useEffect(() => {
    if (!activePanelId) {
      dispatch(setActivePanel('1'));
    }
  }, [activePanelId, dispatch]);

  const handleMenuItemClick = useCallback((e) => {
    const newPanel = e.key;
    
    // Prevent unnecessary state updates
    if (newPanel === selectedMenuItem) {
      if (screenSize.isMobile) {
        setMobileDrawerVisible(false);
      }
      return;
    }

    // Update both local and Redux state
    setSelectedMenuItem(newPanel);
    dispatch(setActivePanel(newPanel));

    // Handle logout
    if (newPanel === '11') {
      console.log('Logout clicked');
      // Add logout logic here
    }
    
    // Close mobile drawer
    if (screenSize.isMobile) {
      setMobileDrawerVisible(false);
    }
  }, [selectedMenuItem, screenSize.isMobile, dispatch]);

  const handleMobileMenuClick = useCallback(() => {
    setMobileDrawerVisible(true);
  }, []);

  const handleCollapsedChange = useCallback((newCollapsed) => {
    setCollapsed(newCollapsed);
  }, []);

  // Memoized layout style for better performance
  const layoutStyle = {
    overflow: "hidden",
    width: "100%",
    height: "100vh",
  };

  // Sidebar width calculation
  const getSidebarWidth = () => {
    if (screenSize.isMobile) return 0;
    if (screenSize.isTablet) return collapsed ? 70 : 240;
    return collapsed ? 80 : 280;
  };

  // Create a placeholder component for upcoming features
  const PlaceholderPanel = ({ title, description, icon }) => (
    <Content
      style={{
        padding: screenSize.isMobile ? 16 : 24,
        background: '#f5f5f5',
        minHeight: 'calc(100vh - 64px)',
        overflow: 'auto',
      }}
    >
      <div style={{
        background: 'white', 
        padding: screenSize.isMobile ? 16 : 24, 
        borderRadius: 12,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        minHeight: screenSize.isMobile ? 300 : 400,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center'
      }}>
        <div style={{ 
          fontSize: screenSize.isMobile ? '32px' : '48px',
          marginBottom: '16px'
        }}>
          {icon}
        </div>
        <h1 style={{ 
          background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          marginBottom: 16,
          fontSize: screenSize.isMobile ? '20px' : '28px'
        }}>
          {title}
        </h1>
        <p style={{ 
          color: '#666', 
          fontSize: screenSize.isMobile ? 14 : 16,
          maxWidth: '400px',
          lineHeight: '1.5'
        }}>
          {description}
        </p>
        <div style={{
          marginTop: '24px',
          padding: '12px 24px',
          background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)',
          color: 'white',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: 'bold'
        }}>
          Coming Soon! 🚀
        </div>
      </div>
    </Content>
  );

  // Function to render content based on selected menu item
  const renderContent = () => {
    switch (selectedMenuItem) {
      case '1':
        return <DashboardPanel />;
      
      case '2':
        return (
          <PlaceholderPanel
            title="Analytics Hub"
            description="Dive deep into your fitness data with advanced analytics, trends, and insights to optimize your workout performance."
            icon="📊"
          />
        );
      
      case '3':
        return <WorkoutTracking />;
      
      case '4':
        return <ProgressTracker />;
      
      case '5': 
        return <GymHub />;
      
      case '6':
        return (
          <PlaceholderPanel
            title="Health Dashboard"
            description="Monitor your overall health metrics including heart rate, sleep patterns, and nutrition tracking."
            icon="❤️"
          />
        );
      
      case '7': 
        return <BillingAndPlans />;
      
      case '8':
        return (
          <PlaceholderPanel
            title="Billing"
            description="Generate detailed fitness reports, export your data, and share your progress with trainers or friends."
            icon="📋"
          />
        );
      
      case '9':
        return (
          <PlaceholderPanel
            title="Settings & Preferences"
            description="Customize your fitness experience, set goals, configure notifications, and manage your account settings."
            icon="⚙️"
          />
        );
      
      default:
        return <DashboardPanel />;
    }
  };

  return (
    <Layout style={layoutStyle}>
      {/* Header - Fixed at top */}
      <CustomHeader 
        collapsed={collapsed}
        setCollapsed={handleCollapsedChange}
        onMobileMenuClick={handleMobileMenuClick}
      />

      <Layout style={{ marginTop: 64 }}>
        {/* Desktop/Tablet Sidebar */}
        {!screenSize.isMobile && (
          <Sider
            width={getSidebarWidth()}
            collapsed={collapsed}
            onCollapse={handleCollapsedChange}
            collapsible
            trigger={null}
            style={{
              position: 'fixed',
              left: 0,
              top: 64,
              bottom: 0,
              zIndex: 100,
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: collapsed ? 'none' : '2px 0 8px rgba(0, 0, 0, 0.1)',
            }}
            breakpoint="lg"
            collapsedWidth={screenSize.isTablet ? 70 : 80}
          >
            <Sidebar 
              collapsed={collapsed} 
              setCollapsed={handleCollapsedChange} 
              isMobile={screenSize.isMobile}
              onMenuItemClick={handleMenuItemClick}
              selectedMenuItem={selectedMenuItem}
            />
          </Sider>
        )}

        {/* Mobile Drawer */}
        <Drawer
          title={null}
          placement="left"
          closable={false}
          onClose={() => setMobileDrawerVisible(false)}
          open={mobileDrawerVisible}
          bodyStyle={{ 
            padding: 0,
            background: 'rgb(30 41 59)'
          }}
          width={280}
          style={{ zIndex: 1002 }}
          mask={true}
          maskClosable={true}
        >
          <Sidebar 
            collapsed={false} 
            setCollapsed={() => setMobileDrawerVisible(false)} 
            isMobile={true}
            onMenuItemClick={handleMenuItemClick}
            selectedMenuItem={selectedMenuItem}
          />
        </Drawer>

        {/* Main Content Area */}
        <Layout
          style={{
            marginLeft: getSidebarWidth(),
            transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            minHeight: 'calc(100vh - 64px)',
            background: '#f5f5f5',
          }}
        >
          {/* Content wrapper with proper overflow handling */}
          <div style={{ 
            width: '100%', 
            height: 'calc(100vh - 64px)', 
            overflow: 'hidden',
            position: 'relative'
          }}>
            {renderContent()}
          </div>
        </Layout>
      </Layout>

      {/* Loading overlay for smooth transitions */}
      <style jsx>{`
        .content-transition-enter {
          opacity: 0;
          transform: translateY(10px);
        }
        
        .content-transition-enter-active {
          opacity: 1;
          transform: translateY(0);
          transition: opacity 0.2s ease-out, transform 0.2s ease-out;
        }
        
        .content-transition-exit {
          opacity: 1;
          transform: translateY(0);
        }
        
        .content-transition-exit-active {
          opacity: 0;
          transform: translateY(-10px);
          transition: opacity 0.2s ease-out, transform 0.2s ease-out;
        }

        /* Custom scrollbar styles */
        ::-webkit-scrollbar {
          width: 6px;
        }
        
        ::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 3px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 3px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: #a1a1a1;
        }
      `}</style>
    </Layout>
  );
}

export default Dashboard;