import React, { useState } from 'react'
import { Link,useHistory } from 'react-router-dom'
import { auth } from './firebase.js'
import './Login.css'


function Login() {

  const history = useHistory();
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');

  const signIn = (e) => { //Takes in an event(e)
    e.preventDefault(); //Prevents the page from refreshing

    //some fancy firbase login stuff...
    auth
        .signInWithEmailAndPassword(email,password)
        .then((auth) => { 
          if(auth){
            //if auth comes back
            history.push('/');  //history -> history of the browser
            //forcing to redirect to home page
          }
        }) 
        .catch(error => alert(error.message));
  }

  const register = (e) => { //Takes in an event(e)
    e.preventDefault(); //Prevents the page from refreshing

    //some fancy firbase register stuff...
    auth
        .createUserWithEmailAndPassword(email,password) //creates a user with em/pass
        .then((auth) => { //if done right, comes back with an auth object
          console.log(auth);
          //successfully created new user
          if(auth){
            //if auth comes back
            history.push('/');  //history -> history of the browser
            //forcing to redirect to home page
          }
        }) 
        .catch(error => alert(error.message));
  }

  return (
    <div className="login">
      <Link to="/">
        <img 
          className="login__logo" 
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/1024px-Amazon_logo.svg.png" 
        />
      </Link>
      <div className="login__container">
        <h1>Sign In</h1>
        <form>
          <h5>Email</h5>
          <input type="text" value={email} onChange={e => setEmail(e.target.value)} />

          <h5>Password</h5>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} />

          <button type="submit" className="login__signInButton" onClick={signIn}>Sign In</button>

        </form>
        <p>By signing-in, you agree to AMAZON FAKE CLONE conditions of Use & Sale.
          Please see our Privacy Notice, our Cookies Notice and our
          Internet-based ads.
        </p>
        <button className="login__registerButton" onClick={register}>Create Your Amazon Account</button>
      </div>

    </div>
  )
}

export default Login

//For user-authentication, we need some way to track what user has entered into the input fields.
//Thus we must useState() here.
//To connect the two states, we must add them as value attribute in input tag .. we mapped value to email state
//Whenever user typed something, we get an event(e) .. we pair event with a function to set the email to e.target.value(i.e what user typed in)
//We trigger two different functions depending on which button was clicked 

//After we have created(registered) the user, we want to push them back into Home Page
//We use useHistory hook available from react-router
//**Allows us to programatically change the URL

//Now we want to add functionality to signin button ... almost same code .. if redirected implies success else error

//How to find who has signed in ??
//Inside App.js, we're going to create a listener that keeps track of who has signed in ... useEffect() hook
//useEffect(() => {...}) is like a dynamic IF statement in React

//basically if authenticated user created/signed in ,we push it to homepage... where we have the listener (useEffect()) that does all of hard work

//**Firebase on its end connects to data-layer via cookies +++ data layer is not local storage on Browser 