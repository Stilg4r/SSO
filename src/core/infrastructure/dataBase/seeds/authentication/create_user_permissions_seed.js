export async function seed(knex) {
  // Elimina todos los registros existentes
  await knex('user_permissions').truncate();
  // Inserta nuevos registros
  await knex('user_permissions').insert([
    {
      user_id: 3,
      url_id: 1,
      can_get: 1,
      can_post: 0,
      can_put: 0,
      can_delete: 0,
      can_patch: 0,
      created_by: 1,
      is_deleted: 0
    }
  ]);
}




