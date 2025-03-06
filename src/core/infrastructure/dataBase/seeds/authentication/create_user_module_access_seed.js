export async function seed(knex) {
  // Elimina todos los registros existentes
  await knex('user_module_access').truncate();
  // Inserta nuevos registros
  await knex('user_module_access').insert([
    {
      user_id: 3,
      module_id: 1,
      full_access: 1,
      created_by: 1,
      is_deleted: 0
    },
    {
      user_id: 3,
      module_id: 2,
      full_access: 0,
      created_by: 1,
      is_deleted: 0
    }
  ]);
}
