import React from 'react';
import './Subtotal.css';
import CurrencyFormat from "react-currency-format";
import { useStateValue } from './StateProvider';
import { getBasketTotal } from './reducer';
import { useHistory } from 'react-router';

function Subtotal() {

  //Router provides us with useHistory that gives us user's browser history
  const history = useHistory();

  const [{basket , user} , dispatch] = useStateValue();

  return (
    <div className='subtotal'>
      <CurrencyFormat
        renderText={(value) => (  //What actually is rendered on screen
          <>
            <p>
              {/* Subtotal Number of Items and Value */}
              Subtotal ({basket.length} items): 
              <strong> {value} </strong>
            </p>
            <small className="subtotal__gift">
              <input type="checkbox" /> This order contains a gift
            </small>
          </>
        )}
        decimalScale={2}  //No of allowed decimal places
        value={getBasketTotal(basket)} //Value to be displayed i.e the calculated value.Value calculated in here is passed as render prop
        displayType={"text"}
        thousandSeparator={true}  //Comma after thousand i.e 4,000.98
        prefix={"$"}  //Currency
      />

      {/* When button is clicked (comprises if event e) ... we push the page into browser history (redirecting it into our payments page) */}
      <button onClick = {e => history.push('/payment')}>Proceed to Checkout</button>
    </div>
  )
}

export default Subtotal


//After updating number of items in header, we want it to update in checkout page i.e subtotal(no. of items) and also show total price