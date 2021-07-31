import React, { useEffect, useState } from 'react'
import './Orders.css'
import { db } from './firebase'
import { useStateValue } from './StateProvider';
import Order from './Order.js'

function Orders() {

  const [{ basket,user }, dispatch ] = useStateValue();
  //We're going to create a state for storing all the orders
  const [orders,setOrders] = useState([]);

  //When orders component loads,we fire up useEffect hook [..empty..] => will run only once.
  useEffect( () => {
    
    //If user exists
    if(user){
      //Here,we need to pull orders from DB .. i.e pull user from context api
      db.collection('users')
        .doc(user?.uid)
        .collection('orders')
        .orderBy('created','desc')
        .onSnapshot(snapshot => {
          setOrders(snapshot.docs.map(doc => ({
            id: doc.id,
            data: doc.data()
          })))
        });
    } else{
      //Else we set orders to an empty array
      setOrders([]);
    }
  },[user]);

  return (
    <div className='orders'>
      <h1>Your Orders</h1>

      <div className="orders__order">
        {/* Map through every single order and return an order component for each */}
        {orders?.map(order => (
          <Order order={order} />
        ))}
      </div>

    </div>
  )
}

export default Orders

/* 
WE want to push the order into a real-time database

We're gonna have a collection of users. Once they've signed in, we have the user id and by using that, every time an order is pushed, every single user will have a connection with order placed by him.

orderBy('created','desc') => gives back order sorted in descending order by order placing time
onSnapshot() => gives a snapshot of what the 'realtime' DB looks like ... realtime updates

snapshot.docs() => returns all orders as a document
.map(doc => ({ //Map through every single doc and for each, we return an object
  having id: doc.id,
  data: doc.data()
}))
*/