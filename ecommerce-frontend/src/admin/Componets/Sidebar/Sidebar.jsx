import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./sidebar.css";
import { 
  FaHome, 
  FaChartLine, 
  FaDollarSign, 
  FaBox, 
  FaShoppingCart, 
  FaUsers, 
  FaChartBar,
  FaEnvelope,
  FaComments,
  FaCog,
  FaUserTie,
  FaFileAlt,
  FaTh,
  FaThList,
  FaTags,
  FaImage
} from "react-icons/fa";
import { useAdminStats } from "../../context/AdminStatsContext";

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { stats } = useAdminStats();

  const isActive = (path) => location.pathname === path;

  const handleLinkClick = () => {
    // Close sidebar on mobile after clicking a link
    if (window.innerWidth <= 768) {
      onClose();
    }
  };

  const menuItems = [
    {
      title: "MAIN",
      items: [
        { path: "/admin", icon: FaHome, label: "Dashboard" },
        // { path: "/admin/analytics", icon: FaChartLine, label: "Analytics" },
        { path: "/admin/sales", icon: FaDollarSign, label: "Sales" }
      ]
    },
    {
      title: "MANAGEMENT",
      items: [
        { path: "/admin/categories", icon: FaTh, label: "Categories" },
        { path: "/admin/subcategories", icon: FaThList, label: "Subcategories" },
        { path: "/admin/brands", icon: FaTags, label: "Brands" },
        { path: "/admin/products", icon: FaBox, label: "Products", badge: stats.totalProducts.toString() },
        { path: "/admin/orders", icon: FaShoppingCart, label: "Orders", badge: stats.totalOrders.toString() },
        { path: "/admin/customers", icon: FaUsers, label: "Customers" },
      ]
    },
    {
      title: "COMMUNICATION",
      items: [
        { path: "/admin/contacts", icon: FaEnvelope, label: "Contact Messages", badge: stats.newMessages.toString() },
      ]
    },
    {
      title: "WEBSITE",
      items: [
        { path: "/admin/hero-sections", icon: FaImage, label: "Hero Sections" },
        { path: "/admin/cms-pages", icon: FaFileAlt, label: "CMS Pages" },
      ]
    },
    {
      title: "SETTINGS",
      items: [
        { path: "/admin/site-settings", icon: FaCog, label: "Site Settings" },
      ]
    }
  ];

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-wrapper">
        {menuItems.map((section, idx) => (
          <div key={idx} className="sidebar-section">
            <h3 className="sidebar-title">{section.title}</h3>
            <ul className="sidebar-list">
              {section.items.map((item, index) => {
                const Icon = item.icon;
                return (
                  <Link 
                    to={item.path} 
                    key={index}
                    className={`sidebar-item ${isActive(item.path) ? "active" : ""}`}
                    onClick={handleLinkClick}
                  >
                    <Icon className="sidebar-icon" />
                    <span className="sidebar-label">{item.label}</span>
                    {item.badge && <span className="sidebar-badge">{item.badge}</span>}
                  </Link>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;

