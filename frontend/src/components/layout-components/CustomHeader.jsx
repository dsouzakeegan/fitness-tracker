import React, { useEffect, useState } from "react";
import { Button, Drawer, Menu, Dropdown } from "antd";
import {
  MenuOutlined,
  LoginOutlined,
  SettingOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Header } from "antd/es/layout/layout";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../store/slices/authSlice";

// FitHub Logo Component
const FitHubLogo = ({ size = "medium" }) => {
  const logoSize = size === "large" ? 40 : 32;
  const textSize = size === "large" ? "24px" : "20px";
  
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
      <span style={{
        fontSize: textSize,
        fontWeight: "700",
        color: "white"
      }}>
        FitHub
      </span>
    </div>
  );
};

const headerStyle = {
  position: "fixed",
  zIndex: 1000,
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "0 24px",
  background: "linear-gradient(145deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
  borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
  height: "64px"
};

function CustomHeader({ collapsed, setCollapsed, onMobileMenuClick }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated =
    localStorage.getItem("user") !== null ||
    localStorage.getItem("token") !== null;
  const [visible, setVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const handleResize = () => {
    setIsMobile(window.innerWidth < 768);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  const handleButtonClick = () => {
    navigate("/login");
  };

  const handleLogoutClick = () => {
    dispatch(logoutUser({}));
    navigate("/login");
  };

  const profileDropdownMenu = (
    <Menu style={{ minWidth: "200px", borderRadius: "8px", background: "white" }}>
      <Menu.Item key="profile" style={{ cursor: "default" }}>
        <div style={{ padding: "8px 0" }}>
          <div style={{ fontWeight: "600", fontSize: "16px", color: "#262626" }}>
            John Doe
          </div>
          <div style={{ 
            color: "#ff6b35", 
            fontSize: "12px", 
            fontWeight: "500",
            marginTop: "2px"
          }}>
            Premium Member
          </div>
        </div>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item 
        key="settings" 
        icon={<SettingOutlined />}
        onClick={() => navigate('/settings')}
        style={{ borderRadius: "4px", margin: "4px" }}
      >
        Settings
      </Menu.Item>
      <Menu.Item 
        key="logout" 
        icon={<LogoutOutlined />}
        onClick={handleLogoutClick} 
        danger
        style={{ borderRadius: "4px", margin: "4px" }}
      >
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <Header style={headerStyle}>
      {/* Left Section - Hamburger, Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        {/* Hamburger Menu - Always visible on desktop, mobile drawer trigger on mobile */}
        <Button
          type="text"
          icon={<MenuOutlined style={{ fontSize: "18px", color: "white" }} />}
          onClick={isMobile ? onMobileMenuClick : () => setCollapsed && setCollapsed(!collapsed)}
          style={{ 
            border: "none",
            boxShadow: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(255, 255, 255, 0.1)",
            borderRadius: "8px",
            width: "40px",
            height: "40px"
          }}
        />
        <FitHubLogo size={isMobile ? "medium" : "medium"} />
      </div>

      {/* Right Section - User Profile */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {isAuthenticated ? (
          <div style={{ position: 'relative' }}>
            <Dropdown 
              overlay={profileDropdownMenu} 
              trigger={['click']}
              placement="bottomRight"
            >
              <div style={{ 
                width: 40, 
                height: 40, 
                borderRadius: '50%', 
                background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: "16px",
                fontWeight: 700,
                cursor: 'pointer',
                border: "2px solid #fff",
                boxShadow: '0 4px 12px rgba(255, 107, 53, 0.3)',
                transition: "all 0.2s ease"
              }}>
                JD
              </div>
            </Dropdown>
            
            {/* Online Status Indicator */}
            <div style={{
              position: 'absolute',
              bottom: 2,
              right: 2,
              width: 12,
              height: 12,
              borderRadius: '50%',
              background: '#52c41a',
              border: '2px solid white',
              boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
            }}></div>
          </div>
        ) : (
          <Button
            type="primary"
            onClick={handleButtonClick}
            icon={<LoginOutlined />}
            style={{
              background: "linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)",
              border: "none",
              borderRadius: "8px",
              height: "40px",
              padding: "0 20px",
              fontWeight: "600",
              boxShadow: "0 4px 12px rgba(255, 107, 53, 0.3)"
            }}
          >
            Login
          </Button>
        )}
      </div>

      {/* Mobile Drawer */}
      <Drawer
        title={
          <div style={{ padding: "16px 0" }}>
            <FitHubLogo size="large" />
          </div>
        }
        placement="left"
        onClose={onClose}
        open={visible}
        bodyStyle={{ 
          display: "flex", 
          flexDirection: "column",
          padding: "24px 0"
        }}
        width={280}
        style={{ borderRadius: "0 16px 16px 0" }}
      >
        <div style={{ flex: 1, overflow: "auto" }}>
          {/* Navigation items can be added here if needed */}
          <div style={{ 
            padding: "0 24px", 
            color: "#8c8c8c", 
            fontSize: "14px",
            marginBottom: "16px"
          }}>
            Navigation
          </div>
        </div>
        
        {/* Bottom Action Button */}
        <div style={{ padding: "0 24px" }}>
          {isAuthenticated ? (
            <Button
              type="primary"
              onClick={handleLogoutClick}
              icon={<LogoutOutlined />}
              danger
              block
              size="large"
              style={{ 
                borderRadius: "8px",
                height: "48px",
                fontWeight: "600"
              }}
            >
              Logout
            </Button>
          ) : (
            <Button
              type="primary"
              onClick={handleButtonClick}
              icon={<LoginOutlined />}
              block
              size="large"
              style={{
                background: "linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)",
                border: "none",
                borderRadius: "8px",
                height: "48px",
                fontWeight: "600",
                boxShadow: "0 4px 12px rgba(255, 107, 53, 0.3)"
              }}
            >
              Login
            </Button>
          )}
        </div>
      </Drawer>
    </Header>
  );
}

export default CustomHeader;