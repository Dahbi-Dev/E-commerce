import React from "react";
import { useState } from "react";
import { createContext } from "react";
import all_product from "../Components/Assets/all_product";

export const ShopContext = createContext(null);

function getDefaultCart() {
  const cart = {};
  for (let index = 0; index < all_product.length + 1; index++) {
    cart[index] = 0;
  }
  return cart;
}

export default function ShopContextProvider(props) {
  const [cartItem, setCartItem] = useState(getDefaultCart);

  function addToCart(ItemId) {
    setCartItem((prev)=>({...prev,[ItemId]:prev[ItemId]+1}))
    console.log(cartItem);
  }
  function removeFromCart(ItemId) {
    setCartItem((prev)=>({...prev,[ItemId]:prev[ItemId]-1}))
  }
  const contextValue = { all_product, cartItem, addToCart, removeFromCart };

  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
}
