export async function seed(knex) {
  // Elimina todos los registros existentes
  await knex('urls').truncate();
  // Inserta nuevos registros
  await knex('urls').insert([
    {
      id: 1,
      module_id: 2,
      url: 'roles',
      description: 'Roles de granular access',
      created_by: 1,
      is_deleted: 0
    }
  ]);
}

