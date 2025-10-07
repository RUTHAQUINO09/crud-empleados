// Cargar variables de entorno (solo necesario para pruebas locales)
// En Render, las variables ya estarán disponibles en process.env
require('dotenv').config(); 

module.exports = {
  // Configuración para el entorno de Producción (Render / Railway)
  production: {
    client: 'mysql2',
    connection: {
      // Usamos las variables de entorno que apuntan a Railway (dominio y puerto del proxy)
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './migrations' // Directorio donde se guardarán los archivos de migración
    },
    // Si tienes problemas de timeout en la conexión inicial con Railway, 
    // puedes intentar añadir un delay:
    // acquireConnectionTimeout: 10000 
  }
};
