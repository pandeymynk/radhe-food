import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Simple menu for Radhe Foods
const menu = [
  { id: 1, name: "Roti", price: 10 },
  { id: 2, name: "Rice", price: 30 },
  { id: 3, name: "Aalu Paratha", price: 25 },
  { id: 4, name: "Paneer Paratha", price: 40 },
  { id: 5, name: "Sabji", price: 35 },
];

// Orders and users storage (in-memory for now)
const orders = [];
const users = [];
const ADMIN_WHATSAPP = "919816699164"; // Set your WhatsApp number here
// Auth: Signup
app.post("/api/signup", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ error: "Missing username or password" });
  if (users.find((u) => u.username === username))
    return res.status(400).json({ error: "Username already exists" });
  users.push({ username, password });
  res.json({ user: { username } });
});

// Auth: Login
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(
    (u) => u.username === username && u.password === password,
  );
  if (!user) return res.status(401).json({ error: "Invalid credentials" });
  res.json({ user: { username } });
});

app.get("/api/menu", (req, res) => {
  res.json(menu);
});

app.post("/api/order", (req, res) => {
  const { items, customer } = req.body;
  if (!items || !customer) {
    return res.status(400).json({ error: "Missing items or customer info" });
  }
  const order = { id: orders.length + 1, items, customer, time: new Date() };
  orders.push(order);
  // WhatsApp notification (just return the message for frontend to use)
  const orderMsg =
    `Order from ${customer.name} (+91${customer.phone}):\n${items.map((i) => i.name + " - ₹" + i.price).join("\n")}` +
    `\nAddress: ${customer.address}`;
  const waUrl = `https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent(orderMsg)}`;
  res.status(201).json({ message: "Order placed successfully", order, waUrl });
});

app.get("/api/orders", (req, res) => {
  // For admin: list all orders
  res.json(orders);
});

app.listen(PORT, () => {
  console.log(`Radhe Foods server running on port ${PORT}`);
});
