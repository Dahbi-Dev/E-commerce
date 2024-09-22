import React, { useEffect } from "react";
import { useState } from "react";
import { createContext } from "react";

export const ShopContext = createContext(null);

function getDefaultCart() {
  const cart = {};
  for (let index = 0; index < 300 + 1; index++) {
    cart[index] = 0;
  }
  return cart;
}

export default function ShopContextProvider(props) {
  const [all_product, setAll_product] = useState([]);
  const [cartItem, setCartItem] = useState(getDefaultCart);

  useEffect(() => {
    fetch("http://localhost:4000/allproducts")
      .then((response) => response.json())
      .then((data) => setAll_product(data));
      if(localStorage.getItem('auth-token')){
        fetch("http://localhost:4000/getcart",{
          method:'POST',
          headers:{
            Accept:'application/form-data',
            'auth-token':`${localStorage.getItem('auth-token')}`,
            'Content-Type':'application/json',
          },
          body:"",
        }).then((response)=>response.json()).then((data)=>setCartItem(data))
      }
  }, []);

  function addToCart(ItemId) {
    setCartItem((prev) => ({ ...prev, [ItemId]: prev[ItemId] + 1 }));
    if (localStorage.getItem("auth-token")) {
      fetch("http://localhost:4000/addtocart", {
        method: "POST",
        headers: {
          Accept: "application/form-data",
          "auth-token": `${localStorage.getItem("auth-token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ itemId: ItemId }),
      })
        .then((response) => response.json())
        .then((data) => console.log(data));
    }
  }
  function removeFromCart(ItemId) {
    setCartItem((prev) => ({ ...prev, [ItemId]: prev[ItemId] - 1 }));
    if (localStorage.getItem("auth-token")) {
      fetch("http://localhost:4000/removefromcart", {
        method: "POST",
        headers: {
          Accept: "application/form-data",
          "auth-token": `${localStorage.getItem("auth-token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ itemId: ItemId }),
      })
        .then((response) => response.json())
        .then((data) => console.log(data));
    }
  }

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItem) {
      if (cartItem[item] > 0) {
        let itemInfo = all_product.find(
          (product) => product.id === Number(item)
        );
        totalAmount += itemInfo.new_price * cartItem[item];
      }
    }
    return totalAmount;
  };

  function getTotalCartItems() {
    let totalItem = 0;
    for (const item in cartItem) {
      totalItem += cartItem[item];
    }
    return totalItem;
  }

  const contextValue = {
    getTotalCartItems,
    getTotalCartAmount,
    all_product,
    cartItem,
    addToCart,
    removeFromCart,
  };
  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
}
