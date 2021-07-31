import React, { useState , useEffect } from 'react'
import { Link , useHistory } from 'react-router-dom';
import CheckoutProduct from './CheckoutProduct';
import './Payment.css'
import { useStateValue } from './StateProvider'
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import CurrencyFormat from 'react-currency-format';
import { getBasketTotal } from './reducer'
import axios from './axios'
import { db } from './firebase'

function Payment() {

  const [{basket , user} , dispatch] = useStateValue();
  const history = useHistory();

  //We create two states for buttons - one is for disabled ... other for error
  const [error, setError] = useState(null);
  const [disabled, setDisabled] = useState(true);
  const [succeeded, setSucceeded] = useState(true);
  const [processing, setProcessing] = useState(""); 

  const [clientSecret, setClientSecret] = useState(true);

  useEffect(() => {
    
    //Here, we generate the special stripe secret which allows us to charge the customer
    //Whenever basket will change, we need to get a new secret ... as amount changes
    const getClientSecret = async () => {

      const response = await axios({
        //We're making a post request ... url will be created by us '?' -> query parameters ... we're trying to pass total amount to the API so as to charge customer 
        method: 'post',
        //Stripe expects the total in a currencies subunits => 10$ = 1000 cents OR 1Rs = 100p .. this is where we're making request to API endpoint setup by us
        url: `/payments/create?total=${getBasketTotal(basket) * 100}`
      });
      //Once we've set the endpoint, we'll be able to call it and get some response

      //When we get the reponse back, it must have the client secret so we set it
      setClientSecret(response.data.clientSecret);
    }

    getClientSecret();
  }, [basket])

  //***After setting up backend, we can log clientSecret
  console.log('THE SECRET IS >>>',clientSecret);
  console.log('🙇',user); //If we using the user object, it is better to log it in console.

  //We'll be using two hooks from react-stripe-js
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async(event) => {
    //Do all fancy stripe stuff
    event.preventDefault();
    setProcessing(true);  //Disables the button when submitted
    
    const payload = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card : elements.getElement(CardElement)
      }
    }).then(({ paymentIntent }) => {  //Destructuring response to get the paymentIntent(pay confirmation)

      //Once payment is completed, we're gonna push the order into the database (uses a NoSQL data struc)
      db.collection('users')
        .doc(user?.uid)
        .collection('orders')
        .doc(paymentIntent.id)
        .set({
          basket: basket,
          amount: paymentIntent.amount,
          created: paymentIntent.created
        })

      setSucceeded(true);
      setError(null)
      setProcessing(false)

      //Here we want to now empty the basket - dispatch an event to context api
      dispatch({
        type: 'EMPTY_BASKET'
      })

      //We throw (swap the payment page with orders) the user to orders page where he can see his order
      history.replace('/orders')
    })

  }

  const handleChange = event => {
    //Listen for changes in the card element and display any errors as customer types their card details
    
    //If no info is typed (event is empty), disable the button
    setDisabled(event.empty);
    //If there's any error display error message
    setError(event.error ? event.error.message : "");  
  }

  return (
    <div className='payment'>
      {/* Contains all checkout information , review items */}
      <div className="payment__container">

        <h1>
          Checkout ({<Link to='/checkout'>{basket?.length} items</Link>})
        </h1>

        {/* Payment Section - Delivery Address */}
        <div className="payment__section">

          <div className="payment__title">
            <h3>Delivery Address</h3>
          </div>

          <div className="payment__address">
            {/* Pull out user's email from the data layer */}
            <p>{user ?.email}</p>
            <p>123 React Lane</p>
            <p>Los Angeles, CA</p>
          </div>

        </div>

        {/* Payment Section - Review Items */}
        <div className="payment__section">
          
          <div className="payment__title">
            <h3>Review Items and Delivery</h3>
          </div>

          <div className="payment__items">
            {/* This is where products from user's basket will show up */}
            
            {/* For every single item in the basket (map) .. return the checkout product of that */}
            {basket.map(item => (
              <CheckoutProduct
                id = {item.id}
                title = {item.title}
                image = {item.image}
                price = {item.price}
                rating = {item.rating}
              />
            ))}
          
          </div>

        </div>

        {/* Payment Section - Payment Method */}
        <div className="payment__section">
          
          <div className="payment__title">
            <h3>Payment Method</h3>
          </div>

          <div className="payment__details">
            {/* Stripe Code comes here */}

              <form onSubmit={handleSubmit}>
                <CardElement onChange={handleChange} />

                {/* Render out the price component */}
                <div className="payment__priceContainer">
                  <CurrencyFormat
                    renderText={(value) => (  //What actually is rendered on screen
                      <>
                        <h3>Order Total : {value}</h3>
                      </>
                    )}
                    decimalScale={2}  //No of allowed decimal places
                    value={getBasketTotal(basket)} //Value to be displayed i.e the calculated value.Value calculated in here is passed as render prop
                    displayType={"text"}
                    thousandSeparator={true}  //Comma after thousand i.e 4,000.98
                    prefix={"$"}  //Currency
                  />

                  {/* || succeeded */}
                  <button disabled = {processing || disabled }> 
                    <span>{processing ? <p>Processing</p> : "Buy Now"}</span>
                  </button>

                </div>
                
                {/* If only there's an error, we show it inside another div */}
                {error && <div>{error}</div>}

              </form>

          </div>

        </div>

      </div>
    </div>
  )
}

export default Payment

/*
To get the card-capturing element (space where we pop-in card details) from Stripe, we need to install certain dependencies in app.js - @stripe/stripe-js , @stripe/react-stripe-js

  Provided to us from stripe that captures the details

Now we create a Stripe Account. 

**
After setting up backend and proceeding to checkout,
it goes to backend -> makes request for certain amount -> comes back into frontend (sends back response)
that we log in our console 

**The secret key is what's going to power the entire transaction.


**Adding to Firestore DB
db.collection('users') -> Access the users collection in NoSQL database
  .doc(user?.uid)  -> Access the document by storing user with id specified by uid
  .colection('orders')  -> Inside the document, access the orders collection of that user
  .doc(paymentIntent.id) -> Now we use payment Intent id as the order id
  .set({.. takes an object with few props ..})
    Pass the basket items before emptying the baskte
    Amount (returned in the intent by Stripe)
    Created (the time at which order was placed)


*/