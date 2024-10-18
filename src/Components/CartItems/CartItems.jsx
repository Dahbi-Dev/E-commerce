import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../../Context/shopContext";
import "./CartItems.css";
import remove_icon from "../Assets/cart_cross_icon.png";
import { useNavigate } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader"; // Import the spinner
import { useTranslation } from "react-i18next";

function CartItems() {
  const { t } = useTranslation();
  const {
    getTotalCartAmount,
    getTotalCartItems,
    all_product,
    cartItem,
    removeFromCart,
    clearCart,
    updateCartItem,
  } = useContext(ShopContext);

  const navigate = useNavigate();
  const [isCartEmpty, setIsCartEmpty] = useState(false);
  const [loadingClear, setLoadingClear] = useState(false);
  const [loadingCheckout, setLoadingCheckout] = useState(false);
  const totalAmount = getTotalCartAmount();

  useEffect(() => {
    const cartItemCount = getTotalCartItems();
    setIsCartEmpty(cartItemCount === 0);
  }, [cartItem, getTotalCartItems]);

  const handleCheckout = () => {
    const authToken = localStorage.getItem("auth-token");
    if (!authToken) {
      navigate("/login");
    } else {
      const cartItems = Object.keys(cartItem)
        .filter((key) => cartItem[key].quantity > 0)
        .map((key) => ({
          itemId: key,
          quantity: cartItem[key].quantity,
          size: cartItem[key].size,
        }));

      const userId = localStorage.getItem("user-id");
      const userName = localStorage.getItem("user-name");

      setLoadingCheckout(true);
      setTimeout(() => {
        navigate("/checkout", {
          state: {
            cartItems,
            totalAmount,
            userId,
            userName,
          },
        });
        setLoadingCheckout(false);
      }, 1000);
    }
  };

  const handleClearCart = () => {
    setLoadingClear(true);
    setTimeout(() => {
      clearCart();
      setLoadingClear(false);
    }, 1000);
  };

  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity < 1) return; // Prevents setting quantity less than 1
    updateCartItem(id, newQuantity, cartItem[id].size); // Update quantity
  };

  const handleSizeChange = (id, newSize) => {
    updateCartItem(id, cartItem[id].quantity, newSize); // Update size
  };

  if (isCartEmpty) {
    return (
      <div className="empty-cart">
        <div className="empty-cart-content">
          <h2>{t("Your Cart is Empty")}</h2>
          <p>{t("Looks like you haven't added anything to your cart yet")}.</p>
          <p>{t("Start shopping now to find your favorite products")}!</p>
          <button onClick={() => navigate("/")} className="btn-shop-now">
            {t("Shop Now")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cartitems">
      <div className="cartitems-format-main">
        <p>Products</p>
        <p>Price</p>
        <p>Quantity</p>
        <p>Total</p>
        <p>Size</p>
        <p>Remove</p>
      </div>
      <hr />
      {all_product.map(({ id, images, new_price }) => {
        if (cartItem[id]?.quantity > 0) {
          return (
            <React.Fragment key={id}>
              <div className="cartitems-format cartitems-format-main">
                {/* Check if images exist and images[0] is defined */}
                {images && images[0] ? (
                  <img
                    src={images[0].url}
                    alt={cartItem[id]?.name}
                    className="carticon-product-icon"
                    style={{ borderRadius: "3px" }}
                  />
                ) : (
                  <img
                    src="default-image-url.png"
                    alt="Default"
                    className="carticon-product-icon"
                  />
                )}
                <p>${new_price}</p>
                <input
                  style={{ textAlign: "center" }}
                  type="number"
                  value={cartItem[id]?.quantity}
                  min="1"
                  onChange={(e) =>
                    handleQuantityChange(id, Number(e.target.value))
                  }
                  className="cartitems-quantity"
                />
                <p>${new_price * cartItem[id]?.quantity}</p>
                <select
                  className="size-select"
                  value={cartItem[id]?.size}
                  onChange={(e) => handleSizeChange(id, e.target.value)}
                >
                  <option value="S">S</option>
                  <option value="M">M</option>
                  <option value="L">L</option>
                  <option value="XL">XL</option>
                  <option value="XXL">XXL</option>
                </select>
                <img
                  src={remove_icon}
                  onClick={() => removeFromCart(id)}
                  alt="Remove"
                  className="cartitems-remove-icon"
                />
              </div>
              <hr />
            </React.Fragment>
          );
        }
        return null;
      })}

      <div className="cartitems-down">
        <div className="cartitems-total">
          <h1>Cart Totals</h1>
          <div>
            <div className="cartitems-total-item">
              <p>Subtotal</p>
              <p>${totalAmount}</p>
            </div>
            <hr />
            <div className="cartitems-total-item">
              <p>Shipping Fee</p>
              <p>Free</p>
            </div>
            <hr />
            <div className="cartitems-total-item">
              <p>Total</p>
              <p>${totalAmount}</p>
            </div>
          </div>
          <button onClick={handleCheckout} className="cartitems-checkout-btn">
            {loadingCheckout ? (
              <ClipLoader loading={loadingCheckout} size={20} color="#fff" />
            ) : (
              "Checkout"
            )}
          </button>

          <button onClick={handleClearCart} className="cartitems-clear-btn">
            {loadingClear ? (
              <ClipLoader loading={loadingClear} size={20} color="#fff" />
            ) : (
              "Clear Cart"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CartItems;
