const db = require('../config/db');

exports.createOrder = async (req, res) => {
    const { customer_name, email, phone, address, total, items, Accommodation } = req.body;
    
    const connection = await db.getConnection();
    
    try {
        await connection.beginTransaction();

        // This query fills the standard columns and sets 'total_amount' to match 'total'
        const [orderResult] = await connection.execute(
            `INSERT INTO orders 
            (customer_name, email, phone, address, total, total_amount, Accommodation, status) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                customer_name, 
                email, 
                phone, 
                address, 
                total || 0,
                total || 0, 
                Accommodation || 'None', 
                'Pending'
            ]
        );
        
        const orderId = orderResult.insertId;

        if (items && Array.isArray(items)) {
            for (const item of items) {
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
        console.error("ORDER ERROR:", error.message);
        res.status(500).json({ error: "Order failed", details: error.message });
    } finally {
        if (connection) connection.release();
    }
};