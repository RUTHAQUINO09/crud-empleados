const mysql = require('mysql2');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error(' Error conectando a MySQL:', err);
  } else {
    console.log(' Conectado a MySQL');
    connection.release();
  }
});

module.exports = pool.promise();
