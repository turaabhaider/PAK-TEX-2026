const mysql = require('mysql2');

const pool = mysql.createPool({
  host: process.env.MYSQLHOST,     // Matches the variable name in Railway
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: process.env.MYSQLPORT || 3306,
  waitForConnections: true,
  connectionLimit: 10
}).promise();

module.exports = pool;