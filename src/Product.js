import React from 'react';
import './Product.css';
import { useStateValue } from './StateProvider';

function Product({ id, title, image, price, rating }) { //Destructuring the props object (ES6)

  const [{ basket} , dispatch] = useStateValue();  //state -> state of global store.. dispatch-> how we    manipulate data

  // const [state, dispatch] = useStateValue();
  // console.log(state);  -> state contains basket[] and user info
  //Thus we destructure it above only

  // console.log("This is the basket >>> " , basket);  //Debugging

  const addToBasket = () => {
    //dispatch(shoot) an item (as an object) into data layer
    dispatch({
      type : 'ADD_TO_BASKET',
      item : {
        id : id,
        title : title,
        image : image,
        price : price,
        rating : rating
      }
    })
  };


  
  
  return (
    <div className="product">
      {/* Product Info -> Title , Price , Star-Rating */}
      <div className="product__info">
        <p>{title}</p>
        <p className="product__price">
          <small>$</small>
          <strong>{price}</strong>
        </p>
        <div className="product__rating">
          {Array(rating)    //Creating an empty array for the rating OR we use  <p> {"⭐".repeat(rating)}</p>
            .fill()
            .map((_, i) => {
              return (<p>⭐</p>)
            })}
        </div>
      </div>

      <img src={image} alt="Product" />

{/* When we click this button, we want to dispatch an ADD_TO_BASKET object */}
      <button onClick={addToBasket}>Add to Basket</button>
    </div>
  )
}

export default Product

//Now we want to update the basket number in Header .. so we use the useStateValue() there also