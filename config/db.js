// Cargar variables de entorno
require('dotenv').config();
const mysql = require('mysql2');

// Configuración de la conexión a MySQL usando variables de entorno de Railway
const pool = mysql.createPool({
    // Variables de conexión externa a Railway
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT, 10), // Aseguramos que el puerto (51228) sea un número

    // Configuración robusta del pool
    connectionLimit: 10,
    waitForConnections: true, // Esperar si todas las conexiones están en uso
    queueLimit: 0, // Sin límite de cola
    
    // Configuración de formato de datos (importante para MySQL)
    // Permite que MySQL devuelva DATETIME/TIMESTAMP como strings, previniendo errores de parsing
    dateStrings: true, 
}).promise(); // Usamos la API de promesas de mysql2

// Prueba de conexión inicial (solo se ejecuta una vez)
pool.getConnection()
    .then(connection => {
        console.log('✅ Conectado a MySQL exitosamente en Railway.');
        connection.release();
    })
    .catch(err => {
        console.error('❌ Error fatal al conectar a MySQL:', err.message);
        // El servidor NO DEBE iniciar si la DB no está disponible
        process.exit(1); 
    });

module.exports = pool;
