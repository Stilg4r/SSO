exports.up = function (knex) {
  return knex.schema.createTable('modules', (table) => {
    table.increments('id').primary();
    table.string('name', 50).notNullable().unique();
    table.string('description', 255);

    // Campos de auditoría
    table.integer('created_by').notNullable();
    table.timestamp('created_date').defaultTo(knex.fn.now()).notNullable();
    table.integer('update_by').nullable();
    // table.timestamp('update_date').nullable().defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')); 
    table.boolean('is_deleted').defaultTo(false).notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('modules');
};
