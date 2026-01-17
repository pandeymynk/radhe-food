import React, { useEffect, useState } from "react";
import { useState as useReactState } from "react";
import "./App.css";
import Splash from "./Splash";

function App() {
  // All hooks must be at the top level
  const [notFound, setNotFound] = useReactState(false);
  // Static menu for client-only app
  const [menu] = useState([
    { id: 1, name: "Roti", price: 10 },
    { id: 2, name: "Rice", price: 30 },
    { id: 3, name: "Aalu Paratha", price: 25 },
    { id: 4, name: "Paneer Paratha", price: 40 },
    { id: 5, name: "Sabji", price: 35 },
  ]);
  const [cart, setCart] = useState([]);
  const [customer, setCustomer] = useState({
    name: "",
    address: "",
    phone: "",
  });
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [page, setPage] = useState("home");

  // Listen for hash changes (simulate routing)
  useEffect(() => {
    const onHashChange = () => {
      if (window.location.hash && window.location.hash !== "#/") {
        setNotFound(true);
      } else {
        setNotFound(false);
      }
    };
    window.addEventListener("hashchange", onHashChange);
    onHashChange();
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  // No API call needed for menu

  const addToCart = (item) => setCart([...cart, item]);
  const handleInputChange = (e) =>
    setCustomer({ ...customer, [e.target.name]: e.target.value });

  const placeOrder = () => {
    if (
      !customer.name ||
      !customer.address ||
      !customer.phone ||
      cart.length === 0
    )
      return;
    // Simulate order placement
    setOrderPlaced(true);
    setCart([]);
    // Optionally, show a WhatsApp link or confirmation
    // window.open(`https://wa.me/919816699164?text=Order%20placed!`);
  };

  if (showSplash) return <Splash onFinish={() => setShowSplash(false)} />;
  if (notFound) {
    return (
      <div
        className="radhe-container"
        style={{ textAlign: "center", paddingTop: 60 }}
      >
        <div style={{ fontSize: 48, fontWeight: 700, color: "#c0392b" }}>
          404.
        </div>
        <div style={{ fontSize: 24, margin: "16px 0" }}>
          This page
          <br />
          doesn't exist.
        </div>
        <button
          className="place-order-btn"
          style={{ maxWidth: 200 }}
          onClick={() => {
            window.location.hash = "/";
            setNotFound(false);
          }}
        >
          Return home
        </button>
      </div>
    );
  }

  // Calculate total amount
  const totalAmount = cart.reduce((sum, item) => sum + (item.price || 0), 0);

  return (
    <div className="radhe-container">
      {/* Navigation Menu */}
      <nav
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 24,
          marginBottom: 18,
        }}
      >
        <button
          style={{
            background: "none",
            border: "none",
            color: page === "home" ? "#27ae60" : "#333",
            fontWeight: 600,
            fontSize: 16,
            cursor: "pointer",
          }}
          onClick={() => setPage("home")}
        >
          Home
        </button>
        <button
          style={{
            background: "none",
            border: "none",
            color: page === "about" ? "#27ae60" : "#333",
            fontWeight: 600,
            fontSize: 16,
            cursor: "pointer",
          }}
          onClick={() => setPage("about")}
        >
          About Us
        </button>
      </nav>
      <div className="radhe-title">Radhe Foods</div>
      {page === "about" ? (
        <div style={{ textAlign: "center", marginTop: 32, fontSize: 18 }}>
          <h2>About Us</h2>
          <p>
            Welcome to Radhe Foods! We serve delicious, fast, and local food
            with love. Our menu is crafted to bring you the best taste at
            affordable prices. Thank you for choosing us!
          </p>
        </div>
      ) : (
        <>
          <div className="radhe-section">
            <h2>Menu</h2>
            <ul className="menu-list">
              {menu.map((item) => (
                <li className="menu-item" key={item.id}>
                  <span>
                    {item.name} - ₹{item.price}
                  </span>
                  <button onClick={() => addToCart(item)}>Add</button>
                </li>
              ))}
            </ul>
          </div>
          <div className="radhe-section">
            <h2>Cart</h2>
            <ul className="cart-list">
              {cart.map((item, idx) => (
                <li key={idx}>
                  {item.name} - ₹{item.price}
                </li>
              ))}
            </ul>
            {/* Show total amount */}
            <div style={{ fontWeight: 600, marginTop: 8, fontSize: 17 }}>
              Total Amount: ₹{totalAmount}
            </div>
          </div>
          <div className="radhe-section">
            <h2>Customer Details</h2>
            <div className="input-row">
              <input
                name="name"
                placeholder="Name"
                value={customer.name}
                onChange={handleInputChange}
              />
              <input
                name="address"
                placeholder="Address"
                value={customer.address}
                onChange={handleInputChange}
              />
              <input
                name="phone"
                placeholder="Phone"
                value={customer.phone}
                onChange={handleInputChange}
              />
            </div>
            <button className="place-order-btn" onClick={placeOrder}>
              Place Order (COD)
            </button>
            {orderPlaced && (
              <div className="order-success">
                Order placed! You will be contacted soon.
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default App;
