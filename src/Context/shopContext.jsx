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
  }
  function removeFromCart(ItemId) {
    setCartItem((prev)=>({...prev,[ItemId]:prev[ItemId]-1}))
  }
  
  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for(const item in cartItem)
    {
      if(cartItem[item] > 0)
      {
        let itemInfo = all_product.find((product)=>product.id===Number(item))
        totalAmount +=  itemInfo.new_price * cartItem[item];
      }
    }
    return totalAmount;
  }

  function getTotalCartItems() {
    let totalItem = 0;
    for( const item in cartItem  ){
      totalItem += cartItem[item];
    }
    return totalItem;
  }
  
  const contextValue = {getTotalCartItems ,getTotalCartAmount, all_product, cartItem, addToCart, removeFromCart };
  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
}
