const mysql = require('mysql2');

// Crear el pool de conexiones usando las variables de entorno separadas.
const pool = mysql.createPool({
 host: process.env.DB_HOST,
 user: process.env.DB_USER,
 password: process.env.DB_PASSWORD,
 database: process.env.DB_NAME,
 // Usar parseInt() asegura que el puerto sea un número, aunque mysql2 lo suele manejar.
 port: parseInt(process.env.DB_PORT, 10), 
});

pool.getConnection((err, connection) => {
 if (err) {
  // Loguea el error completo para facilitar la depuración en Render
  console.error('❌ Error conectando a MySQL:', err.message);
  console.error('Asegúrate de que DB_HOST, DB_PORT y las credenciales sean correctas.');
 } else {
  console.log('✅ Conectado a MySQL exitosamente en Railway.');
  connection.release();
 }
});

module.exports = pool.promise();