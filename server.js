 //  Cargar variables de entorno
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./config/db');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Servir archivos estáticos (HTML, CSS, JS, imágenes)
app.use(express.static('public'));
app.use('/uploads', express.static('public/uploads'));

//  Rutas principales (API)
const departamentosRoutes = require('./routes/departamentos');
const empleadosRoutes = require('./routes/empleados');

app.use('/api/departamentos', departamentosRoutes);
app.use('/api/empleados', empleadosRoutes);

//  Ruta de prueba del servidor
app.get('/', (req, res) => {
  res.send('Servidor funcionando correctamente');
});

//  Ruta de prueba de base de datos
app.get('/test-db', async (req, res) => {
  try {
    const [rows] = await pool.query('SHOW TABLES');
    res.json({ ok: true, tablas: rows });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

//  Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(` Servidor corriendo en http://localhost:${PORT}`);
});
