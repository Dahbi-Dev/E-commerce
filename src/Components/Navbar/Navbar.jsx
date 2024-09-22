import React, { useContext, useRef, useState, useEffect } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import "./Navbar.css";
import Logo_icon from "../Assets/logo.png";
import Cart_icon from "../Assets/cart_icon.png";
import { ShopContext } from "../../Context/shopContext";
import mav_dropdown from "../Assets/nav_dropdown.png";

function Navbar() {
  const { getTotalCartItems } = useContext(ShopContext);
  const location = useLocation();
  const [menu, setMenu] = useState("shop");
  const menuRef = useRef();

  const dropdown_toggle = (e) => {
    menuRef.current.classList.toggle("nav-menu-visible");
    e.target.classList.toggle("open");
  };

  const closeMenu = () => {
    menuRef.current.classList.remove("nav-menu-visible");
  };

  const handleMenuClick = (menuName) => {
    setMenu(menuName);
    closeMenu(); // Close the menu after selecting an item
  };

  // Update the menu state based on the current path
  useEffect(() => {
    const path = location.pathname;
    if (path.includes("/mens")) {
      setMenu("mens");
    } else if (path.includes("/womens")) {
      setMenu("womens");
    } else if (path.includes("/kids")) {
      setMenu("kids");
    } else {
      setMenu("shop");
    }
  }, [location.pathname]);
  // eslint-disable-next-line no-undef
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/");
  };

  return (
    <div className="navbar">
      <div onClick={handleNavigate} className="nav-logo">
        <img src={Logo_icon} alt="logo_icon" />
        <p>SHOPLONG</p>
      </div>
      <img
        className="nav-dropdown"
        onClick={dropdown_toggle}
        src={mav_dropdown}
        alt="dropdown_icon"
      />
      <ul ref={menuRef} className="nav-menu">
        <li onClick={() => handleMenuClick("shop")}>
          <Link className="link" to="/">
            Shop
          </Link>
          {menu === "shop" && <hr />}
        </li>
        <li onClick={() => handleMenuClick("mens")}>
          <Link className="link" to="/mens">
            Men
          </Link>
          {menu === "mens" && <hr />}
        </li>
        <li onClick={() => handleMenuClick("womens")}>
          <Link className="link" to="/womens">
            Women
          </Link>
          {menu === "womens" && <hr />}
        </li>
        <li onClick={() => handleMenuClick("kids")}>
          <Link className="link" to="/kids">
            Kids
          </Link>
          {menu === "kids" && <hr />}
        </li>
      </ul>
      <div className="nav-login-cart">
        {localStorage.getItem("auth-token") ? (
          <button
            onClick={() => {
              localStorage.removeItem("auth-token");
              window.location.replace("/");
            }}
          >
            Logout
          </button>
        ) : (
          <Link className="link" to="/login">
            <button>Login</button>
          </Link>
        )}

        <Link className="link" to="/cart">
          <img src={Cart_icon} alt="cart_icon" />
        </Link>
        <div className="nav-cart-count">{getTotalCartItems()}</div>
      </div>
    </div>
  );
}

export default Navbar;
