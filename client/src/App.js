import React, { useState, useEffect } from "react";
// Floating cart button scrolls to cart
// ...existing code...
// (No code should follow after the main return statement)

function App() {
  const [page, setPage] = useState("menu");
  const [cart, setCart] = useState([]);
  const [formError, setFormError] = useState("");
  const [customer, setCustomer] = useState({
    name: "",
    address: "",
    phone: "",
  });
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [toast, setToast] = useState("");
  const [orderHistory, setOrderHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("radhe_order_history") || "[]");
    } catch {
      return [];
    }
  });

  // Calculate subtotal, delivery charge, and total
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * (item.qty || 1),
    0,
  );
  const deliveryCharge = subtotal > 0 && subtotal < 199 ? 50 : 0;
  const totalAmount = subtotal + deliveryCharge;

  // Add item to cart
  const addToCart = (item) => {
    setCart((prevCart) => {
      const idx = prevCart.findIndex((i) => i.name === item.name);
      if (idx > -1) {
        // Already in cart, increase qty
        const updated = [...prevCart];
        updated[idx].qty = (updated[idx].qty || 1) + 1;
        return updated;
      } else {
        return [...prevCart, { ...item, qty: 1 }];
      }
    });
    setToast(`${item.name} added to cart!`);
    setTimeout(() => setToast(""), 1500);
  };

  // Change quantity in cart
  const changeCartQty = (idx, delta) => {
    setCart((prevCart) => {
      const updated = [...prevCart];
      updated[idx].qty = (updated[idx].qty || 1) + delta;
      if (updated[idx].qty < 1) updated[idx].qty = 1;
      return updated;
    });
  };

  // Remove item from cart
  const removeFromCart = (idx) => {
    setCart((prevCart) => prevCart.filter((_, i) => i !== idx));
  };

  // Handle input change for customer details
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomer((prev) => ({ ...prev, [name]: value }));
  };

  // Place order handler (frontend only)
  const placeOrder = () => {
    // Validate
    if (
      !customer.name ||
      !customer.address ||
      !customer.phone ||
      cart.length === 0
    ) {
      setFormError("Please fill all details and add items to cart.");
      return;
    }
    // Generate WhatsApp message
    const ADMIN_WHATSAPP = "919816699164";
    let orderMsg =
      `Order from ${customer.name} (+91${customer.phone}):\n` +
      cart
        .map((i) => i.name + " - ₹" + i.price + (i.qty > 1 ? ` x${i.qty}` : ""))
        .join("\n");
    if (deliveryCharge > 0) {
      orderMsg += `\nDelivery Charge - ₹${deliveryCharge}`;
    }
    orderMsg += `\nTotal: ₹${totalAmount}`;
    orderMsg += `\nAddress: ${customer.address}`;
    const waUrl = `https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent(orderMsg)}`;
    // Create order object
    const order = {
      id: Date.now(),
      items: cart.map((i) => ({ name: i.name, price: i.price, qty: i.qty })),
      customer: { ...customer },
      time: new Date().toISOString(),
      waUrl,
      deliveryCharge,
      subtotal,
      totalAmount,
    };
    setOrderPlaced(true);
    setCart([]);
    setOrderHistory((prev) => {
      const updated = [order, ...prev];
      localStorage.setItem("radhe_order_history", JSON.stringify(updated));
      return updated;
    });
    window.open(waUrl, "_blank");
    setTimeout(() => setOrderPlaced(false), 3000);
  };
  // Phone validation: 10 digits, starts with 6-9
  const validatePhone = (phone) => /^([6-9][0-9]{9})$/.test(phone);
  // Auto-format phone: only digits
  const handlePhoneInput = (e) => {
    const val = e.target.value.replace(/\D/g, "");
    setCustomer({ ...customer, phone: val });
  };
  const [darkMode, setDarkMode] = useState(false);
  const [search, setSearch] = useState("");
  // ...your state and handler hooks here...
  // Modern, categorized menu with popular items
  // Category icons
  const categoryIcons = {
    "Veg Thali": "🥗",
    Paratha: "🫓",
    "Main Course": "🍲",
    "Fast Food & Snacks": "🍔",
    Beverages: "🥤",
    "Packaged Snacks": "🍪",
    Others: "🍽️",
  };
  const [menu] = useState([
    {
      category: "Veg Thali",
      items: [
        {
          name: "Veg Thali",
          price: 120,
          details:
            "Dal, Kadhi, Paneer Sabzi, Raita, Salad, Papad, Rice, 3 Rotis",
          popular: true,
        },
      ],
    },
    {
      category: "Paratha",
      items: [
        { name: "Aloo Paratha (with curd)", price: 30, popular: true },
        { name: "Mix Paratha (with curd)", price: 40 },
      ],
    },
    {
      category: "Main Course",
      items: [
        { name: "Kadai Paneer", price: 150, popular: true },
        { name: "Dal Fry", price: 90 },
        { name: "Kashmiri Dum Aloo", price: 130 },
        { name: "Mix Veg", price: 120 },
      ],
    },
    {
      category: "Fast Food & Snacks",
      items: [
        { name: "Veg Burger", price: 30, popular: true },
        { name: "Grilled Sandwich", price: 40 },
        { name: "Spring Roll (1 Plate)", price: 50 },
        { name: "Masala Dosa", price: 60, popular: true },
        { name: "Chilla", price: 50 },
        { name: "Upma", price: 50 },
        { name: "Uttapam", price: 50 },
      ],
    },
    {
      category: "Beverages",
      items: [
        { name: "Cold Drink (250 ml)", price: 20 },
        { name: "Cold Drink (500 ml)", price: 35 },
        { name: "Mineral Water", price: 20 },
        { name: "Tea", price: 10 },
        { name: "Coffee", price: 20 },
      ],
    },
    {
      category: "Packaged Snacks",
      items: [
        { name: "Kurkure", price: 20 },
        { name: "Lays Chips", price: 20 },
        { name: "Biscuit Packet", price: 10 },
      ],
    },
    {
      category: "Others",
      items: [{ name: "Roti", price: 7 }],
    },
  ]);

  return (
    <div className={darkMode ? "radhe-container dark" : "radhe-container"}>
      {/* Header */}
      <header className="radhe-header">
        <div className="radhe-title">
          <span role="img" aria-label="logo" style={{ fontSize: 32 }}>
            🍽️
          </span>{" "}
          Radhe Foods
        </div>
        <button
          className="icon-btn"
          aria-label="Toggle dark mode"
          onClick={() => setDarkMode((d) => !d)}
        >
          {darkMode ? "🌙" : "☀️"}
        </button>
        <button
          className="icon-btn"
          aria-label="About Us"
          onClick={() => setPage("about")}
        >
          ℹ️
        </button>
      </header>

      <main className="radhe-main">
        {page === "about" ? (
          <section className="about-section">
            <h2
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                justifyContent: "center",
              }}
            >
              <span role="img" aria-label="logo">
                🍽️
              </span>{" "}
              Radhe Foods
            </h2>
            <p>
              Welcome to Radhe Foods! We serve delicious, fast, and local food
              with love.
              <br />
              <b>⏰ Timings:</b> 9:00 AM – 9:00 PM
              <br />
              <b>Minimum order:</b> 30 minutes notice
              <br />
              <b>Free delivery:</b> on orders above ₹199
              <br />
              <b>Delivery radius:</b> within 2 km
              <br />
              <b>Delivery charge:</b> ₹50 (below ₹199)
            </p>
            <button className="icon-btn" onClick={() => setPage("menu")}>
              🍴 Menu
            </button>
          </section>
        ) : (
          <>
            <section className="radhe-section">
              <h2 style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span role="img" aria-label="menu">
                  📋
                </span>{" "}
                Menu
              </h2>
              <input
                type="text"
                placeholder="Search menu..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="search-input"
              />
              <div className="menu-categories">
                {menu.map((cat, idx) => {
                  // Filter items by search
                  const filteredItems = cat.items.filter((item) =>
                    item.name.toLowerCase().includes(search.toLowerCase()),
                  );
                  if (filteredItems.length === 0) return null;
                  return (
                    <div className="menu-category" key={cat.category}>
                      <div className="menu-category-title">
                        <span style={{ fontSize: 22, marginRight: 6 }}>
                          {categoryIcons[cat.category] || "🍽️"}
                        </span>
                        {cat.category}
                      </div>
                      <ul className="menu-list">
                        {filteredItems.map((item, i) => (
                          <li className="menu-item" key={item.name}>
                            <span>
                              {item.name}{" "}
                              {item.popular && (
                                <span
                                  style={{
                                    color: "#e67e22",
                                    fontWeight: 700,
                                    fontSize: "0.95em",
                                    marginLeft: 4,
                                  }}
                                  title="Popular"
                                >
                                  ⭐
                                </span>
                              )}{" "}
                              <span
                                style={{ color: "#27ae60", fontWeight: 600 }}
                              >
                                ₹{item.price}
                              </span>
                              {item.details && (
                                <div className="menu-item-details">
                                  {item.details}
                                </div>
                              )}
                            </span>
                            <button
                              className="add-btn"
                              onClick={() =>
                                addToCart({ ...item, category: cat.category })
                              }
                            >
                              ➕ Add
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
                {/* If no items match search, show message */}
                {menu.every(
                  (cat) =>
                    cat.items.filter((item) =>
                      item.name.toLowerCase().includes(search.toLowerCase()),
                    ).length === 0,
                ) && <div className="no-items-msg">No menu items found.</div>}
              </div>
            </section>
            <section className="radhe-section">
              <h2 style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span role="img" aria-label="cart">
                  🛒
                </span>{" "}
                Cart
              </h2>
              <ul className="cart-list">
                {cart.length === 0 && (
                  <li className="cart-empty">Cart is empty</li>
                )}
                {cart.map((item, idx) => (
                  <li className="cart-item" key={idx}>
                    <span>
                      {item.name}{" "}
                      <span className="cart-qty">× {item.qty || 1}</span>{" "}
                      <span className="cart-price">
                        ₹{item.price * (item.qty || 1)}
                      </span>
                    </span>
                    <span className="cart-actions">
                      <button
                        className="qty-btn"
                        onClick={() => changeCartQty(idx, -1)}
                      >
                        -
                      </button>
                      <span className="cart-qty-num">{item.qty || 1}</span>
                      <button
                        className="qty-btn"
                        onClick={() => changeCartQty(idx, 1)}
                      >
                        +
                      </button>
                      <button
                        className="remove-btn"
                        onClick={() => removeFromCart(idx)}
                      >
                        🗑️
                      </button>
                    </span>
                  </li>
                ))}
              </ul>
              <div className="cart-total">
                <span>Subtotal:</span>
                <span className="cart-total-amt">₹{subtotal}</span>
              </div>
              {deliveryCharge > 0 && (
                <div className="cart-total">
                  <span>Delivery Charge:</span>
                  <span className="cart-total-amt">₹{deliveryCharge}</span>
                </div>
              )}
              <div className="cart-total" style={{ fontWeight: 800 }}>
                <span>Total Amount:</span>
                <span className="cart-total-amt">₹{totalAmount}</span>
              </div>
            </section>
            <section className="radhe-section">
              <h2 style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span role="img" aria-label="customer">
                  👤
                </span>{" "}
                Customer Details
              </h2>
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
                  onChange={handlePhoneInput}
                  maxLength={10}
                  style={{
                    borderColor:
                      formError && !validatePhone(customer.phone)
                        ? "#c0392b"
                        : undefined,
                  }}
                />
              </div>
              <button
                className="place-order-btn"
                onClick={() => {
                  if (!customer.name || !customer.address || !customer.phone) {
                    setFormError("Please fill all details.");
                    return;
                  }
                  if (!validatePhone(customer.phone)) {
                    setFormError("Enter a valid 10-digit phone number.");
                    return;
                  }
                  setFormError("");
                  placeOrder();
                }}
              >
                🚚 Place Order (COD)
              </button>
              {formError && <div className="form-error">{formError}</div>}
              {orderPlaced && (
                <div className="order-success">
                  ✅ Order placed! WhatsApp will open for confirmation.
                </div>
              )}
            </section>
          </>
        )}
      </main>
      {/* Order History Section */}
      {orderHistory.length > 0 && (
        <section className="radhe-section">
          <h2 style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span role="img" aria-label="history">
              🕑
            </span>{" "}
            Order History
          </h2>
          <ul className="cart-list">
            {orderHistory.map((order, idx) => (
              <li className="cart-item" key={order.id || idx}>
                <div>
                  <b>Order #{order.id}</b> <br />
                  {order.items &&
                    order.items.map((item, i) => (
                      <span key={i}>
                        {item.name} - ₹{item.price}
                        {i < order.items.length - 1 ? ", " : ""}
                      </span>
                    ))}
                  <br />
                  <span style={{ fontSize: "0.95em" }}>
                    To: {order.customer?.name} ({order.customer?.phone})
                  </span>
                  <br />
                  <span style={{ fontSize: "0.95em" }}>
                    At: {order.customer?.address}
                  </span>
                  <br />
                  <span style={{ fontSize: "0.9em", color: "#888" }}>
                    {order.time ? new Date(order.time).toLocaleString() : ""}
                  </span>
                </div>
                {order.waUrl && (
                  <a
                    href={order.waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="icon-btn"
                    title="Send to WhatsApp"
                  >
                    📲
                  </a>
                )}
              </li>
            ))}
          </ul>
          <button
            className="icon-btn"
            style={{ marginTop: 12 }}
            onClick={() => {
              localStorage.removeItem("radhe_order_history");
              setOrderHistory([]);
            }}
          >
            🗑️ Clear History
          </button>
        </section>
      )}
      {/* Toast/snackbar */}
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

export default App;
