import React from "react";
import "./NewCollection.css";
import Item from "../Item/Item";
import { useState } from "react";
import { useEffect } from "react";
import { useTranslation } from 'react-i18next';


export default function NewCollection() {
  const [new_collection, setNew_collection] = useState([]);
  const { t } = useTranslation();
  const api = process.env.REACT_APP_API_URL


  useEffect(() => {
    fetch(`${api}/newCollection`)
      .then((response) => response.json())
      .then((data) => setNew_collection(data));
  }, []);
  return (
    <div className="new-collections" id="collection">
      <h1>{t("NEW COLLECTIONS")}</h1>
      <hr />
      <div className="collections">
        {new_collection.map((item, i) => {
          return (
            <Item
              key={i}
              id={item.id}
              name={item.name}
              images={item.images}
              new_price={item.new_price}
              old_price={item.old_price}
            />
          );
        })}
      </div>
    </div>
  );
}
