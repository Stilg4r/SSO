import { existsSync, readdirSync } from 'fs';
import { join } from 'path';
import { pathToFileURL } from 'url';

const routeGenerator = async (app, basePath, apiVersion, regex = /.*\.route\.js$/) => {
  const modules = readdirSync(basePath);
  const fullBasePath = join(process.cwd(), basePath);
  for (const module of modules) {
    const routePath = join(fullBasePath, module, 'routes');
    if (existsSync(routePath)) {
      const moduleRoute = `${apiVersion}/${module}`;
      const files = readdirSync(routePath);
      for (const file of files) {
        if (file.match(regex)) {
          try {
            const routeFilePath = pathToFileURL(join(routePath, file)).href;
            const { default: router } = await import(routeFilePath);
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