import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";

import "./Navbar.css";
import Logo_icon from "../Assets/logo.png";
import Cart_icon from "../Assets/cart_icon.png";
import { ShopContext } from "../../Context/shopContext";

function Navbar() {
  const {getTotalCartItems} = useContext(ShopContext);
  const [menu, setMenu] = useState("shop");
  return (
    <div className="navbar">
      <div className="nav-logo">
        <img src={Logo_icon} alt="cart_icon" />
        <p>SHOPLONG</p>
      </div>
      <ul className="nav-menu">
        <li onClick={() => setMenu("shop")}>
          <Link className="link" to="/">
            Shop
          </Link>{" "}
          {menu === "shop" ? <hr /> : <></>}
        </li>
        <li onClick={() => setMenu("mens")}>
          {" "}
          <Link className="link" to="/mens">
            Men
          </Link>{" "}
          {menu === "mens" ? <hr /> : <></>}
        </li>
        <li onClick={() => setMenu("womens")}>
          {" "}
          <Link className="link" to="/womens">
            Women
          </Link>{" "}
          {menu === "womens" ? <hr /> : <></>}
        </li>
        <li onClick={() => setMenu("kids")}>
          {" "}
          <Link className="link" to="/kids">
            Kids
          </Link>{" "}
          {menu === "kids" ? <hr /> : <></>}
        </li>
      </ul>
      <div className="nav-login-cart">
        <Link className="link" to="/login">
          <button>Login</button>
        </Link>
        <Link className="link" to="/cart">
          <img src={Cart_icon} alt="cart_icon" />
        </Link>
        <div className="nav-cart-count">{getTotalCartItems()}</div>
      </div>
    </div>
  );
}

export default Navbar;
