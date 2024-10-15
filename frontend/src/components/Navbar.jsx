/* eslint-disable no-unused-vars */
import React, {useState} from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

import CartModal from '../pages/shop/CartModal'

const Navbar = () => {

  const products = useSelector((state) => state.cart.products);
  const [isCartOpen, setisCartOpen] = useState(false);


  const handleCartToggle = () => {
    setisCartOpen(!isCartOpen);
  }

  return (
    <header className='fixed-nav-bar w-nav'>
      <nav className='max-w-screen2x1 mx-auto px-4 flex justify-between items-center'>
        <ul className='nav__links'>
          <li className='link'>
            <Link to='/'>Home</Link>
          </li>
          <li className='link'>
            <Link to='/shop/'>Shop</Link>
          </li>
          <li className='link'>
            <Link to='/pages'>Pages</Link>
          </li>
          <li className='link'>
            <Link to='/contact'>Contact</Link>
          </li>
        </ul>

        <div className='nav__logo'>
          <Link to='/'>
            <span>Showars</span>
          </Link>
        </div>

        <div className='nav__icons relative'>
          <span>
            <Link to='/search'>
              <i className='ri-search-line'></i>
            </Link>
          </span>

          <span>
            <button onClick={handleCartToggle} className='hover:text-primary'>
              <i className='ri-shopping-cart-line'></i>
              <sup className='text-sm inline-block px-1.5 text-center bg-primary text-white rounded-full'>{products.length}</sup>
            </button>
          </span>

          <span>
            <Link to='/login'>
              <i className='ri-account-circle-line'></i>
            </Link>
          </span>
        </div>
      </nav>

      {
        isCartOpen && <CartModal products={products} isOpen={isCartOpen} onClose={handleCartToggle } />
      }
    </header>
  );
}

export default Navbar