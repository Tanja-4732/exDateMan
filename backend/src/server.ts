import {ExdatemanApplication} from './application';
import {ApplicationConfig} from '@loopback/core';
import * as express from 'express';
import {join} from 'path';
import pEvent from 'p-event';

/**
 * This is the main Express server.
 *
 * It serves static files (the Angular frontend), and starts the API.
 */
export class ExpressServer {
  private app: express.Application;
  private lbApp: ExdatemanApplication;

  constructor(options: ApplicationConfig = {}) {
    // Initiate an Express server
    this.app = express();

    // Initiate the API
    this.lbApp = new ExdatemanApplication(options);

    // Route the API
    this.app.use('/api/v2', this.lbApp.requestHandler);

    // Serve all frontend files
    this.app.use(
      express.static(join(__dirname, '../../frontend/dist/exdateman')),
    );

    // Serve main page
    this.app.use((req: express.Request, res: express.Response) => {
      // Don't redirect to preserve the Angular routes
      res.sendFile(join(__dirname, '../../frontend/dist/exdateman/index.html'));
    });
  }

  /**
   * Boot the API
   */
  async boot() {
    await this.lbApp.boot();
  }

  /**
   * Start the API
   */
  async start() {
    const port = this.lbApp.restServer.config.port || 3000;
    const host = this.lbApp.restServer.config.host || '127.0.0.1';
    const server = this.app.listen(port, host);
    await pEvent(server, 'listening');
  }
}
