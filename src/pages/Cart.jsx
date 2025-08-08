// Cart page: displays line items, unified-currency pricing, and order summary
import React from "react";
import { Footer, Navbar } from "../components";
import { useSelector, useDispatch } from "react-redux";
import { addCart, delCart } from "../redux/action";
import { Link } from "react-router-dom";
import { formatPrice } from "../utils/formatPrice";

const Cart = () => {
  const state = useSelector((state) => state.handleCart);
  const dispatch = useDispatch();

  const EmptyCart = () => {
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-12 py-5 bg-light text-center">
            <h4 className="p-3 display-5"> Your Cart is Empty </h4>
            <Link to="/" className="btn  btn-outline-dark mx-4">
              <i className="fa fa-arrow-left"></i> Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  };

  const addItem = (product) => {
    dispatch(addCart(product));
  };
  const removeItem = (product) => {
    dispatch(delCart(product));
  };

  const ShowCart = () => {
    let subtotal = 0;
    let shipping = 30.0;
    let totalItems = 0;
    const cartCurrency = state[0]?.currency || 'USD';
    state.map((item) => {
      return (subtotal += (Number(item.price) || 0) * item.qty);
    });

    state.map((item) => {
      return (totalItems += item.qty);
    });
    return (
      <>
        <section className="h-100 gradient-custom">
          <div className="container py-5">
            <div className="row d-flex justify-content-center my-4">
              <div className="col-md-8">
                <div className="card mb-4">
                  <div className="card-header py-3">
                    <h5 className="mb-0">Item List</h5>
                  </div>
                  <div className="card-body">
                        {state.map((item) => {
                      return (
                        <div key={item.id}>
                          <div className="row d-flex align-items-center">
                            <div className="col-lg-3 col-md-12">
                              <div
                                className="bg-image rounded"
                                data-mdb-ripple-color="light"
                              >
                                <img
                                  src={item.image}
                                  // className="w-100"
                                  alt={item.title}
                                  width={100}
                                  height={75}
                                />
                              </div>
                            </div>

                            <div className="col-lg-5 col-md-6">
                              <p className="mb-1">
                                <strong>{item.title}</strong>
                              </p>
                              {item.variantLabel && (
                                <p className="text-muted mb-0">Variant: {item.variantLabel}</p>
                              )}
                            </div>

                            <div className="col-lg-4 col-md-6">
                              <div
                                className="d-flex align-items-center mb-4"
                                style={{ maxWidth: "240px", gap: 8 }}
                              >
                                <button
                                  className="btn btn-outline-secondary btn-sm"
                                  aria-label="Decrease quantity"
                                  onClick={() => {
                                    removeItem(item);
                                  }}
                                >
                                  <i className="fa fa-minus"></i>
                                </button>

                                <span
                                  className="px-3 py-1 border-top border-bottom"
                                  style={{ minWidth: 36, textAlign: "center", lineHeight: 1.2 }}
                                >
                                  {item.qty}
                                </span>

                                <button
                                  className="btn btn-outline-secondary btn-sm"
                                  aria-label="Increase quantity"
                                  onClick={() => {
                                    addItem(item);
                                  }}
                                >
                                  <i className="fa fa-plus"></i>
                                </button>
                              </div>

                              <div className="text-start text-md-center">
                                <strong>
                                  <span className="text-muted">{item.qty}</span>{" "}
                                  x {formatPrice(Number(item.price) || 0, { currency: cartCurrency })}
                                </strong>
                              </div>
                            </div>
                          </div>

                          <hr className="my-4" />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card mb-4">
                  <div className="card-header py-3 bg-light">
                    <h5 className="mb-0">Order Summary</h5>
                  </div>
                  <div className="card-body">
                    <ul className="list-group list-group-flush">
                      <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 pb-0">
                        Products ({totalItems})
                        <span>{formatPrice(Math.round(subtotal), { currency: cartCurrency })}</span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                        Shipping
                        <span>{formatPrice(shipping, { currency: cartCurrency })}</span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 mb-3">
                        <div>
                          <strong>Total amount</strong>
                        </div>
                        <span>
                          <strong>{formatPrice(Math.round(subtotal + shipping), { currency: cartCurrency })}</strong>
                        </span>
                      </li>
                    </ul>

                    <Link
                      to="/checkout"
                      className="btn btn-dark btn-lg btn-block"
                    >
                      Go to checkout
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  };

  return (
    <>
      <Navbar />
      <div className="container my-3 py-3">
        <h1 className="text-center">Cart</h1>
        <hr />
        {state.length > 0 ? <ShowCart /> : <EmptyCart />}
      </div>
      <Footer />
    </>
  );
};

export default Cart;
