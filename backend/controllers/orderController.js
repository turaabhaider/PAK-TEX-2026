const db = require('../config/db');

exports.createOrder = async (req, res) => {
    const { customer_name, email, phone, address, total, items, Accommodation } = req.body;
    
    let connection;
    try {
        connection = await db.getConnection();
        await connection.beginTransaction();

        // We fill both total and total_amount to avoid 'Missing Field' errors
        const [orderResult] = await connection.execute(
            `INSERT INTO orders 
            (customer_name, email, phone, address, total, total_amount, Accommodation, status) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                customer_name || 'Guest', 
                email || '', 
                phone || '', 
                address || '', 
                total || 0,
                total || 0, 
                Accommodation || 'None', 
                'Pending'
            ]
        );
        
        const orderId = orderResult.insertId;

        if (items && Array.isArray(items)) {
            for (const item of items) {
                // Simplified insert for items to ensure size/color don't break it
                await connection.execute(
                    `INSERT INTO order_items 
                    (order_id, product_id, quantity, price, size, color) 
                    VALUES (?, ?, ?, ?, ?, ?)`, 
                    [
                        orderId, 
                        item.id || 0, 
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
        console.error("CHECKOUT CRASHED:", error.message);
        // Sending the exact error back helps us see if it's still a DB issue
        res.status(500).json({ error: "CONNECTION ERROR", details: error.message });
    } finally {
        if (connection) connection.release();
    }
};