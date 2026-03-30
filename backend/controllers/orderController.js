const db = require('../config/db');

exports.createOrder = async (req, res) => {
    const { customer_name, email, phone, address, total, items, Accommodation } = req.body;
    
    if (!db.getConnection) {
        return res.status(500).json({ error: "Database connection utility missing" });
    }

    const connection = await db.getConnection();
    
    try {
        await connection.beginTransaction();

        // We fill both 'total' and 'total_amount' to match your DB structure
        const [orderResult] = await connection.execute(
            `INSERT INTO orders 
            (customer_name, email, phone, address, total, total_amount, Accommodation, status) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                customer_name, 
                email, 
                phone, 
                address, 
                total,         
                total,         // Fills total_amount
                Accommodation || 'None', 
                'Pending'
            ]
        );
        
        const orderId = orderResult.insertId;

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
        res.status(201).json({ success: true, orderId });

    } catch (error) {
        if (connection) await connection.rollback();
        console.error("ORDER ERROR:", error.message);
        res.status(500).json({ error: "Order failed", details: error.message });
    } finally {
        if (connection) connection.release();
    }
};