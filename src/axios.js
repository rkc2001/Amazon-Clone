import axios from 'axios';

const instance = axios.create({

  //Create an object that'll call to Stripe API
  //Initially, baseURL: '...'  //The API (cloud function) URL ... after setting up backend
  baseURL: 'http://localhost:5001/clone-55d80/us-central1/api'  

});

export default instance;

/*
FOR testing purposes, we set baseURL as localhost i.e we're pulling from a local server as its fast
baseURL: 'http://localhost:5001/clone-55d80/us-central1/api'

To deploy a cloud function, we need to write firebase deploy --functions  (only deploy fxns i.e backend)

After deployment is complete, click on the link given next to Project Console : <Link>

Go to the link, then goto "Functions" panel in the firebase console,
We get our endpoint URL from there and paste it in the baseURL section

*/