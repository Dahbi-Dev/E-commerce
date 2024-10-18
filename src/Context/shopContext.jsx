import React, { useEffect, useState, createContext } from "react";

export const ShopContext = createContext(null);

const api = process.env.REACT_APP_API_URL;

// Function to create a default cart structure
function getDefaultCart() {
  const cart = {};
  for (let index = 0; index <= 300; index++) {
    cart[index] = { quantity: 0, size: null }; // Structure for cart items
  }
  return cart;
}

export default function ShopContextProvider(props) {
  const [all_product, setAll_product] = useState([]);
  const [cartItem, setCartItem] = useState(getDefaultCart());

  // Clear cart function
  const clearCart = () => {
    setCartItem(getDefaultCart()); // Reset cart to default
    if (localStorage.getItem("auth-token")) {
      fetch(`${api}/clearcart`, {
        method: "POST",
        headers: {
          "auth-token": localStorage.getItem("auth-token"),
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => console.log("Cart cleared on server:", data))
        .catch((error) =>
          console.error("Error clearing cart on server:", error)
        );
    }
  };

  // Fetch products and clear the cart if no products exist
  useEffect(() => {
    let isMounted = true; // Prevent memory leaks on unmount

    const fetchProducts = async () => {
      try {
        const response = await fetch(`${api}/allproducts`);
        const data = await response.json();
        if (isMounted) {
          setAll_product(data);

          // If there are no products, clear the cart
          if (data.length === 0) {
            clearCart();
          }
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        if (isMounted) {
          setAll_product([]); // Set products to empty array in case of error
          clearCart(); // Clear cart in case of error fetching products
        }
      }
    };

    const fetchCart = async () => {
      const token = localStorage.getItem("auth-token");
      if (token) {
        try {
          const response = await fetch(`${api}/getcart`, {
            method: "POST",
            headers: {
              "auth-token": token,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({}),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to fetch cart");
          }

          const data = await response.json();
          if (isMounted) setCartItem(data);
        } catch (error) {
          console.error("Error fetching cart:", error.message);
          if (isMounted) setCartItem(getDefaultCart()); // Set to default if there's an error
        }
      }
    };

    fetchProducts();
    fetchCart();

    return () => {
      isMounted = false; // Cleanup function to avoid setting state on unmounted component
    };
  }, []); // Add clearCart as a dependency

  // Add item to cart and update server
  const addToCart = (itemId, size) => {
    setCartItem((prev) => ({
      ...prev,
      [itemId]: {
        quantity: (prev[itemId]?.quantity || 0) + 1,
        size,
      },
    }));

    if (localStorage.getItem("auth-token")) {
      fetch(`${api}/addtocart`, {
        method: "POST",
        headers: {
          "auth-token": localStorage.getItem("auth-token"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ itemId, size }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data.message);
        })
        .catch((error) => console.error("Error adding to cart:", error));
    }
  };

  // Update item in cart and server
  const updateCartItem = (itemId, quantity, size) => {
    setCartItem((prev) => ({
      ...prev,
      [itemId]: { quantity, size },
    }));

    if (localStorage.getItem("auth-token")) {
      fetch(`${api}/updatecartitem`, {
        method: "POST",
        headers: {
          "auth-token": localStorage.getItem("auth-token"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ itemId, quantity, size }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data.message);
        })
        .catch((error) => console.error("Error updating cart item:", error));
    }
  };

  // Remove item from cart and update server
  const removeFromCart = (itemId) => {
    setCartItem((prev) => {
      const newQuantity = prev[itemId]?.quantity - 1;
      const newCart = { ...prev };

      if (newQuantity <= 0) {
        delete newCart[itemId];
      } else {
        newCart[itemId] = { ...newCart[itemId], quantity: newQuantity };
      }

      return newCart;
    });

    if (localStorage.getItem("auth-token")) {
      fetch(`${api}/removefromcart`, {
        method: "POST",
        headers: {
          "auth-token": localStorage.getItem("auth-token"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ itemId }),
      })
        .then((response) => response.json())
        .then((data) => console.log(data))
        .catch((error) => console.error("Error removing from cart:", error));
    }
  };

  // Calculate the total amount of the cart
  const getTotalCartAmount = () => {
    return Object.entries(cartItem).reduce(
      (totalAmount, [item, { quantity }]) => {
        if (quantity > 0) {
          const itemInfo = all_product.find(
            (product) => product.id === parseInt(item)
          );
          if (itemInfo) {
            return totalAmount + itemInfo.new_price * quantity;
          }
        }
        return totalAmount;
      },
      0
    );
  };

  // Get the total number of items in the cart
  const getTotalCartItems = () => {
    return Object.values(cartItem).reduce(
      (total, item) => total + (item.quantity || 0),
      0
    );
  };

  // Context value to be provided to components
  const contextValue = {
    getTotalCartItems,
    getTotalCartAmount,
    all_product,
    cartItem,
    addToCart,
    updateCartItem, // Include updateCartItem in context
    removeFromCart,
    clearCart,
  };

  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
}
