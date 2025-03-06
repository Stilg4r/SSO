export async function seed(knex) {
  // Elimina todos los registros existentes
  await knex('modules').truncate();
  // Inserta nuevos registros
  await knex('modules').insert([
    {
      id: 1,
      name: 'fullAccess',
      description: 'Modulo con acceso total',
      created_by: 1,
      is_deleted: 0
    },
    {
      id: 2,
      name: 'granularAccess',
      description: 'Modulo con acceso granular',
      created_by: 1,
      is_deleted: 0
    }
  ]);
}