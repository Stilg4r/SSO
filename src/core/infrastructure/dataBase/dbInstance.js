// knexInstance.js
import knex from 'knex';
import knexConfig from './knexConfig.cjs';
import { ENVIRONMENT } from '../../../../env.cjs';

const db = knex(knexConfig[ENVIRONMENT]);

export default db;