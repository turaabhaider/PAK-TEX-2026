const mysql = require('mysql2');

// This bulletproof setup checks for BOTH variable names
const pool = mysql.createPool({
  host: process.env.MYSQLHOST || process.env.DB_HOST,
  user: process.env.MYSQLUSER || process.env.DB_USER,
  password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD,
  database: process.env.MYSQLDATABASE || process.env.DB_NAME,
  port: process.env.MYSQLPORT || process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10
}).promise();

// Quick test to log if it connects successfully
pool.getConnection()
    .then(conn => {
        console.log("✅ Database Connected Successfully!");
        conn.release();
    })
    .catch(err => {
        console.error("❌ Database Connection Failed:", err.message);
    });

module.exports = pool;