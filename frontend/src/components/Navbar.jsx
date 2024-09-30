/* eslint-disable no-unused-vars */
import React from 'react'
import { link } from 'react-router-dom'

const Navbar = () => {
  return (
    <header className='fixed-nav-bar w-nav'>
      <nav className='max-w-screen2x1 mx-auto px-4 flex justify-between items-center'>
        <ul className='nav__links'>
          <li className='link'>
            <link to="/">Home</link>
          </li>
          <li className="link">
            <link to="/shop">Shop</link>
          </li>
          <li className="link">
            <link to="/pages">Pages</link>
          </li>
          <li className="link">
            <link to="/contact">Contact</link>
          </li>
        </ul>

        <div className="nav__logo">
          <link to="/">
            <span>showars</span>
          </link>
        </div>

        <div className="nav__icons relative">
          <span>
            <link>
              <i className="ri-search-line"></i>
            </link>
          </span>

          <span>
            <button className="hover:text">
              <i className="ri-shopping-cart-line"></i>
            </button>
          </span>

          <span>
            <button className="hover:text">
              <i className="ri-account-circle-line"></i>
            </button>
          </span>
        </div>
      </nav>
    </header>
  );
}

export default Navbar