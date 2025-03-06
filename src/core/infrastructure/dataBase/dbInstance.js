// knexInstance.js
import knex from 'knex';
import knexConfig from './knexConfig.js';
import { ENVIRONMENT } from '../../../../env.cjs';
// exporrad por defecto la instancia de knex
export default knex(knexConfig[ENVIRONMENT]);