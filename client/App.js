import React, { useEffect, useState } from 'react';

function App() {
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]);
  const [customer, setCustomer] = useState({ name: '', address: '', phone: '' });
  const [orderPlaced, setOrderPlaced] = useState(false);

  useEffect(() => {
    fetch('http://localhost:5000/api/menu')
      .then(res => res.json())
      .then(setMenu);
  }, []);

  const addToCart = (item) => {
    setCart([...cart, item]);
  };

  const handleInputChange = (e) => {
    setCustomer({ ...customer, [e.target.name]: e.target.value });
  };

  const placeOrder = async () => {
    if (!customer.name || !customer.address || !customer.phone || cart.length === 0) return;
    await fetch('http://localhost:5000/api/order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: cart, customer })
    });
    setOrderPlaced(true);
    setCart([]);
  };

  return (
    <div style={{ maxWidth: 480, margin: 'auto', padding: 16, fontFamily: 'sans-serif' }}>
      <h1>Radhe Foods</h1>
      <h2>Menu</h2>
      <ul style={{ padding: 0 }}>
        {menu.map(item => (
          <li key={item.id} style={{ listStyle: 'none', marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>{item.name} - ₹{item.price}</span>
            <button onClick={() => addToCart(item)} style={{ padding: '4px 12px' }}>Add</button>
          </li>
        ))}
      </ul>
      <h2>Cart</h2>
      <ul style={{ padding: 0 }}>
        {cart.map((item, idx) => (
          <li key={idx} style={{ listStyle: 'none' }}>{item.name} - ₹{item.price}</li>
        ))}
      </ul>
      <h2>Customer Details</h2>
      <input name="name" placeholder="Name" value={customer.name} onChange={handleInputChange} style={{ width: '100%', marginBottom: 8 }} />
      <input name="address" placeholder="Address" value={customer.address} onChange={handleInputChange} style={{ width: '100%', marginBottom: 8 }} />
      <input name="phone" placeholder="Phone" value={customer.phone} onChange={handleInputChange} style={{ width: '100%', marginBottom: 8 }} />
      <button onClick={placeOrder} style={{ width: '100%', padding: 12, background: '#27ae60', color: '#fff', border: 'none', fontSize: 16, marginTop: 8 }}>Place Order (COD)</button>
      {orderPlaced && <div style={{ color: 'green', marginTop: 16 }}>Order placed! You will be contacted soon.</div>}
    </div>
  );
}

export default App;
