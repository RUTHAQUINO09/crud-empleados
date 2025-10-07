const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');


// Configuración de Multer para subir imágenes
const storage = multer.diskStorage({
 destination: (req, file, cb) => {
  // Asegúrate de que este directorio existe: public/uploads
  cb(null, 'public/uploads');
 },
 filename: (req, file, cb) => {
  const uniqueName = Date.now() + path.extname(file.originalname);
  cb(null, uniqueName);
 }
});

const upload = multer({ storage });

//  Obtener todos los empleados con su departamento

router.get('/', async (req, res) => {
 try {
  const [rows] = await pool.query(`
   SELECT e.id_empleado, e.nombre, e.cargo, e.foto, e.id_departamento, d.nombre AS departamento
   FROM empleados e
   LEFT JOIN departamentos d ON e.id_departamento = d.id_departamento
  `);
  res.json(rows);
 } catch (error) {
    console.error('Error en GET /api/empleados:', error.message);
  res.status(500).json({ error: 'Fallo al obtener empleados: ' + error.message });
 }
});

// Crear un nuevo empleado
router.post('/', upload.single('foto'), async (req, res) => {
 try {
  const { nombre, cargo, id_departamento } = req.body;
  const foto = req.file ? req.file.filename : null;

  if (!nombre || !cargo || !id_departamento) {
   return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  const [result] = await pool.query(
   'INSERT INTO empleados (nombre, cargo, foto, id_departamento) VALUES (?, ?, ?, ?)',
   [nombre, cargo, foto, id_departamento]
  );

  res.json({ id: result.insertId, nombre, cargo, foto, id_departamento });
 } catch (error) {
    console.error('Error en POST /api/empleados:', error.message);
  res.status(500).json({ error: 'Fallo al crear empleado: ' + error.message });
 }
});

//  Actualizar empleado
router.put('/:id', upload.single('foto'), async (req, res) => {
 try {
  const { id } = req.params;
  const { nombre, cargo, id_departamento } = req.body;
  let foto = req.file ? req.file.filename : null;

  if (foto) {
   // Si se sube nueva foto, eliminamos la anterior
   const [old] = await pool.query('SELECT foto FROM empleados WHERE id_empleado = ?', [id]);
   if (old[0]?.foto) {
    const oldPath = path.join(__dirname, '..', 'public', 'uploads', old[0].foto);
    // Usar fs.promises.unlink o envolver en try/catch para evitar fallos si el archivo no existe
    if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath); 
   }
   await pool.query(
    'UPDATE empleados SET nombre=?, cargo=?, id_departamento=?, foto=? WHERE id_empleado=?',
    [nombre, cargo, id_departamento, foto, id]
   );
  } else {
   await pool.query(
    'UPDATE empleados SET nombre=?, cargo=?, id_departamento=? WHERE id_empleado=?',
    [nombre, cargo, id_departamento, id]
   );
  }

  res.json({ message: 'Empleado actualizado correctamente' });
 } catch (error) {
    console.error('Error en PUT /api/empleados:', error.message);
  res.status(500).json({ error: 'Fallo al actualizar empleado: ' + error.message });
 }
});

//  Eliminar empleado
router.delete('/:id', async (req, res) => {
 try {
  const { id } = req.params;

  // Eliminar foto del servidor
  const [old] = await pool.query('SELECT foto FROM empleados WHERE id_empleado = ?', [id]);
  if (old[0]?.foto) {
   const oldPath = path.join(__dirname, '..', 'public', 'uploads', old[0].foto);
   if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
  }

  await pool.query('DELETE FROM empleados WHERE id_empleado = ?', [id]);
  res.json({ message: 'Empleado eliminado correctamente' });
 } catch (error) {
    console.error('Error en DELETE /api/empleados:', error.message);
  res.status(500).json({ error: 'Fallo al eliminar empleado: ' + error.message });
 }
});

module.exports = router;
