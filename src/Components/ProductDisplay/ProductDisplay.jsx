import React, { useContext, useState, useEffect } from "react";
import "./ProductDisplay.css";
import star_icon from "../Assets/star_icon.png";
import star_dull_icon from "../Assets/star_dull_icon.png";
import { ShopContext } from "../../Context/shopContext";
import ClipLoader from "react-spinners/ClipLoader"; // Import the spinner
import { useTranslation } from "react-i18next";

export default function ProductDisplay(props) {
  const { t } = useTranslation();
  const { product } = props;
  const { addToCart } = useContext(ShopContext);
  const [mainImage, setMainImage] = useState(product.images[0].url); // Set initial main image
  const [selectedSize, setSelectedSize] = useState("M"); // Initialize selected size to "M"
  const [loading, setLoading] = useState(false); // Loading state for add to cart button
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // State to track the current image index

  // Function to handle size selection
  const handleSizeSelect = (size) => {
    setSelectedSize(size);
  };

  const handleAddToCart = () => {
    if (selectedSize) {
      setLoading(true); // Set loading to true
      // Simulate adding to cart with a delay
      setTimeout(() => {
        addToCart(product.id, selectedSize); // Pass the selected size to addToCart
        setLoading(false); // Reset loading state
      }, 1200); // Delay of 1.2 seconds
    } else {
      alert("Please select a size"); // Alert if no size is selected
    }
  };

  // Set the button color based on size selection
  const buttonColor = selectedSize ? "#ff6b6b" : "#ccc"; // Example: red color if a size is selected

  // Effect to change the main image every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % product.images.length; // Loop back to the start
        setMainImage(product.images[nextIndex].url); // Change main image
        return nextIndex; // Update the current image index
      });
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval); // Clean up interval on component unmount
  }, [product.images]);

  return (
    <div className="productdisplay">
      <div className="productdisplay-left">
        <div className="productdisplay-img-list">
          {product.images.map((img, index) => (
            <img
              style={{ cursor: "pointer" }}
              key={index}
              src={img.url}
              alt={`Product ${index}`}
              onClick={() => setMainImage(img.url)} // Set clicked image as the main image
              className="productdisplay-thumbnail"
            />
          ))}
        </div>
        <div className="productdisplay-img">
          <img
            className="productdisplay-main-img"
            src={mainImage}
            alt={product.name}
          />
        </div>
      </div>

      <div className="productdisplay-right">
        <h1>{product.name}</h1>
        <div className="productdisplay-right-stars">
          <img src={star_icon} alt="Star" />
          <img src={star_icon} alt="Star" />
          <img src={star_icon} alt="Star" />
          <img src={star_icon} alt="Star" />
          <img src={star_dull_icon} alt="Dull Star" />
          <p>(122)</p>
        </div>
        <div className="productdisplay-right-prices">
          <div className="productdisplay-right-price-old">
            ${product.old_price}
          </div>
          <div className="productdisplay-right-price-new">
            ${product.new_price}
          </div>
        </div>
        <div className="productdisplay-right-description">
          {product.description ||
            "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Necessitatibus laboriosam."}
        </div>
        <div className="productdisplay-right-size">
          <h1>{t("Select Size")}</h1>
          <div className="productdisplay-right-sizes">
            {["S", "M", "L", "XL", "XXL"].map((size) => (
              <div
                key={size}
                className={`size-option ${
                  selectedSize === size ? "selected" : ""
                }`}
                onClick={() => handleSizeSelect(size)}
                style={{
                  backgroundColor:
                    selectedSize === size ? buttonColor : "transparent", // Match button color
                  color: selectedSize === size ? "#fff" : "#000", // Change text color if selected
                }}
              >
                {size}
              </div>
            ))}
          </div>
        </div>
        <button
          onClick={handleAddToCart}
          style={{ backgroundColor: buttonColor, borderRadius: "5px" }} // Button color based on size selection
        >
          {loading ? (
            <ClipLoader loading={loading} size={20} color="#fff" /> // Show loading spinner when loading
          ) : (
            <span>{t("ADD TO CART")}</span>
          )}
        </button>
        <p className="productdisplay-right-category">
          <span>{t("Category")} :</span> {t("Women, T-Shirt, Crop Top")}
        </p>
        <p className="productdisplay-right-category">
          <span>{t("Tags")} :</span> {t("Modern Latest")}
        </p>
      </div>
    </div>
  );
}
