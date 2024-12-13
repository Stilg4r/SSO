
exports.up = function (knex) {
    return knex.schema.createTable('refresh_tokens', (table) => {

        table.increments('id').primary();
        table.string('token_id', 255).notNullable().unique();
        table.string('token', 255).notNullable();
        table.integer('id_users').notNullable();
        table.timestamp('expires_at').notNullable();
        table.boolean('is_revoked').defaultTo(false);

        table.integer('created_by').notNullable();
        table.timestamp('created_date').defaultTo(knex.fn.now()).notNullable();
        table.integer('update_by').nullable();
        // No se puede usar CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP en SQLite
        // table.timestamp('update_date').nullable().defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')); 
        table.boolean('is_deleted').defaultTo(false).notNullable();

        table.foreign('id_users').references('id').inTable('users');

    });

};

exports.down = function (knex) {
    return knex.schema.dropTable('refresh_tokens');
};
