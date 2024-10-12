/* eslint-disable no-unused-vars */
import React from "react";
import { Link } from "react-router-dom";
import RatingStars from "../../../components/RatingStars";

// import productImg from "../../assets/product-1.png";

const SingleProduct = () => {
  return (
    <>
      <section className="section__container bg-primary-light">
        <h2 className="section header capitalize">Single Product page</h2>
        <div>
          <span>
            <Link to="/">Home</Link>
          </span>
          <i className="ri-arrow-right-s-line"></i>
          <span>
            <Link to="/shop">Shop</Link>
          </span>
          <i className="ri-arrow-right-s-line"></i>
          <span className="hover:text-primary">Product Name</span>
        </div>
      </section>
      <section className="section__container mt-8">
        <div className="flex flex-col items-center md:flex-row gap-8">
          {/* Product Image */}
          <div className="md:w-1/2 w-full">
            <img
              src="https://plus.unsplash.com/premium_photo-1664298355914-bc65d2c9af64?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Single Product Image"
              className="rounded-md:w-1/2 w-full h-auto"
            />
          </div>
          <div className="md:w-1/2 w-full">
            <h3 className="text-2xl font-semibold mb-4">Product Name</h3>
            <p className="text-xl text-primary mb-8">
              $100 <s>$130</s>
            </p>
            <p>This is a description of the product.</p>

            {/* Additional Product Info */}
            <div>
              <p>
                <strong>Category: </strong>Accessories
              </p>
              <p>
                <strong>Colour: </strong>Green
              </p>
              <div className="flex gap-1 items-center">
                <strong>Rating: </strong>
                <RatingStars rating={"4.5"} />
              </div>
              <button className="mt-6 px-6 py-3 bg-primary text-white rounded-md">
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </section>
      {/* Display Reviews */}
      <section className="section__container mt-8">
        <h3>Reviews</h3>
        <div></div>
      </section>
    </>
  );
};

export default SingleProduct;
