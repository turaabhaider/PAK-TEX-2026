const db = require('../config/db');

exports.createOrder = async (req, res) => {
    // We only get 1 'total' from the frontend
    const { 
        customer_name, 
        email, 
        phone, 
        address, 
        total,          
        items, 
        Accommodation, 
        accommodation 
    } = req.body;
    
    const finalAccommodation = Accommodation || accommodation || 'None';
    const finalTotal = total || 0; 

    let connection;
    try {
        connection = await db.getConnection();
        await connection.beginTransaction();

        // FIX: Look at the [?] array below. 
        // We put 'finalTotal' in the 5th AND 6th positions.
        const [orderResult] = await connection.execute(
            `INSERT INTO orders 
            (customer_name, email, phone, address, total, total_amount, Accommodation, status) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                customer_name || 'Guest', 
                email || '', 
                phone || '', 
                address || '', 
                finalTotal,       // This fills the 'total' column
                finalTotal,       // This fills the 'total_amount' column
                finalAccommodation, 
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
        console.error("CHECKOUT ERROR:", error.message);
        res.status(500).json({ error: "DATABASE_ERROR", details: error.message });
    } finally {
        if (connection) connection.release();
    }
};