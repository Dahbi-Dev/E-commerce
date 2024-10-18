import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle, FaClipboardList, FaBars, FaTimes } from "react-icons/fa";
import { VscSettings } from "react-icons/vsc";
import "./Profile.css";
import Orders from "./Orders/Orders";
import Account from "./Account/Account";
import { useTheme } from "../ThemeProvider/ThemeProvider";
import { useTranslation } from "react-i18next";
import Preferences from "./Preferences/Preferences";

const Profile = () => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [activeTab, setActiveTab] = useState(
    localStorage.getItem("activeTab") || "orders"
  );
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);

  useEffect(() => {
    const token = localStorage.getItem("auth-token");
    if (!token) {
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    localStorage.setItem("activeTab", activeTab);
  }, [activeTab]);

  useEffect(() => {
    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth > 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "account":
        return <Account />;
      case "orders":
        return <Orders />;
      case "Preferences":
        return <Preferences />;
      default:
        return <Orders />;
    }
  };

  return (
    <div className={`profile-container ${isDarkMode ? "dark-mode" : ""}`}>
      <button
        className={`sidebar-toggle-btn ${isDarkMode ? "dark-mode" : ""} ${
          isSidebarOpen ? "open" : ""
        }`}
        onClick={toggleSidebar}
      >
        {isSidebarOpen ? <FaTimes className="icon" /> : <FaBars className="icon" />}
      </button>
      <aside
        className={`sidebar ${isDarkMode ? "dark-mode" : ""} ${
          isSidebarOpen ? "open" : "closed"
        }`}
      >
        <div className="sidebar-header">
          <h2 className={`header ${isDarkMode ? "dark-mode" : ""}`}>Profile</h2>
        </div>
        <ul>
          <li className={activeTab === "account" ? "active" : ""}>
            <Link
              className={`links ${isDarkMode ? "dark-mode" : ""}`}
              to="#"
              onClick={() => setActiveTab("account")}
            >
              <FaUserCircle /> {t("Account")}
            </Link>
          </li>
          <li className={activeTab === "orders" ? "active" : ""}>
            <Link
              className={`links ${isDarkMode ? "dark-mode" : ""}`}
              to="#"
              onClick={() => setActiveTab("orders")}
            >
              <FaClipboardList /> {t("Orders")}
            </Link>
          </li>
          <li className={activeTab === "Preferences" ? "active" : ""}>
            <Link
              className={`links ${isDarkMode ? "dark-mode" : ""}`}
              to="#"
              onClick={() => setActiveTab("Preferences")}
            >
              <VscSettings /> {t("Preferences")}
            </Link>
          </li>
        </ul>
      </aside>
      <main
        className={`profile-content ${isDarkMode ? "dark-mode" : ""} ${
          isSidebarOpen ? "" : "sidebar-closed"
        }`}
      >
        {renderContent()}
      </main>
    </div>
  );
};

export default Profile;