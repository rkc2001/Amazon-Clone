import React from 'react';
import './Header.css';  //Any CSS we include inside our div i.e Header component will be written here
import SearchIcon from '@material-ui/icons/Search';
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket';
import { Link } from 'react-router-dom';
import { useStateValue } from './StateProvider';
import { auth } from './firebase.js'

function Header() {

  const [{basket , user} , dispatch] = useStateValue();

  const handleAuthentication = () => {
    if(user){ //if user is there(signed in) ,and we click on the div
      auth.signOut();
      //But it takes us back to the login page ... fixed on line 32-33
    }
  }

  return (
    <div className='header'>
      <Link to='/'>
        <img className='header__logo' src="http://pngimg.com/uploads/amazon/amazon_PNG11.png" />
      </Link>  
      <div className='header__search'>
        <input className='header__searchInput' type="text" alt="AMAZON_LOGO" />
        {/* Search Logo */}
        <SearchIcon className='header__searchIcon' />
      </div>
      <div className='header__nav'>
      {/* We create 3 divs each for Hello,Sign In .. Your Orders .. Your Prime */}
      {/* If there was no user, only then redirect to login page */}
        <Link to={!user && '/login'}>
          <div className='header__option' onClick={handleAuthentication}>
            <span className='header__optionLineOne'>Hello {user ? user.email: 'Guest'}</span>
            <span className='header__optionLineTwo'>{user ? 'Sign Out' : 'Sign In'}</span>
          </div>
        </Link>

        <Link to={'/orders'}>
          <div className='header__option'>
            <span className='header__optionLineOne'>Returns</span>
            <span className='header__optionLineTwo'>& Orders</span>
          </div>
        </Link>
        <div className='header__option'>
          <span className='header__optionLineOne'>Your</span>
          <span className='header__optionLineTwo'>Prime</span>
        </div>
      </div>
      {/* Basket Icon */}
      <Link to='/checkout'>
        <div className='header__optionBasket'>
          <ShoppingBasketIcon />
          <span className='header__optionLineTwo header__basketCount'>{basket?.length}</span>
        </div>
      </Link>

    </div>
  )
}

export default Header;

//We change the hard-coded zero to length(size) of basket
//?. -> Optional Chaining ... The operator allows you to traverse through a nested object to get the value of variables without worrying if any of those will be undefined.
//If we dont have correct value i.e basket comes undefined , JS does not throw an error

//After authentication ,getting name to popup in the checkout page/header