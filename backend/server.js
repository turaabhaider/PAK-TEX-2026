const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./config/db');
const { createOrder } = require('./controllers/orderController');
const { adminLogin } = require('./controllers/authController');
const checkAuth = require('./middleware/auth');

const app = express();

app.use(cors({
    origin: [
        'https://cooperative-harmony-production-333d.up.railway.app',
        'http://localhost:5173'
    ],
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(express.json());

// --- PUBLIC ROUTES ---

app.get('/api/products', async (req, res) => {
    try {
        // Use query for general SELECT statements
        const [rows] = await db.query('SELECT * FROM products');
        res.json(rows || []); 
    } catch (err) {
        console.error("❌ SQL Query Error:", err.message);
        // Still send an array so the frontend doesn't crash
        res.status(500).json([]); 
    }
});

app.post('/api/orders', async (req, res) => {
    try {
        await createOrder(req, res);
    } catch (err) {
        console.error("Order Error:", err.message);
        res.status(500).json({ error: "Order failed" });
    }
});

app.post('/api/admin/login', adminLogin);

app.get('/api/admin/orders', checkAuth, async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT 
                o.id, 
                o.customer_name, 
                o.email, 
                o.phone, 
                o.address, 
                o.total,
                o.total_amount, 
                o.Accommodation,
                o.status,
                o.created_at,
                (SELECT JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'name', product_id, 
                        'quantity', quantity, 
                        'size', size, 
                        'color', color
                    )
                ) FROM order_items WHERE order_id = o.id) AS items
            FROM orders o
            ORDER BY o.created_at DESC
        `);
        res.json(rows);
    } catch (err) {
        console.error("Admin Error:", err.message);
        res.status(500).json({ error: "Database Error", details: err.message });
    }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 SERVER RUNNING ON PORT ${PORT}`);
});