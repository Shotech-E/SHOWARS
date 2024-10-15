/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import productsData from "../../data/products.json";
import ProductCards from "../shop/ProductCards";
import ShopFiltering from "./ShopFiltering";

const filters = {
  categories: ["all", "accessories", "dress", "jewelry", "cosmetics"],
  colours: ["all", "black", "red", "gold", "blue", "green", "beige", "silver"],
  priceRanges: [
    { label: "Under $50", min: 0, max: 50 },
    { label: " $50 - $100", min: 50, max: 100 },
    { label: " $100 - $200", min: 100, max: 200 },
    { label: "$200 and above", min: 200, max: Infinity },
  ],
};

const ShopPage = () => {
  const [products, setProducts] = useState(productsData);
  const [filtersState, setFiltersState] = useState({
    category: "all",
    colour: "all",
    priceRange: "",
  });

  // Filter Function
  const applyFilters = () => {
    let filteredProducts = productsData;

    // Filter by category
    if (filtersState.category && filtersState.category !== "all") {
      filteredProducts = filteredProducts.filter(
        (product) => product.category === filtersState.category
      );
    }

    // Filter by Colour
    if (filtersState.colour && filtersState.colour !== "all") {
      filteredProducts = filteredProducts.filter(
        (product) => product.colour === filtersState.colour
      );
    }

    // Filter by Price Range
    if (filtersState.priceRange) {
      const [minPrice, maxPrice] = filtersState.priceRange
        .split("-")
        .map(Number);
      filteredProducts = filteredProducts.filter(
        (product) => product.price >= minPrice && product.price <= maxPrice
      );
    }

    setProducts(filteredProducts);
  };

  useEffect(() => {
    applyFilters();
  }, [filtersState]);

  // Clear the filter
  const clearFilters = () => {
    setFiltersState({
      category: "all",
      colour: "all",
      priceRange: "",
    });
  };
  return (
    <>
      <section className="section__container bg-primary-light">
        <h2 className="section__header capitalize">Shop Page</h2>
        <p className="section__subheader">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime quas
          accusantium quod iure repellat, nemo numquam ex exercitationem, ullam
          id officiis accusamus minus facilis similique magnam architecto
          molestiae, soluta obcaecati!
        </p>
      </section>
      <section className="section__container">
        {/* Left Side */}
        <div className="flex flex-col md:flex-row md:gap-12 gap-8">
          <ShopFiltering
            filters={filters}
            filtersState={filtersState}
            setFiltersState={setFiltersState}
            clearFilters={clearFilters}
          />

          {/* Right Side */}
          <div>
            <h3 className="text-xl font-medium mb-4">
              Products Available: {products.length}
            </h3>
            <ProductCards products={products} />
          </div>
        </div>
      </section>
    </>
  );
};

export default ShopPage;
