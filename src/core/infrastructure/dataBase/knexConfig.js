import path from 'path';
import { DBPATH, MIGRATIONSPATH } from '../../../../env.cjs'; // Importa el módulo CommonJS como default

const knexConfig = {
    development: {
        client: 'sqlite3',
        connection: {
            filename: DBPATH,
        },
        migrations: {
            directory: [
                path.join(MIGRATIONSPATH, 'migrations', 'authentication'),
            ],
        },
        seeds: {
            directory: [
                path.join(MIGRATIONSPATH, 'seeds', 'authentication'),
            ],
        },
        useNullAsDefault: true,
        debug: true,
    }
};

export default knexConfig 
