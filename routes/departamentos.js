const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Obtener todos los departamentos
router.get('/', async (req, res) => {
  try {
    // Aseguramos que la consulta es simple y compatible
    const [rows] = await pool.query('SELECT id_departamento, nombre, ubicacion FROM departamentos');
    res.json(rows);
  } catch (error) {
    // Es fundamental loguear el error exacto de la DB para la depuración
    console.error('Error en GET /api/departamentos:', error.message);
    res.status(500).json({ error: 'Fallo al obtener departamentos: ' + error.message });
  }
});

// Crear un departamento
router.post('/', async (req, res) => {
  try {
    const { nombre, ubicacion } = req.body;
    if (!nombre) {
      return res.status(400).json({ error: 'El nombre es obligatorio' });
    }

    // CORRECCIÓN FINAL: Omitimos id_departamento en la lista de columnas.
    // El esquema CORREGIDO en Railway se encargará de AUTO_INCREMENT.
    const [result] = await pool.query(
      'INSERT INTO departamentos (nombre, ubicacion) VALUES (?, ?)',
      [nombre, ubicacion]
    );

    // Devolvemos el ID generado
    res.json({ id_departamento: result.insertId, nombre, ubicacion });
  } catch (error) {
    console.error('Error en POST /api/departamentos:', error.message);
    res.status(500).json({ error: 'Fallo al crear departamento: ' + error.message });
  }
});

// Editar un departamento
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, ubicacion } = req.body;

    await pool.query(
      'UPDATE departamentos SET nombre = ?, ubicacion = ? WHERE id_departamento = ?',
      [nombre, ubicacion, id]
    );

    res.json({ message: 'Departamento actualizado' });
  } catch (error) {
    console.error('Error en PUT /api/departamentos:', error.message);
    res.status(500).json({ error: 'Fallo al actualizar departamento: ' + error.message });
  }
});

// Eliminar un departamento
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM departamentos WHERE id_departamento = ?', [id]);
    res.json({ message: 'Departamento eliminado' });
  } catch (error) {
    console.error('Error en DELETE /api/departamentos:', error.message);
    res.status(500).json({ error: 'Fallo al eliminar departamento: ' + error.message });
  }
});

module.exports = router;
