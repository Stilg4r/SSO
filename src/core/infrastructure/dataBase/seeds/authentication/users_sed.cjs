// seeds/test_users.js
/**
 * @param {import('knex').Knex} knex
 */
exports.seed = async function (knex) {
  // Borrar cualquier dato previo
  await knex('users').truncate();

  // Insertar datos de prueba
  await knex('users').insert([
    { id: 1, user: 'test', password: '$2a$10$ZeOv7/NVULy60cY/6TBxLeWKy3X9ztiYRGu3PT9MuMJAERGrDtR.S', is_deleted: 0, created_by: 1 },
    { id: 2, user: 'deleted_user', password: 'password', is_deleted: 1, created_by: 1 },
  ]);
};