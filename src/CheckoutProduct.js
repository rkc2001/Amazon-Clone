import React from 'react';
import './CheckoutProduct.css';
import { useStateValue } from './StateProvider';
  

function CheckoutProduct({id ,image, title, rating, price, hideButton}) {

  const [{basket , user} , dispatch] = useStateValue();
  const removeFromBasket = () => {
    //Remove the item from the basket i.e we must import from data layer
    //If we ever need to manipulate the basket, remember we need to dipatch an action into reducer(the store)
    dispatch({
      type: 'REMOVE_FROM_BASKET',
      id: id, //We're going to use this to find id from basket and remove it 
    })
  }


  return (
    <div className="checkoutProduct">
      <img className="checkoutProduct__image" src={image} alt="Product_Image" />

      <div className="checkoutProduct__info">
        <p className="checkoutProduct__title">
          {title}
        </p>
        <p className="checkoutProduct__price">
          <small>$</small>
          <strong> {price} </strong>
        </p>
        <div className="checkoutProduct__rating">
            {Array(rating)  //Creating an array of size rating // OR we use <p> {"⭐".repeat(rating)}</p>
            .fill()         //fills the array with an empty value(say null) 
            .map((_,i) => {  //[(_,i)-> can be ignored .. _->if we dont know first parameter, i-> index] .. map through every single value in there and we put a star there
              return (<p>⭐</p>); 
            })}
        </div>
        {/* If hideButton is false only then render this button */}
        
        {!hideButton && (
          <button onClick={removeFromBasket}>Remove From Basket</button>
        )}

      </div>
    </div>
  );
}

export default CheckoutProduct;
