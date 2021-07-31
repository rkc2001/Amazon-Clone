import React from 'react'
import './Order.css'
import moment from 'moment'
import CheckoutProduct from './CheckoutProduct'
import CurrencyFormat from 'react-currency-format'

function Order({ order }) {
  return (
    <div className='order'>
      <h2>Order</h2>
      {/* moment library for handling timestamp inside order->data->created */}
      <p>{moment.unix(order.data.created).format('MMMM Do YYYY, h:mma')}</p>

      <p className="order__id">
        <small>{order.id}</small>
      </p>

      {/* Here we'll render out the checkout product component (resuability) */}

      {/* We need to loop through order contents but we saved it in a key named data */}
      {order.data.basket?.map(item => (
        <CheckoutProduct
          id={item.id}
          title={item.title}
          image={item.image}
          price={item.price}
          rating={item.rating}
          hideButton
        />
      ))}

      <CurrencyFormat
        renderText={(value) => (  //What actually is rendered on screen
        <>
          <h3 className='order__total'>Order Total : {value}</h3>
        </>
        )}
        decimalScale={2}  
        value={order.data.amount / 100} 
        displayType={"text"}
        thousandSeparator={true}  
        prefix={"$"}  //Currency
      />
    </div>
  )
}

export default Order
