import { FastifyInstance } from 'fastify';
import path from 'path';
import fs from 'fs';

// Helper function to recursively find all route files
async function findRouteFiles(dir: string): Promise<string[]> {
  let files: string[] = [];
  const items = await fs.promises.readdir(dir, { withFileTypes: true });

  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      files = files.concat(await findRouteFiles(fullPath));
    } else if (item.isFile() && (item.name.endsWith('.route.ts') || item.name.endsWith('.route.js'))) {
      // Ensure it's not an index file itself
      if (item.name !== 'index.ts' && item.name !== 'index.js') {
        files.push(fullPath);
      }
    }
  }
  return files;
}

export default async function registerRoutes(fastify: FastifyInstance): Promise<void> {
  const routesDir = __dirname; // Correctly refers to the 'src/routes' directory at runtime
  const routeFiles = await findRouteFiles(routesDir);

  fastify.log.info(`Found route files: ${routeFiles.join(', ')}`);

  for (const filePath of routeFiles) {
    try {
      const routeModule = await import(filePath);
      if (routeModule.default && typeof routeModule.default === 'function') {
        // Extract module name from file path for prefixing
        const modulePath = path.relative(routesDir, filePath); // e.g., parcel/parcel.route.ts
        // Corrected logic for moduleName to handle routes directly in routesDir or in subfolders
        let moduleName = path.dirname(modulePath);
        if (moduleName === '.') {
          // If the route file is directly in routesDir, e.g. routes/root.route.ts -> /
          // moduleName becomes empty, so prefix is just '/'
          // However, fastify handles prefix '/' as no prefix, which is fine.
          // Or, derive from filename if no directory, e.g. 'root' from 'root.route.ts'
          moduleName = path.basename(modulePath, path.extname(modulePath)).replace(/\.route$/, '');
          // Avoid 'index' as a prefix if we ever have index.route.ts for some reason
          if (moduleName === 'index') moduleName = '';
        }

        // Normalize to ensure it's a valid path segment and handle nested folders
        moduleName = moduleName.split(path.sep).filter(Boolean).join('/');

        let routePrefix = '';
        if (moduleName) {
           routePrefix = `/${moduleName}`;
        }

        fastify.log.info(`Registering routes from ${filePath} with base prefix ${routePrefix}`);
        fastify.register(routeModule.default, { prefix: routePrefix });
      } else {
        fastify.log.warn(`No default export function found in ${filePath}, skipping registration.`);
      }
    } catch (error) {
      fastify.log.error(`Error registering routes from ${filePath}: ${(error as Error).message}`);
    }
  }
}
