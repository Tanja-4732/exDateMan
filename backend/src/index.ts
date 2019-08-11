import {ExdatemanApplication} from './application';
import {ExpressServer} from './server';
import {ApplicationConfig} from '@loopback/core';

export {ExpressServer, ExdatemanApplication};

export async function main(options: ApplicationConfig = {}) {
  const server = new ExpressServer(options);
  await server.boot();
  await server.start();
  console.log('Server started');
}
