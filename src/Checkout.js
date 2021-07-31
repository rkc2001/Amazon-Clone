import React from 'react';
import './Checkout.css';
import CheckoutProduct from './CheckoutProduct';
import { useStateValue } from './StateProvider';
import Subtotal from './Subtotal.js';


function Checkout() {

  const [{basket , user} , dispatch] = useStateValue();

  return (
    <div className="checkout">
      {/* We have two sections of this page -> Left And Right */}
      {/* Left ones for products added and right ones for the price */}
      <div className="checkout__left">
        <img
          className="checkout__ad"
          src="https://images-na.ssl-images-amazon.com/images/G/02/UK_CCMP/TM/OCC_Amazon1._CB423492668_.jpg"
          alt=""
        />
        <div>
          <h3>Hello, {user?.email}</h3>
          <h2 className="checkout__title">Your Shopping Basket</h2>
          {/* We do not want to render a random product but only the ones present in basket */}

          {/* For every single item, we want to return a CheckoutProduct having props */}
          {basket.map(item => {
            return(
              <CheckoutProduct 
                id={item.id}
                image={item.image}
                title={item.title}
                rating={item.rating}
                price={item.price}
              />);
          })}

          {/* Checkout Product */}

        </div>
      </div>
      <div className="checkout__right">
        <Subtotal />
      </div>
    </div>
  )
}

export default Checkout;

//To pull an item from basket, we have to use the useStateValue() custom hook


//Getting name to popup in checkout page : 
//If we get error : cannot read property 'email' of null
//Use optional chaining {user?.email}

//What this does is : there's an asynchronous period where it wont load the user as it fetches info from firebase .By doing this, it protects it from showing error.