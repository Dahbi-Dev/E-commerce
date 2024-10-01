import React, { useEffect, useState } from "react";
import "./DescriptionBox.css";

export default function DescriptionBox() {
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDescription = async () => {
      try {
        const response = await fetch(
          "https://backend-ecommerce-gibj.onrender.com/get-product-description"
        ); // Update this URL to your actual endpoint
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setDescription(data.description); // Assuming the response structure has 'description'
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDescription();
  }, []); // Empty dependency array ensures this runs once on component mount

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error fetching description: {error}</p>;

  return (
    <div className="descriptionbox">
      <div className="descriptionbox-navigator">
        <div className="descriptionbox-nav-box">Description</div>
        <div className="descriptionbox-nav-box fade">Reviews (122)</div>
      </div>
      <div className="descriptionbox-description">
        <p>{description}</p>
      </div>
    </div>
  );
}
