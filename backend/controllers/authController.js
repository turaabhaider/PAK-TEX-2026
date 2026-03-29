const jwt = require('jsonwebtoken');

exports.adminLogin = async (req, res) => {
    try {
        const { password } = req.body;

        // Direct comparison with your .env password
        // This ensures what you type in the login box matches your .env perfectly
        if (password === process.env.ADMIN_PASSWORD) {
            
            // Create a secure Token
            const token = jwt.sign(
                { admin: true }, 
                process.env.JWT_SECRET, 
                { expiresIn: '2h' } // Increased to 2 hours for better workflow
            );

            return res.json({ token });
        } else {
            // If the password doesn't match exactly
            return res.status(401).json({ error: 'Invalid Password' });
        }
    } catch (error) {
        console.error("Login Controller Error:", error);
        return res.status(500).json({ error: 'Server Error' });
    }
};