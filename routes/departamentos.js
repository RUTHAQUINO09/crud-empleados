const express = require('express');
const router = express.Router();
const pool = require('../config/db');

//  Obtener todos los departamentos
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM departamentos');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//  Crear un departamento
router.post('/', async (req, res) => {
  try {
    const { nombre, ubicacion } = req.body;
    if (!nombre) return res.status(400).json({ error: 'El nombre es obligatorio' });

    const [result] = await pool.query(
      'INSERT INTO departamentos (nombre, ubicacion) VALUES (?, ?)',
      [nombre, ubicacion]
    );

    res.json({ id: result.insertId, nombre, ubicacion });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//  Editar un departamento
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
    res.status(500).json({ error: error.message });
  }
});

//  Eliminar un departamento
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM departamentos WHERE id_departamento = ?', [id]);
    res.json({ message: 'Departamento eliminado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
