const Pool = require('pg').Pool;
const pool = new Pool({
    user: "postgres",
    password: "database",
    host: "localhost",
    port: 5000,
    database: "node_postgres"
});

module.exports = pool;