// Preferences.jsx
import React from "react";
import Language from "../Language";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import { FaGlobe, FaPalette, FaBell } from "react-icons/fa";
import "./Preferences.css";
import { useTranslation } from "react-i18next";

function Preferences() {
  const { t } = useTranslation();
  return (
    <div className="preferences-container">
      <h2>{t("User Preferences")}</h2>

      <div className="preference-section">
        <div className="preference-header">
          <h3>
            <FaGlobe /> {t("Language")}
          </h3>
          <div className="language-wrapper">
            <Language />
          </div>
        </div>
      </div>

      <div className="preference-section">
        <div className="preference-header">
          <h3>
            <FaPalette /> {t("Theme")}
          </h3>
          <ThemeToggle />
        </div>
      </div>

      <div className="preference-section">
        <div className="preference-header">
          <h3>
            <FaBell /> {t("Notifications")}
          </h3>
        </div>
        <div className="notification-options">
          <label>
            <input type="checkbox" /> {t("Email notifications")}
          </label>
          <label>
            <input type="checkbox" /> {t("Push notifications")}
          </label>
        </div>
      </div>
    </div>
  );
}

export default Preferences;