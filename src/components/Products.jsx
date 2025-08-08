// Products: fetches list and renders ProductCard tiles
// Augments a few items to demonstrate variants and OOS behaviors for test coverage
import React, { useState, useEffect, useRef } from "react";
import ProductCard from "./ProductCard";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const Products = () => {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState(data);
  const [loading, setLoading] = useState(false);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    const getProducts = async () => {
      setLoading(true);
      const response = await fetch("https://fakestoreapi.com/products/");
      const raw = await response.json();

      // Add demo variants and stock states so UI states are visible
      const augment = (list) =>
        list.map((p, idx) => {
          const base = { ...p };
          if (idx === 0) {
            // First card: plain product (no variants), ensure Add to Cart is available
            base.stock = 10;
          } else if (idx === 1) {
            // Out of stock card
            base.stock = 0;
          } else if (idx === 2) {
            // Material variants (no color, since image doesn't change)
            base.material = [
              { name: "Cotton", price: p.price, stock: 6 },
              { name: "Wool", price: p.price + 12, stock: 3 },
              { name: "Silk", price: p.price + 25, stock: 0 },
            ];
            base.stock = 9;
          } else if (idx === 3) {
            // Size variants with explicit prices and stock
            base.size = [
              { name: "XS", price: Math.max(0, p.price - 8), stock: 4 },
              { name: "S", price: Math.max(0, p.price - 4), stock: 6 },
              { name: "M", price: p.price, stock: 8 },
              { name: "L", price: p.price + 8, stock: 5 },
              { name: "XL", price: p.price + 14, stock: 2 },
            ];
            base.stock = 25;
          } else if (idx === 4) {
            // All variants OOS -> should show global Out of Stock
            base.variants = [
              { name: "32GB", price: p.price, stock: 0 },
              { name: "64GB", price: p.price + 10, stock: 0 },
            ];
            base.stock = 10; // product-level positive but all variants zero
          } else if (idx === 5) {
            // Memory configuration variants (clarity over "GB GB")
            base.storage = [
              { name: "64 GB", price: p.price, stock: 4 },
              { name: "128 GB", price: p.price + 30, stock: 3 },
              { name: "256 GB", price: p.price + 80, stock: 1 },
            ];
            base.stock = 8;
          } else if (idx === 6) {
            // Edition type with clear price deltas
            base.variant = [
              { name: "Standard", deltaPrice: 0, stock: 10 },
              { name: "Plus", deltaPrice: 15, stock: 6 },
              { name: "Pro", deltaPrice: 40, stock: 0 },
            ];
            base.stock = 16;
          }
          return base;
        });

      if (isMountedRef.current) {
        const augmented = augment(raw);
        setData(augmented);
        setFilter(augmented);
        setLoading(false);
      }
    };

    getProducts();
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const Loading = () => {
    return (
      <>
        <div className="col-12 py-5 text-center">
          <Skeleton height={40} width={560} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
      </>
    );
  };

  const filterProduct = (cat) => {
    const updatedList = data.filter((item) => item.category === cat);
    setFilter(updatedList);
  };

  const ShowProducts = () => {
    return (
      <>
        <div className="buttons text-center py-5">
          <button
            className="btn btn-outline-dark btn-sm m-2"
            onClick={() => setFilter(data)}
          >
            All
          </button>
          <button
            className="btn btn-outline-dark btn-sm m-2"
            onClick={() => filterProduct("men's clothing")}
          >
            Men's Clothing
          </button>
          <button
            className="btn btn-outline-dark btn-sm m-2"
            onClick={() => filterProduct("women's clothing")}
          >
            Women's Clothing
          </button>
          <button
            className="btn btn-outline-dark btn-sm m-2"
            onClick={() => filterProduct("jewelery")}
          >
            Jewelery
          </button>
          <button
            className="btn btn-outline-dark btn-sm m-2"
            onClick={() => filterProduct("electronics")}
          >
            Electronics
          </button>
        </div>

        {filter.map((product) => (
          <div id={product.id} key={product.id} className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
            <ProductCard product={product} currency="USD" />
          </div>
        ))}
      </>
    );
  };
  return (
    <>
      <div className="container my-3 py-3">
        <div className="row">
          <div className="col-12">
            <h2 className="display-5 text-center">Latest Products</h2>
            <hr />
          </div>
        </div>
        <div className="row justify-content-center">
          {loading ? <Loading /> : <ShowProducts />}
        </div>
      </div>
    </>
  );
};

export default Products;
