import React, { useContext, useState, useEffect, useRef } from "react";
import { ShopContext } from "../Context/shopContext";
import ClipLoader from "react-spinners/ClipLoader"; // Import the spinner for the main loading
import BounceLoader from "react-spinners/BounceLoader"; // Import a different spinner for loading more products
import "./CSS/ShopCategory.css";
import Item from "../Components/Item/Item";
import { useTranslation } from "react-i18next";

function ShopCategory(props) {
  const { t } = useTranslation();
  const { all_product } = useContext(ShopContext);
  const [sortCriteria, setSortCriteria] = useState("latest"); // Default sort by latest
  const [loadedProducts, setLoadedProducts] = useState([]); // State to hold loaded products
  const [loading, setLoading] = useState(true); // Loading state for initial load
  const [loadingMore, setLoadingMore] = useState(false); // Loading state for "Load More"
  const [loadingSort, setLoadingSort] = useState(false); // Loading state for sorting

  const productsRef = useRef(null); // Ref for the products container

  // Sorting function
  const sortProducts = (products, criteria) => {
    switch (criteria) {
      case "latest":
        return products.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        ); // Sort by creation date
      case "expensive":
        return products.sort((a, b) => b.new_price - a.new_price); // Sort by price (high to low)
      case "cheap":
        return products.sort((a, b) => a.new_price - b.new_price); // Sort by price (low to high)
      case "old":
        return products.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        ); // Sort by oldest
      default:
        return products;
    }
  };

  // Update loaded products when sort criteria or products change
  useEffect(() => {
    const filteredProducts = all_product.filter(
      (item) => props.category === item.category
    );
    const sorted = sortProducts(filteredProducts, sortCriteria);
    setLoadedProducts(sorted.slice(0, 12)); // Load the first 12 products
    setLoading(false); // Set loading to false after products are loaded
  }, [all_product, sortCriteria, props.category]);

  // Load more products
  const loadMoreProducts = () => {
    setLoadingMore(true); // Set loadingMore to true when loading more products

    setTimeout(() => {
      const additionalProducts = loadedProducts.length + 12;
      const newProducts = all_product
        .filter((item) => props.category === item.category)
        .slice(0, additionalProducts); // Get the additional products

      setLoadedProducts(newProducts); // Update the loaded products
      setLoadingMore(false); // Reset loadingMore after products are loaded

      // Scroll to the bottom of the products container
      if (productsRef.current) {
        productsRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 500); // 0.5 seconds delay
  };

  // Handle sort criteria change
  const handleSortChange = (e) => {
    setLoadingSort(true); // Set loading to true when sorting
    const newSortCriteria = e.target.value;
    setSortCriteria(newSortCriteria); // Update sort criteria

    // Simulate loading delay
    setTimeout(() => {
      const filteredProducts = all_product.filter(
        (item) => props.category === item.category
      );
      const sorted = sortProducts(filteredProducts, newSortCriteria);
      setLoadedProducts(sorted.slice(0, 12)); // Load the first 12 products after sorting
      setLoadingSort(false); // Reset loading state
    }, 1200); // 1.2 seconds delay for sorting
  };

  // If sorting, show only the spinner
  if (loadingSort) {
    return (
      <div className="loading-container">
        <ClipLoader loading={loadingSort} size={50} color="#ff6b6b" />
      </div>
    ); // Show loading spinner
  }

  if (loading) {
    return (
      <div className="loading-container">
        <ClipLoader loading={loading} size={50} color="#ff6b6b" />
      </div>
    ); // Show loading spinner for initial load
  }

  return (
    <div className="shop-category">
      <img className="shopCategory-banner" src={props.banner} alt="" />
      <div className="shopCategory-indexSort">
        <p className="products-info">
          <span>
            {t("Showing")} {loadedProducts.length} {t("of")}{" "}
            {all_product.length} {t("products")}
          </span>
        </p>
        <div className="shopCategory-sort">
          <span>{t("Sort by")}:</span>
          <select
            onChange={handleSortChange}
            value={sortCriteria}
            className="sort-select"
          >
            <option value="latest">{t("Latest")}</option>
            <option value="expensive">{t("Expensive")}</option>
            <option value="cheap">{t("Cheap")}</option>
            <option value="old">{t("Old")}</option>
          </select>
        </div>
      </div>
      <div className="shopCategory-products" ref={productsRef}>
        {loadedProducts.map((item, i) => (
          <Item key={i} {...item} />
        ))}
      </div>
      {loadedProducts.length <
        all_product.filter((item) => props.category === item.category)
          .length && (
        <div className="shopCategory-loadMore" onClick={loadMoreProducts}>
          {loadingMore ? (
            <BounceLoader loading={loadingMore} size={20} color="#ff6b6b" />
          ) : (
            "Load More"
          )}
        </div>
      )}
    </div>
  );
}

export default ShopCategory;
