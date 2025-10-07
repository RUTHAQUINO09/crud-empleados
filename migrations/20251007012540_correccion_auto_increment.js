/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
    console.log('--- Ejecutando migración de corrección ---');

    const departamentosExists = await knex.schema.hasTable('departamentos');

    // Paso 1: Corregir la columna id_departamento para añadir AUTO_INCREMENT
    if (departamentosExists) {
        console.log("-> Corrigiendo la columna 'id_departamento'...");

        // FORZAMOS la adición de AUTO_INCREMENT sin redeclarar PRIMARY KEY,
        // ya que la restricción PRIMARY KEY ya existe.
        await knex.schema.alterTable('departamentos', (table) => {
            // Usamos specificType para forzar MySQL a añadir AUTO_INCREMENT
            // Mantenemos INT UNSIGNED NOT NULL que ya debería estar, y añadimos 'AUTO_INCREMENT'.
            table.specificType('id_departamento', 'INT UNSIGNED NOT NULL AUTO_INCREMENT').alter();
        });
        console.log("-> Columna 'id_departamento' corregida (AUTO_INCREMENT añadido).");
    }


    // Paso 2: Crear la tabla 'empleados' si aún no existe
    const empleadosExists = await knex.schema.hasTable('empleados');
    
    if (!empleadosExists) {
        console.log("-> Creando la tabla 'empleados'...");
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
        console.log("-> Tabla 'empleados' creada con éxito.");
    } else {
        console.log("-> La tabla 'empleados' ya existe. Omitiendo creación.");
    }
    
    console.log('--- Migración de corrección finalizada ---');
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema
        .dropTableIfExists('empleados'); // Solo revertimos la tabla más reciente
};
