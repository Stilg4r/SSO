
import Router from 'express';
const endPoints = Router();

import { getInformationApi } from '../controllers/information.controller.js';

endPoints.route('/')
    .get(getInformationApi);

export default endPoints;


