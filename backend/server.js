const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./config/db');
const { createOrder } = require('./controllers/orderController');
const { adminLogin } = require('./controllers/authController');
const checkAuth = require('./middleware/auth');

const app = express();

// 1. Updated CORS to explicitly allow your live Railway Frontend domain
app.use(cors({
    origin: [
        'https://cooperative-harmony-production-333d.up.railway.app', // Your live URL from console
        'http://localhost:5173' // For local development
    ],
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(express.json());

// --- PUBLIC ROUTES ---

// 2. Updated to match the "products" table you just created
app.get('/api/products', async (req, res) => {
    try {
        const [products] = await db.execute('SELECT * FROM products');
        res.json(products);
    } catch (err) {
        console.error("Database Error (Products):", err.message);
        res.status(500).json({ error: "Database error", details: err.message });
    }
});

// 3. Post New Order 
app.post('/api/orders', async (req, res) => {
    console.log("Incoming Order Data:", req.body); 
    try {
        // Ensure your createOrder controller uses: full_name, email, phone, address
        await createOrder(req, res);
    } catch (err) {
        console.error("CRITICAL ERROR IN createOrder:", err.message);
        res.status(500).json({ error: "Order processing failed", details: err.message });
    }
});

app.post('/api/admin/login', adminLogin);

// --- PROTECTED ADMIN ROUTES ---
// 4. Updated column names to match your new "orders" table
app.get('/api/admin/orders', checkAuth, async (req, res) => {
    try {
        const [rows] = await db.execute(`
            SELECT 
                o.id, 
                o.full_name, 
                o.email, 
                o.phone, 
                o.address, 
                o.total_amount, 
                o.created_at,
                o.status,
                JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'id', oi.id,
                        'product_id', oi.product_id, 
                        'qty', oi.quantity,
                        'price', oi.price
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
        res.status(500).json({ error: "Database Error", details: err.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 SERVER RUNNING ON PORT ${PORT}`);
});