import React, { useState } from "react";
import { Link } from "react-router-dom";

import "./Navbar.css";
import Logo_icon from "../Assets/logo.png";
import Cart_icon from "../Assets/cart_icon.png";

function Navbar() {
  const [menu, setMenu] = useState("shop");
  return (
    <div className="navbar">
      <div className="nav-logo">
        <img src={Logo_icon} alt="cart_icon" />
        <p>SHOPLONG</p>
      </div>
      <ul className="nav-menu">
        <li onClick={() => setMenu("shop")}>
          <Link class="link" to="/">
            Shop
          </Link>{" "}
          {menu === "shop" ? <hr /> : <></>}
        </li>
        <li onClick={() => setMenu("mens")}>
          {" "}
          <Link class="link" to="/mens">
            Men
          </Link>{" "}
          {menu === "mens" ? <hr /> : <></>}
        </li>
        <li onClick={() => setMenu("womens")}>
          {" "}
          <Link class="link" to="/womens">
            Women
          </Link>{" "}
          {menu === "womens" ? <hr /> : <></>}
        </li>
        <li onClick={() => setMenu("kids")}>
          {" "}
          <Link class="link" to="/kids">
            Kids
          </Link>{" "}
          {menu === "kids" ? <hr /> : <></>}
        </li>
      </ul>
      <div className="nav-login-cart">
        <Link class="link" to="/login">
          <button>Login</button>
        </Link>
        <Link class="link" to="/cart">
          <img src={Cart_icon} alt="cart_icon" />
        </Link>
        <div className="nav-cart-count">0</div>
      </div>
    </div>
  );
}

export default Navbar;
