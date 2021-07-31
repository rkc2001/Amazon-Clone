import React, { useEffect } from 'react';
import './App.css';
import Header from './Header.js';
import Home from './Home.js';
import Checkout from './Checkout.js';
import Login from './Login.js';
import { BrowserRouter as Router ,Switch ,Route } from 'react-router-dom';
import { auth } from './firebase.js'
import { useStateValue } from './StateProvider.js'
import Payment from './Payment.js'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import Orders from './Orders.js'

//Loads stripe up and stores it into a promise
const promise = loadStripe('pk_test_51Ij2fKSGsLZfw6P9awTXCTzDE8alE5sZbZNK9TKZksX9OAOLgBve7P1FLnWD5Y5kDmC4mF2lBspvLFoDcXRQxdDp00Tbxx3u1P');

function App() {

  const [{},dispatch] = useStateValue();

  useEffect(() => {
    //will only run once when app component loads (since [] is empty)

    //Whenever authentication changes (login/logout/register), gives us the user 
    //might be null if users not there 
    auth.onAuthStateChanged(authUser => {
      console.log("User is >>> ",authUser); //good debugging step

      if(authUser){
        //the user just logged in/was already logged in and refreshed the page
        dispatch({
          type: 'SET_USER',  //fires-off action and shoot info about user into data layer
          user: authUser
        })
      }else{
        //user is logged out
        dispatch({
          type: 'SET_USER',  //login -> shoot into data layer , logout-> pull back from there
          user: null
        })
      }
    })

  }, []) //every time variables present inside [] changes, code os refired

  return (
    //App -> app ... BEM Naming Convention
    //Wrap the entire app around a router
    //We render the header regardless of the route .. but login page, we do not want header ... so we remove the global header
    <Router>
      <div className="app">           
        <Switch>
          <Route path="/checkout">  
            <Header /> 
            <Checkout />
          </Route>
          <Route path="/login">  
            <Login />
          </Route>
          <Route path="/payment">            
            <Header /> 
            {/* We'll be using a higher-order function - it wraps the payment element */}
            <Elements stripe={promise}>
              <Payment />
            </Elements>
          </Route>
          <Route path="/orders">
            <Header /> 
            <Orders />
          </Route> 
          <Route path="/">            
            <Header /> 
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;

