const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./config/db');
const { createOrder } = require('./controllers/orderController');
const { adminLogin } = require('./controllers/authController');
const checkAuth = require('./middleware/auth');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// --- PUBLIC ROUTES ---

// 1. Get Products for the Home Page
app.get('/api/products', async (req, res) => {
    try {
        const [products] = await db.execute('SELECT * FROM products');
        res.json(products);
    } catch (err) {
        console.error("Database Error (Products):", err.message);
        res.status(500).json({ error: "Database error" });
    }
});

// 2. Post New Order from Checkout
// Added a wrapper to catch hidden controller errors
app.post('/api/orders', async (req, res, next) => {
    console.log("Incoming Order Data:", req.body); // Log data to verify it's arriving
    try {
        await createOrder(req, res);
    } catch (err) {
        console.error("CRITICAL ERROR IN createOrder CONTROLLER:", err.message);
        res.status(500).json({ error: "Order processing failed", details: err.message });
    }
});

// 3. Admin Login (Generates JWT)
app.post('/api/admin/login', adminLogin);


// --- PROTECTED ADMIN ROUTES ---
app.get('/api/admin/orders', checkAuth, async (req, res) => {
    try {
        const [rows] = await db.execute(`
            SELECT 
                o.id, 
                o.customer_name, 
                o.email, 
                o.phone, 
                o.address, 
                o.total, 
                o.created_at,
                JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'name', oi.hoodie_name, 
                        'size', oi.size, 
                        'color', oi.color, 
                        'qty', oi.quantity
                    )
                ) as items
            FROM orders o
            LEFT JOIN order_items oi ON o.id = oi.order_id
            GROUP BY o.id
            ORDER BY o.created_at DESC
        `);
        res.json(rows);
    } catch (err) {
        console.error("Admin Orders Error:", err.message);
        res.status(500).json({ error: "Unauthorized or Database Error" });
    }
});

const PORT = process.env.PORT || 5000;
// Use 0.0.0.0 to ensure Railway can route traffic to the container
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 SERVER RUNNING ON PORT ${PORT}`);
});