const db = require('../config/db');

exports.createOrder = async (req, res) => {
    // We destructure using both casing styles to ensure it never catches an 'undefined'
    const { 
        customer_name, 
        email, 
        phone, 
        address, 
        total, 
        items, 
        Accommodation, 
        accommodation // Added lowercase check
    } = req.body;
    
    // Final value to insert (prioritizing whatever the frontend sent)
    const finalAccommodation = Accommodation || accommodation || 'None';

    let connection;
    try {
        connection = await db.getConnection();
        await connection.beginTransaction();

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
                finalAccommodation, 
                'Pending'
            ]
        );
        
        const orderId = orderResult.insertId;

        if (items && Array.isArray(items)) {
            for (const item of items) {
                // We use item.hoodie_name or item.name to ensure the item description is saved
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
        res.status(500).json({ error: "DB_ERROR", details: error.message });
    } finally {
        if (connection) connection.release();
    }
};