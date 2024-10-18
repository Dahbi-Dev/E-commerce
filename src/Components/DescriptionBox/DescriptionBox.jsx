import React, { useEffect, useState } from "react";
import "./DescriptionBox.css";

export default function DescriptionBox({ productId }) {
  const [productDetails, setProductDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const api = process.env.REACT_APP_API_URL


  // Fetch product details from the server
  const fetchProductDetails = async () => {
    try {
      const response = await fetch(`${api}/allproducts`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();

      // Find the product by id in the fetched data
      const product = data.find((item) => item.id === Number(productId));
      setProductDetails(product);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (productId) {
      fetchProductDetails();
    }
  }, [productId]);

  return (
    <div className="descriptionbox">
      <div className="descriptionbox-navigator">
        <div className="descriptionbox-nav-box">Description</div>
        <div className="descriptionbox-nav-box fade">Reviews (122)</div>
      </div>
      <div className="descriptionbox-description">
        {loading ? (
          <p>Loading...</p> // Show loading message while fetching
        ) : error ? (
          <p>Error: {error}</p> // Show error message
        ) : (
          <p>{productDetails ? productDetails.description : "Description not found."}</p> // Display the fetched description
        )}
      </div>
    </div>
  );
}
