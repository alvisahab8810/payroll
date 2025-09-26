import React from "react";
import Link from "next/link";

export default function Topbar() {
  return (
    <div>
      <nav className="main-nav navbar navbar-expand-lg bg-white ">
        <div className="container-fluid">
          {/* Logo */}
          <Link className="navbar-brand d-flex align-items-center" href="/">
            <img src="/assets/images/logo.png" alt="Logo" className="me-2" />
          </Link>

          {/* Toggle for mobile */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Nav Links */}
          <div
            className="collapse navbar-collapse justify-content-center"
            id="navbarNav"
          ></div>

          {/* Right Side Icons */}

          <div className="right-side">
            <ul className="navbar-nav gap-3">
              <li className="nav-item">
                <Link
                  className="nav-link active"
                  href="/"
                >
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link "
                  href="/products"
                >
                  Products
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link "
                  href="/contact"
                >
                  Contact Us
                </Link>
              </li>
            </ul>

            <div className="d-flex align-items-center gap-3">
              <Link
                href="#"
                className="cart-btn position-relative"
              >
                <img src="/assets/images/icons/cart.png " alt="Cart Icon"></img>{" "}
                Cart
                <span className="items-count">
                  2
                </span>
              </Link>
              <Link
                href="#"
                className="top-btn"
              >
                <img
                  src="/assets/images/icons/wishlist.png "
                  alt="Wishlist Icon"
                ></img>
              </Link>
              <Link
                href="#"
                className="top-btn"
              >
                <img src="/assets/images/icons/user.png " alt="User Icon"></img>
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
