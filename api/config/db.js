const mysql = require('mysql2/promise');

// Master pool (Write)
const masterPool = mysql.createPool({
    host: process.env.DB_MASTER_HOST,
    port: process.env.DB_MASTER_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Slave pool (Read)
const slavePool = mysql.createPool({
    host: process.env.DB_SLAVE_HOST,
    port: process.env.DB_SLAVE_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = { masterPool, slavePool };