Para hacer una migración:
npx knex migrate:make create_modulso_table \
--knexfile src/core/infrastructure/dataBase/knexConfig.cjs \
 --migrations-directory=migrations/authentication

para ejecutar la migración:
npx knex migrate:latest \
--knexfile src/core/infrastructure/dataBase/knexConfig.cjs \
 --migrations-directory=migrations/authentication

para crear un seed:

Creates a new seed file, with the name of the seed file being added. If the seed directory config is an array of paths, the seed file will be generated in the latest specified.

npx knex seed:make create_modulos_seed \
--knexfile src/core/infrastructure/dataBase/knexConfig.cjs

para ejecutar el seed:

npx knex seed:run --knexfile src/core/infrastructure/dataBase/knexConfig.js

cuando se cambie un permiso se invalida el token y se debe volver a loguear
