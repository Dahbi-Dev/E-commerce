import React from "react";
import "./Popular.css";
import Item from "../Item/Item";
import { useState } from "react";
import { useEffect } from "react";

const Popular = () => {
  const [data_product, setData_product] = useState([]);
  useEffect(() => {
    fetch("https://backend-ecommerce-gibj.onrender.com/popularwomen")
      .then((response) => response.json())
      .then((data) => setData_product(data));
  }, []);
  return (
    <div className="popular">
      <h1>POPULAR IN WOMEN</h1>
      <hr />
      <div className="popular-item">
        {data_product.map((item, i) => (
          <Item
            key={i}
            id={item.id}
            name={item.name}
            image={item.image}
            new_price={item.new_price}
            old_price={item.old_price}
          />
        ))}
      </div>
    </div>
  );
};

export default Popular;
