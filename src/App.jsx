import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Navbar from "./Components/Navbar/Navbar";
import Cart from "./Pages/Cart";
import ShopCategory from "./Pages/ShopCategory";
import Product from "./Pages/Product";
import LoginSignUp from "./Pages/LoginSignUp";
import Shop from "./Pages/Shop";
import Footer from "./Components/Footer/Footer";
import { useEffect, useState } from "react";
import CheckoutForm from "./Components/CheckOutForm/CheckoutForm";
import Profile from "./Components/Profile/Profile";
import ThemeProvider from "./Components/ThemeProvider/ThemeProvider";

function App() {
  const [banners, setBanners] = useState([]);
  const api = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await fetch(`${api}/banners`);
        const data = await response.json();
        setBanners(data);
      } catch (error) {
        console.error("Error fetching banners:", error);
      }
    };

    fetchBanners();
  }, []);

  // Assuming the first three banners correspond to men, women, and kids categories.
  const menBanner = banners.find((banner) => banner.category === "men")?.url;
  const womenBanner = banners.find(
    (banner) => banner.category === "women"
  )?.url;
  const kidBanner = banners.find((banner) => banner.category === "kid")?.url;

  return (
    <div>
      <ThemeProvider>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<Shop />} />
            <Route
              path="/mens"
              element={<ShopCategory banner={menBanner} category="men" />}
            />
            <Route
              path="/womens"
              element={<ShopCategory banner={womenBanner} category="women" />}
            />
            <Route
              path="/kids"
              element={<ShopCategory banner={kidBanner} category="kid" />}
            />
            <Route path="/product" element={<Product />}>
              <Route path=":productId" element={<Product />} />
            </Route>
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<CheckoutForm />} />
            <Route path="/login" element={<LoginSignUp />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
          <Footer />
        </BrowserRouter>
      </ThemeProvider>
    </div>
  );
}

export default App;
