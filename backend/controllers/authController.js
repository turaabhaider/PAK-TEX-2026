const jwt = require('jsonwebtoken');
const db = require('../config/db'); // Import your database connection

exports.adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Check the database for this specific email
        const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        const user = rows[0];

        // 2. Validate user exists and password matches (Direct comparison)
        if (user && user.password === password) {
            
            // 3. Create a secure Token
            const token = jwt.sign(
                { id: user.id, role: user.role }, 
                process.env.JWT_SECRET, 
                { expiresIn: '2h' }
            );

            return res.json({ token });
        } else {
            return res.status(401).json({ error: 'Invalid Email or Password' });
        }
    } catch (error) {
        console.error("Login Controller Error:", error);
        return res.status(500).json({ error: 'Server Error' });
    }
};