import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {ServiceMixin} from '@loopback/service-proxy';
import {join} from 'path';
import {MySequence} from './sequence';
// import {Router} from 'express';
// import * as express from 'express';

export class ExdatemanApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Set up the custom sequence
    this.sequence(MySequence);

    // // Set the basePath to /api/v2
    // this.basePath('/api/v2');

    // Set up the frontend
    // this.mountExpressRouter(
    //   '/',
    //   Router()
    //     .get(
    //       '/',
    //       express.static(join(__dirname, '../../frontend/dist/exdateman')),
    //     )
    //     .use((req: express.Request, res: express.Response) =>
    //       res.sendFile(
    //         join(__dirname, '../../frontend/dist/exdateman/index.html'),
    //       ),
    //     ),
    // );
    // this.static('/.*', join(__dirname, '../../frontend/dist/exdateman'));

    // Set up default home page
    this.static('/', join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.bind(RestExplorerBindings.CONFIG).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }
}
