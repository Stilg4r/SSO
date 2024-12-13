/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('users', (table) => {
        table.increments('id').primary();
        table.string('user').notNullable();
        table.string('password').notNullable();
        table.integer('created_by').notNullable();
        table.timestamp('created_date').defaultTo(knex.fn.now()).notNullable();
        table.integer('update_by').nullable();
        // No se puede usar CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP en SQLite
        // table.timestamp('update_date').nullable().defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')); 
        table.boolean('is_deleted').defaultTo(false).notNullable();
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable('users');
};
