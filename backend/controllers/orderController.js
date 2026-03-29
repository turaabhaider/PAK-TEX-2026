const db = require('../config/db');

exports.createOrder = async (req, res) => {
    // We check for both 'customer_name' and 'name' to match the frontend state
    const { customer_name, name, email, phone, address, total, items } = req.body;
    const finalName = customer_name || name; 
    
    // Safety check: if there is no database connection, we stop here
    if (!db.getConnection) {
        return res.status(500).json({ error: "Database connection utility missing" });
    }

    const connection = await db.getConnection();
    
    try {
        await connection.beginTransaction();

        // 1. Insert into 'orders' table
        // We use finalName to ensure we didn't get a null value
        const [orderResult] = await connection.execute(
            'INSERT INTO orders (customer_name, email, phone, address, total) VALUES (?, ?, ?, ?, ?)',
            [finalName, email, phone, address, total]
        );
        
        const orderId = orderResult.insertId;

        // 2. Insert each item into 'order_items' table
        if (items && Array.isArray(items)) {
            for (const item of items) {
                await connection.execute(
                    `INSERT INTO order_items 
                    (order_id, product_id, hoodie_name, size, color, quantity, price) 
                    VALUES (?, ?, ?, ?, ?, ?, ?)`,
                    [
                        orderId, 
                        item.id || null, 
                        item.name || 'Unknown Product', 
                        item.size || 'N/A', 
                        item.color || 'N/A', 
                        item.quantity || 1, 
                        item.price || 0
                    ]
                );
            }
        }

        await connection.commit();
        console.log(`✅ Order ${orderId} placed successfully for ${finalName}`);
        res.status(201).json({ success: true, orderId });

    } catch (error) {
        if (connection) await connection.rollback();
        console.error("CRITICAL TRANSACTION ERROR:", error.message);
        res.status(500).json({ error: "Order processing failed", details: error.message });
    } finally {
        if (connection) connection.release();
    }
};