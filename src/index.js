import express from 'express'

import mainMiddlewares from './core/middlewares/index.middleware.js'
import routeGenerator from './core/infrastructure/routeGenerator.service.js'
import { notFoundError } from './core/middlewares/errors.middleware.js'
import { errorHandler } from './core/middlewares/errorsHandlers.middleware.js'

import { PORT } from '../env.cjs'

const app = express()

/** CONFIG SERVER */
app.set('port', PORT)

mainMiddlewares(app);

(async () => {
  try {

    const apiVersion = '/api/v1';

    await routeGenerator(app, './src/modules', apiVersion);

    app.use(notFoundError);

    app.use(errorHandler);

    return app.listen(app.get('port'), () =>
      console.info(`Server on port ${app.get('port')}`)
    );

  } catch (error) {
    console.error('❌ Error al inicializar el server:', error.message);
  }

})();

export default app;
