// knexConfig.js
const path = require('path');
const { DBPATH } = require('../../../../env.cjs');
const BASE_PATH = path.resolve(__dirname, '../storage');

const knexConfig = {
    development: {
        client: 'sqlite3',
        connection: {
            filename: DBPATH,
        },
        migrations: {
            directory: `${BASE_PATH}/migrations`,
        },
        seeds: {
            directory: `${BASE_PATH}/seeds`,
        },
        useNullAsDefault: true,
        //debug: true,
    }
};

module.exports = knexConfig;
