exports.up = function (knex) {
    return knex.schema.createTable('user_module_access', (table) => {
        table
            .integer('user_id')
            .unsigned()
            .notNullable()
            .references('id')
            .inTable('users')
            .onDelete('CASCADE');
        table
            .integer('module_id')
            .unsigned()
            .notNullable()
            .references('id')
            .inTable('modules')
            .onDelete('CASCADE');

        table.boolean('full_access').defaultTo(false).notNullable();

        // Campos de auditoría
        table.integer('created_by').notNullable();
        table.timestamp('created_date').defaultTo(knex.fn.now()).notNullable();
        table.integer('update_by').nullable();
        // table.timestamp('update_date').nullable().defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')); 
        table.boolean('is_deleted').defaultTo(false).notNullable();

        table.primary(['user_id', 'module_id']);
    });
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists('user_module_access');
};