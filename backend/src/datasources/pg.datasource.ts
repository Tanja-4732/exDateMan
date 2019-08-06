import {inject} from '@loopback/core';
import {juggler} from '@loopback/repository';
// import * as config from './pg.datasource.json';

export class PgDataSource extends juggler.DataSource {
  static dataSourceName = 'pg';

  constructor(
    @inject('datasources.config.pg', {optional: true})
    dsConfig: object = {
      name: 'pg',
      connector: 'postgresql',
      url: '',
      host: process.env.EDM_HOST,
      port: parseInt(process.env.EDM_PORT + '', 10),
      user: process.env.EDM_USER,
      password: process.env.EDM_PWD,
      database: process.env.EDM_DB,
      ssl: true,
    },
  ) {
    super(dsConfig);
  }
}
