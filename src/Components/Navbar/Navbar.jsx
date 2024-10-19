import React, {
  useContext,
  useRef,
  useState,
  useEffect,
  useCallback,
} from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { useTranslation } from "react-i18next";
import { ShopContext } from "../../Context/shopContext";
import { useTheme } from "../ThemeProvider/ThemeProvider";
import Cart_icon from "../Assets/cart_icon.png";
import "./Navbar.css";

function Navbar() {
  const { isDarkMode, toggleTheme } = useTheme();
  const { getTotalCartItems } = useContext(ShopContext);
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [menu, setMenu] = useState("profile");
  const [logos, setLogos] = useState([]);
  const [logoUrl, setLogoUrl] = useState("");
  const [logoName, setLogoName] = useState("");
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const sidebarRef = useRef();
  const toggleRef = useRef();

  const api = process.env.REACT_APP_API_URL;

  const toggleSidebar = () => {
    setIsSidebarVisible((prev) => !prev);
  };

  const handleClickOutside = useCallback((event) => {
    if (
      sidebarRef.current &&
      !sidebarRef.current.contains(event.target) &&
      !toggleRef.current.contains(event.target)
    ) {
      setIsSidebarVisible(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  const handleMenuClick = useCallback((menuName) => {
    setMenu(menuName);
    setIsSidebarVisible(false);
  }, []);

  useEffect(() => {
    const path = location.pathname;
    if (path.includes("/mens")) {
      setMenu("mens");
    } else if (path.includes("/womens")) {
      setMenu("womens");
    } else if (path.includes("/kids")) {
      setMenu("kids");
    } else if (path.includes("/kids")) {
      setMenu("kids");
    } else if (path.includes("/logout")) {
      setMenu("login");
    } else {
      setMenu("profile");
    }
  }, [location.pathname]);

  useEffect(() => {
    const fetchLogos = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${api}/logos`);
        if (!response.ok) {
          console.log("Network response was not ok");
        }
        const data = await response.json();
        setLogos(data);

        if (data.length > 0) {
          setLogoUrl(data[0].url);
          setLogoName(data[0].name);
        } else {
          setLogoUrl("path/to/default/logo.png");
          setLogoName("loading");
        }
      } catch (error) {
        console.error("Error fetching logos:", error);
        console.log("Failed to load logos.");
        setLogoUrl("path/to/default/logo.png");
        setLogoName("loading");
      } finally {
        setLoading(false);
      }
    };

    fetchLogos();
  }, [api]);

  const handleNavigate = () => {
    navigate("/");
  };
  const handleLogIn = () => {
    setIsSidebarVisible(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("auth-token");
    window.location.replace("/");
  };

  const isAuthenticated = !!localStorage.getItem("auth-token");

  return (
    <div className={`navbar ${isDarkMode ? "dark-mode" : ""}`}>
      <div className="navbar-content">
        <div
          ref={toggleRef}
          className={`nav-toggle ${isSidebarVisible ? "active" : ""}`}
          onClick={toggleSidebar}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div onClick={handleNavigate} className="nav-logo">
          {loading ? (
            <p>{t("loading")}</p>
          ) : (
            <>
              <img src={logoUrl} alt={logoName} />
              <p>{logoName}</p>
            </>
          )}
        </div>
        <div
          className={`nav-menu-container ${isSidebarVisible ? "visible" : ""}`}
        >
          <ul ref={sidebarRef} className="nav-menu">
            {isAuthenticated && (
              <li onClick={() => handleMenuClick("profile")}>
                <Link className="link" to="/profile">
                  {t("profile")}
                </Link>
                {menu === "profile" && <hr />}
              </li>
            )}
            <li onClick={() => handleMenuClick("mens")}>
              <Link className="link" to="/mens">
                {t("men")}
              </Link>
              {menu === "mens" && <hr />}
            </li>
            <li onClick={() => handleMenuClick("womens")}>
              <Link className="link" to="/womens">
                {t("women")}
              </Link>
              {menu === "womens" && <hr />}
            </li>
            <li onClick={() => handleMenuClick("kids")}>
              <Link className="link" to="/kids">
                {t("kids")}
              </Link>
              {menu === "kids" && <hr />}
            </li>
            <li className="nav-auth-item">
              {isAuthenticated ? (
                <button onClick={handleLogout}>{t("logout")}</button>
              ) : (
                <Link className="link" to="/login">
                  <button onClick={handleLogIn}>{t("login")}</button>
                </Link>
              )}
            </li>
          </ul>
        </div>
        <div className="nav-login-cart">
          <div className="nav-auth-desktop">
            {isAuthenticated ? (
              <button onClick={handleLogout}>{t("logout")}</button>
            ) : (
              <Link className="link" to="/login" >
                <button >{t("login")}</button>
              </Link>
            )}
          </div>
          <button onClick={toggleTheme} className="theme-toggle">
            {isDarkMode ? <MdLightMode /> : <MdDarkMode />}
          </button>
          <Link className="link" to="/cart">
            <img src={Cart_icon} alt="Cart Icon" />
          </Link>
          <div className="nav-cart-count">{getTotalCartItems()}</div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
