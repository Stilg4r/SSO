exports.up = function (knex) {
    return knex.schema.createTable('user_permissions', (table) => {
        table
            .integer('user_id')
            .unsigned()
            .notNullable()
            .references('id')
            .inTable('users')
            .onDelete('CASCADE');
        table
            .integer('url_id')
            .unsigned()
            .notNullable()
            .references('id')
            .inTable('urls')
            .onDelete('CASCADE');

        // Permisos por método HTTP
        table.boolean('can_get').defaultTo(false).notNullable();
        table.boolean('can_post').defaultTo(false).notNullable();
        table.boolean('can_put').defaultTo(false).notNullable();
        table.boolean('can_delete').defaultTo(false).notNullable();
        table.boolean('can_patch').defaultTo(false).notNullable();

        // Campos de auditoría
        table.integer('created_by').notNullable();
        table.timestamp('created_date').defaultTo(knex.fn.now()).notNullable();
        table.integer('update_by').nullable();
        // table.timestamp('update_date').nullable().defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')); 
        table.boolean('is_deleted').defaultTo(false).notNullable();

        table.primary(['user_id', 'url_id']);
    });
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists('user_permissions');
};