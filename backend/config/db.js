const mysql = require('mysql2');
require('dotenv').config();

// Create a connection pool with promise support
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'turaab2011', 
    database: process.env.DB_NAME || 'pak_tex',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Export the promise-based version so 'await' works in server.js
module.exports = pool.promise();