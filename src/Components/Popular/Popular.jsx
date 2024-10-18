import "./Popular.css";
import Item from "../Item/Item";
import { useState } from "react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

const Popular = () => {
  const [data_product, setData_product] = useState([]);
  const { t } = useTranslation();
  const api = process.env.REACT_APP_API_URL

  useEffect(() => {
    fetch(`${api}/popularwomen`)
      .then((response) => response.json())
      .then((data) => setData_product(data));
  }, []);
  return (
    <div className="popular">
      <h1>{t("POPULAR IN WOMEN")}</h1>
      <hr />
      <div className="popular-item">
        {data_product.map((item, i) => (
          <Item
            key={i}
            id={item.id}
            name={item.name}
            images={item.images}
            new_price={item.new_price}
            old_price={item.old_price}
          />
        ))}
      </div>
    </div>
  );
};

export default Popular;
