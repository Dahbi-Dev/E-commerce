import React from "react";
import { Link } from "react-router-dom";
import "./Item.css";

const Item = (props) => {
  return (
    <div className="item">
      <Link to={`/product/${props.id}`}>
        {/* Check if images exist and images[0] is defined */}
        <img
        style={{borderRadius:'4px'}}
          onClick={window.scrollTo(0, 0)}
          src={props.images && props.images[0] ? props.images[0].url : "default-image-url.png"}
          alt={props.name}
        />
      </Link>
      <p>{props.name}</p>
      <div className="item-prices">
        <div className="item-price-new">${props.new_price}</div>
        <div className="item-price-old">${props.old_price}</div>
      </div>
    </div>
  );
};

export default Item;
