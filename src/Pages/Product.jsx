import React, { useContext } from "react";
import { ShopContext } from "../Context/shopContext";
import { useParams } from "react-router-dom";
import Breadcrum from "../Components/Breadcrum/Breadcrum";
import ProductDisplay from "../Components/ProductDisplay/ProductDisplay";
import DescriptionBox from "../Components/DescriptionBox/DescriptionBox";
import RelatedProducts from "../Components/RelatedProducts/RelatedProducts";

function Product() {
  const { all_product } = useContext(ShopContext);
  const { productId } = useParams();
  
  // Find the product by id
  const product = all_product.find((e) => e.id === Number(productId));

  // Check if the product is available before rendering the components
  if (!product) {
    return <div>Product not found</div>; // Handle case where product is not found
  }

  return (
    <div>
      <Breadcrum product={product} />
      <ProductDisplay product={product} />
      <DescriptionBox />
      <RelatedProducts category={product.category} />
    </div>
  );
}

export default Product;
