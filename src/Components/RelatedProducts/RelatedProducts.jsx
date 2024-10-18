import React, { useEffect, useState } from "react";
import "./RelatedProducts.css";
import Item from "../Item/Item";
import { useTranslation } from "react-i18next";

export default function RelatedProducts({ category }) {
  const [data_product, setData_product] = useState([]);
  const {t} = useTranslation()
  const api = process.env.REACT_APP_API_URL


  useEffect(() => {
    if (category) {
      fetch(`${api}/relatedproduct/${category}`)
        .then((response) => response.json())
        .then((data) => setData_product(data))
        .catch((error) =>
          console.error("Error fetching related products:", error)
        );
    }
  }, [category]);

  return (
    <div className="RelatedProducts">
      <h1>{t("Related Products")}</h1>
      <hr />
      <div className="Related">
        {data_product.map((item, i) => {
          return (
            <Item
              key={i}
              id={item.id}
              name={item.name}
              images={item.images} // Pass the entire images array
              new_price={item.new_price}
              old_price={item.old_price}
            />
          );
        })}
      </div>
    </div>
  );
}
