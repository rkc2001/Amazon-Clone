//Think of it as data layer ..... how we're able to dispatch the action into data layer
//Pushing into data layer is where reducer plays an imp part
export const initialState = { //Creating an initial state
  basket: [], //empty basket to begin with
  user: null  //storing user in Context i.e. the data layer
};

//Creating a reducer (listener that listens for dispatch request)
//We will define all of your application level states and define actions to make changes to the state.
const reducer = (state, action) => {//state of application..action -> what we're trying to do, add/remove
  console.log(action);  
  switch (action.type) {
    case 'ADD_TO_BASKET' : //Whenever button is pressed, an action of type 'ADD_TO_BASKTET' is dispatched
      return {
        ...state, //whatever original state was
        basket: [...state.basket,action.item],  //Whatever basket was + the added item also
      };

    case 'EMPTY_BASKET' : 
      return {
        ...state,
        basket: []  //change basket to original empty array 
      };

    case 'REMOVE_FROM_BASKET' : 
        //Firstly, we need to find the index of the item we're trying to delete
        const index = state.basket.findIndex((basketItem) => basketItem.id === action.id);
        //Finds the first occurence of item with id == selected item's id
        let newBasket = [...state.basket]; //Copied into temp variable

        if(index >= 0){
          newBasket.splice(index,1);  //Cut out 1 element from array after the index
        }else{
          console.warn(`Cant remove product (id : ${action.id}) as it is not in the basket !`);
        }

        return {
          ...state,
          basket : newBasket
        };

    case 'SET_USER' : 
        return {
          ...state,
          user : action.user  //action.user's the one we dispatched
        }; 

    default:  //Mandatory
      return state;
  }
};

export default reducer;

//After this, we need to connect button with the action of pushing something into the data layer
//i.e inside of product.js

//Selector -> ES6 way of sending total value inside cart
export const getBasketTotal = (basket) =>  
  basket?.reduce((amount,item) => item.price + amount , 0); //amount- > accumulator ...0 is initial value 


// The reduce() method reduces the array to a single value.

// The reduce() method executes a provided function for each value of the array (from left-to-right).

// The return value of the function is stored in an accumulator (result/total).

//?. -> To avoid error : Cannot read property basket of undefined

//Professional practice of having selectors inside reducer.js ... we can also use this function inside subtotal component 

//***This works but there's a downside ... 
  // return {
  //   ...state, 
  //   basket: state.basket.filter(item => item.id != action.id)  
  // };
//If we select more than one item , but click on Remove from Basket option , it removes all occurences of the item , not just one [same items have same id]
//If all products have different id , we can use this method