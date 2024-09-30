import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <header className='fixed-nav-bar w-nav'>
      <nav className='max-w-screen2x1 mx-auto px-4 flex justify-between items-center'>
        <ul className='nav__Links'>
          <li className='Link'>
            <Link to='/'>Home</Link>
          </li>
          <li className='Link'>
            <Link to='/shop'>Shop</Link>
          </li>
          <li className='Link'>
            <Link to='/pages'>Pages</Link>
          </li>
          <li className='Link'>
            <Link to='/contact'>Contact</Link>
          </li>
        </ul>

        <div className='nav__logo'>
          <Link to='/'>
            <span>showars</span>
          </Link>
        </div>

        <div className='nav__icons relative'>
          <span>
            <Link>
              <i className='ri-search-line'></i>
            </Link>
          </span>

          <span>
            <button className='hover:text'>
              <i className='ri-shopping-cart-line'></i>
            </button>
          </span>

          <span>
            <button className='hover:text'>
              <i className='ri-account-circle-line'></i>
            </button>
          </span>
        </div>
      </nav>
    </header>
  );
}

export default Navbar