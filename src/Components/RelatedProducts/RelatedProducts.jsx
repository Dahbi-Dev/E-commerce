import React, { useEffect, useState } from "react";
import "./RelatedProducts.css";
import Item from "../Item/Item";

export default function RelatedProducts({ category }) {
  const [data_product, setData_product] = useState([]);

  useEffect(() => {
    if (category) {
      fetch(`https://backend-ecommerce-gibj.onrender.com/relatedproduct/${category}`)
        .then((response) => response.json())
        .then((data) => setData_product(data))
        .catch((error) =>
          console.error("Error fetching related products:", error)
        );
    }
  }, [category]);

  return (
    <div className="RelatedProducts">
      <h1>Related Products</h1>
      <hr />
      <div className="Related">
        {data_product.map((item, i) => {
          return (
            <Item
              key={i}
              id={item.id}
              name={item.name}
              image={item.image}
              new_price={item.new_price}
              old_price={item.old_price}
            />
          );
        })}
      </div>
    </div>
  );
}
