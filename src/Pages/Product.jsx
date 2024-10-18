import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../Context/shopContext";
import { useParams, useNavigate } from "react-router-dom";
import Breadcrum from "../Components/Breadcrum/Breadcrum";
import ProductDisplay from "../Components/ProductDisplay/ProductDisplay";
import DescriptionBox from "../Components/DescriptionBox/DescriptionBox";
import RelatedProducts from "../Components/RelatedProducts/RelatedProducts";
import ClipLoader from "react-spinners/ClipLoader"; // Importing the spinner

function Product() {
  const { all_product } = useContext(ShopContext);
  const { productId } = useParams();
  const navigate = useNavigate(); // Initialize useNavigate
  const [loading, setLoading] = useState(true); // State to handle loading

  // Find the product by id
  const product = all_product.find((e) => e.id === Number(productId));

  // Check if the product is available before rendering the components
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!product) {
        navigate("/"); // Redirect to home if product not found
      } else {
        setLoading(false); // Stop loading if product is found
      }
    }, 1500); // 1.5 seconds loading time

    return () => clearTimeout(timer); // Cleanup timer on unmount
  }, [product, navigate]); // Add product and navigate to dependencies

  // Show loading spinner while loading
  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <ClipLoader loading={loading} size={50} color="#ff6b6b" /> {/* Loading Spinner */}
      </div>
    );
  }

  // Return null or a loading state while checking for product
  if (!product) {
    return null; // This line may not be needed, as you'll be redirected
  }

  return (
    <div>
      <Breadcrum product={product} />
      <ProductDisplay product={product} />
      <DescriptionBox productId={productId} />{" "}
      {/* Pass productId to DescriptionBox */}
      <RelatedProducts category={product.category} />
    </div>
  );
}

export default Product;
