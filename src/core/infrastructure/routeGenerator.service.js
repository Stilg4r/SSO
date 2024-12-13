import { existsSync, readdirSync } from 'fs';
import { join } from 'path';

const routeGenerator = async (app, basePath, apiVersion, regex = /.*\.route\.js$/) => {
  const modules = readdirSync(basePath);


  for (const module of modules) {
    // const routePath = resolve(basePath, module, 'routes');
    const routePath = join(basePath, module, 'routes');
    if (existsSync(routePath)) {
      const moduleRoute = `${apiVersion}/${module}`;
      const files = readdirSync(routePath);
      for (const file of files) {
        if (file.match(regex)) {
          try {
            const fileRoutePath = join(routePath, file);


            const { default: router } = await import('../../../' + fileRoutePath);


            if (!router || typeof router !== 'function') {
              throw new Error(`El archivo ${file} no exporta un router válido.`);
            }

            app.use(moduleRoute, router);
          } catch (error) {
            console.error(error);
          }
        }
      }
    }
  }
};

export default routeGenerator;