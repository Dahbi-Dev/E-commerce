import React from 'react'
import './Breadcrum.css'
import arrow_icon from '../Assets/breadcrum_arrow.png'

function Breadcrum(props) {
    const {product} = props;
  return (
    <div className='breadcrum'>
       <a href="/">HOME</a>  <img src={arrow_icon} alt="" /> SHOP <img src={arrow_icon} alt="" /> <a href={`/${product.category}s`}>{product.category}</a> <img src={arrow_icon} alt="" /> {product.name} 
    </div>
  )
}

export default Breadcrum