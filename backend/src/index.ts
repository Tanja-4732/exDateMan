import {ExdatemanApplication} from './application';
import {ExpressServer} from './server';
import {ApplicationConfig} from '@loopback/core';

export {ExpressServer, ExdatemanApplication};

export async function main(options: ApplicationConfig = {}) {
  const server = new ExpressServer(options);
  await server.boot();
  await server.start();
  console.log('Server is running at http://127.0.0.1:3000');

  /*
  const app = new ExdatemanApplication(options);
  await app.boot();
  await app.start();

  const url = app.restServer.url;
  console.log(`Server is running at ${url}`);
  console.log(`Try ${url}/ping`);

  return app;
  */
}
