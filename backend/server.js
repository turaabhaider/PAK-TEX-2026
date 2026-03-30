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
                o.id, o.full_name, o.email, o.phone, o.address, o.total_amount, 
                o.created_at, o.status,
                JSON_ARRAYAGG(JSON_OBJECT('id', oi.id, 'product_id', oi.product_id, 'qty', oi.quantity, 'price', oi.price)) as items
            FROM orders o
            LEFT JOIN order_items oi ON o.id = oi.order_id
            GROUP BY o.id
            ORDER BY o.created_at DESC
        `);
        res.json(rows);
    } catch (err) {
        console.error("Admin Error:", err.message);
        res.status(500).json({ error: "Database Error" });
    }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 SERVER RUNNING ON PORT ${PORT}`);
});