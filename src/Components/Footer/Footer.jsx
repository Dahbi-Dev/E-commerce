import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Footer.css";
import Language from "../Profile/Language";
import { useTranslation } from "react-i18next";
import { useTheme } from '../ThemeProvider/ThemeProvider'; // Adjust the import path as needed

const Footer = () => {
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();
  const [footerLogoUrl, setFooterLogoUrl] = useState("");
  const [footerLogoName, setFooterLogoName] = useState("SHOOPLUX");
  const [footerTextItems, setFooterTextItems] = useState([]);
  const [footerIconItems, setFooterIconItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const api = process.env.REACT_APP_API_URL;


  useEffect(() => {
    const fetchLogos = async () => {
      try {
        const response = await fetch(`${api}/logos`);
        if (!response.ok) {
          throw new Error(`Error fetching logos: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        if (data.length > 0) {
          setFooterLogoUrl(data[0].url);
          setFooterLogoName(data[0].name);
        } else {
          setFooterLogoUrl("path/to/default/logo.png");
          setFooterLogoName("loading");
        }
      } catch (error) {
        console.error(error);
        setFooterLogoUrl("path/to/default/logo.png");
        setFooterLogoName("Loading");
      }
    };

    const fetchFooterTextItems = async () => {
      try {
        const response = await fetch(`${api}/footer-texts`);
        if (!response.ok) {
          throw new Error(`Error fetching footer text items: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          setFooterTextItems(data);
        } else {
          console.log("No footer text items found.");
        }
      } catch (error) {
        console.error(error);
      }
    };

    const fetchFooterIconItems = async () => {
      try {
        const response = await fetch(`${api}/footer-icons`);
        if (!response.ok) {
          throw new Error(`Error fetching footer icon items: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          setFooterIconItems(data);
        } else {
          console.log("No footer icon items found.");
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchLogos();
    fetchFooterTextItems();
    fetchFooterIconItems();
  }, [api]);

  return (
    <div className={`footer ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="footer-logo">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <img src={footerLogoUrl} alt="Footer Logo" />
            <p>{footerLogoName}</p>
          </>
        )}
      </div>
      <div className="footer-links-container">
        <ul className="footer-links">
          {footerTextItems.length > 0 ? (
            footerTextItems.map((item) => (
              <li key={item._id}>
                <Link to={item.textUrl}>{item.text}</Link>
              </li>
            ))
          ) : (
            <li>{t("No footer links available")}.</li>
          )}
        </ul>
      </div>
      <div className="footer-social-icon">
        {footerIconItems.length > 0 ? (
          footerIconItems.map((icon) => (
            <div className="footer-icons-container" key={icon._id}>
              <a href={icon.iconUrl} target="_blank" rel="noopener noreferrer">
                <img src={icon.iconImageUrl} alt={`${icon.text} Icon`} />
              </a>
            </div>
          ))
        ) : (
          <p>{t("No social icons available")}.</p>
        )}
      </div>
      <div className="footer-copyright">
        <hr />
        <Language />
        <p>
          {t("Copyright")} &copy; {new Date().getFullYear()} - {t("All Rights Reserved")}.
        </p>
      </div>
    </div>
  );
};

export default Footer;