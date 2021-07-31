/*
Create and Deploy Your First Cloud Functions
https://firebase.google.com/docs/functions/write-firebase-functions

  exports.helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase!");
});
*/

//WE're going to build an express app and host it on a cloud function.

const functions = require('firebase-functions');
const express = require('express');  
const cors = require('cors');
//Here, we need the secret key
const stripe = require('stripe')("sk_test_51Ij2fKSGsLZfw6P9n1i5jPmkZkciYe4PuoQNdLgV15gpB7R8DtpzcBWDT4NK376A6T5Fp8kQhdqZyFiBpc5OuSfJ00CM7FCvPE");  //This is the secret key

/* Setting up an API (requires below four fields) - get backend express running on cloud function */

// -App Config
const app = express();

// -Middlewares [cors - sort of security]
app.use(cors({ origin : true}));
app.use(express.json());  //Send and pass data in JSON format

  //To get this up and running on local machine, we can emulate it ... firebase emulators:start 
  //This basically spins up an express server -> gives a link to emulator view ... the site shows backend logs when opened
  //In terminal, http function initialised (link) is URL to API endpoint
  //Link - http://localhost:5001/clone-55d80/us-central1/api


// -API Routes 

  //Setting up a dummy route to see if things are working
  app.get('/',(request,response) => {
    response.status('200').send('hello world')
  });

  /*
    //To test the endpoint,we create another route
    app.get('/rishi',(request,response) => {
      response.status('200').send('Hello Rishi !')
    });
  */
  //We've used this route inside Payment.js
  app.post('/payments/create', async (request,response) => {
    //To get the total variable -> we use query param
    const total = request.query.total;

    console.log('Payment Request Received ... for amount >>>',total);

    var customer = await stripe.customers.create({
      name: 'ABC XYZ',
      address: {
        line1: '510 Townsend St',
        postal_code: '98140',
        city: 'San Francisco',
        state: 'CA',
        country: 'US',
      }
    });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: total,  //subunits of currency - *100 one
      currency: "usd",
      description: "Amazon Clone Order",
      shipping: {
        name: 'ABC XYZ',
        address: {
          line1: '510 Townsend St',
          postal_code: '98140',
          city: 'San Francisco',
          state: 'CA',
          country: 'US',
        }
      },
      payment_method_types: ['card']
    });

    //OK - Created
    response.status(201).send({
      clientSecret: paymentIntent.client_secret,
    });

  });


// -Listen Command

  //To get this up and running
  exports.api = functions.https.onRequest(app);

//Example Endpoint
//http://localhost:5001/clone-55d80/us-central1/api