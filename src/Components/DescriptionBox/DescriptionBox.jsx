import React, { useEffect, useState } from "react";
import "./DescriptionBox.css";

export default function DescriptionBox({ productId }) {
  const [productDetails, setProductDetails] = useState(null);

  // Fetch product details from the server
  const fetchProductDetails = async () => {
    await fetch(`https://backend-ecommerce-gibj.onrender.com/product/${productId}`)
      .then((res) => res.json())
      .then((data) => {
        setProductDetails(data); // Set the fetched product details
      });
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
        {productDetails ? (
          <p>{productDetails.description}</p> // Display the fetched description
        ) : (
          <p>Loading...</p> // Show loading message while fetching
        )}
      </div>
    </div>
  );
}
