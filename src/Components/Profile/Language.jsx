import React, { useState, useEffect } from "react";
import { FaGlobe } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import "../../i18n";

const Language = () => {
  const { i18n, t } = useTranslation();
  const [language, setLanguage] = useState(i18n.language);

  useEffect(() => {
    // This effect will run once on component mount
    const savedLanguage = localStorage.getItem("userLanguage");
    if (savedLanguage) {
      i18n.changeLanguage(savedLanguage);
      setLanguage(savedLanguage);
    }
    document.documentElement.lang = i18n.language;
  }, [i18n]);

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    i18n.changeLanguage(newLang);
    localStorage.setItem("userLanguage", newLang);
    document.documentElement.lang = newLang;
  };

  return (
    <div className="language-container">
      <div className="language-selector">
        <FaGlobe className="icon" />
        <select
          value={language}
          onChange={handleLanguageChange}
          style={{ maxWidth: "120px" }}
        >
          <option value="en">English</option>
          <option value="es">Español</option>
          <option value="fr">Français</option>
          <option value="de">Deutsch</option>
        </select>
      </div>
      {/* <p>{i18n.t('currentLanguage')}: {i18n.t(language)}</p> */}
    </div>
  );
};

export default Language;
