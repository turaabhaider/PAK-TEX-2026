const db = require('../config/db');

exports.createOrder = async (req, res) => {
    // 1. Destructure with fallbacks to prevent "NULL" errors
    const { 
        customer_name, 
        name, 
        email, 
        phone, 
        address, 
        total, 
        items, 
        Accommodation 
    } = req.body;

    // Use whichever name field is available
    const finalName = customer_name || name;

    const connection = await db.getConnection();
    
    try {
        await connection.beginTransaction();

        // 2. Insert into 'orders' table
        // We fill EVERYTHING: customer_name, total, total_amount, and status
       // Ensure both total AND total_amount are included in the query
const [orderResult] = await connection.execute(
    `INSERT INTO orders 
    (customer_name, email, phone, address, total, total_amount, Accommodation, status) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
        customer_name, 
        email, 
        phone, 
        address, 
        total,         // Value 1
        total,         // Value 2 (This fills total_amount so it's not empty)
        Accommodation || 'None', 
        'Pending'
    ]
);
        
        const orderId = orderResult.insertId;

 // This part goes inside your exports.createOrder function
if (items && Array.isArray(items)) {
    for (const item of items) {
        // We match the 6 columns from your screenshot: 
        // order_id, product_id, quantity, price, size, color
        await connection.execute(
            `INSERT INTO order_items 
            (order_id, product_id, quantity, price, size, color) 
            VALUES (?, ?, ?, ?, ?, ?)`, 
            [
                orderId, 
                item.id || null, 
                item.quantity || 1, 
                item.price || 0,
                item.size || 'N/A', 
                item.color || 'N/A'
            ]
        );
    }
}

        await connection.commit();
        res.status(201).json({ success: true, orderId });

    } catch (error) {
        if (connection) await connection.rollback();
        console.error("DATABASE ERROR:", error.message);
        // Send the exact error message back to the frontend to see what's wrong
        res.status(500).json({ error: "Order failed", details: error.message });
    } finally {
        if (connection) connection.release();
    }
};