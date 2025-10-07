/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  // 1. Crear 'departamentos' solo si no existe
  const departamentosExists = await knex.schema.hasTable('departamentos');
  
  if (!departamentosExists) {
    await knex.schema.createTable('departamentos', (table) => {
      // id_departamento INT AUTO_INCREMENT PRIMARY KEY (INT UNSIGNED)
      table.increments('id_departamento').primary(); 
      
      // nombre VARCHAR(100) NOT NULL
      table.string('nombre', 100).notNullable(); 
      
      // ubicacion VARCHAR(255)
      table.string('ubicacion', 255);
    });
  }

  // 2. Crear 'empleados' solo si no existe
  const empleadosExists = await knex.schema.hasTable('empleados');
  
  if (!empleadosExists) {
    await knex.schema.createTable('empleados', (table) => {
      // id_empleado INT AUTO_INCREMENT PRIMARY KEY
      table.increments('id_empleado').primary(); 
      
      // nombre VARCHAR(100) NOT NULL
      table.string('nombre', 100).notNullable();
      
      // cargo VARCHAR(100) NOT NULL
      table.string('cargo', 100).notNullable();
      
      // foto VARCHAR(255)
      table.string('foto', 255); 

      // id_departamento INT UNSIGNED (DEBE coincidir con el tipo de la PK de 'departamentos')
      table.integer('id_departamento').unsigned().nullable();

      // FOREIGN KEY
      table
        .foreign('id_departamento')
        .references('id_departamento')
        .inTable('departamentos')
        .onDelete('SET NULL')
        .onUpdate('CASCADE');
    });
  }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  // Siempre usar dropTableIfExists para la función de reversión
  return knex.schema
    .dropTableIfExists('empleados')
    .dropTableIfExists('departamentos');
};
