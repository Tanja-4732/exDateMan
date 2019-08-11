import {inject} from '@loopback/core';
import {juggler} from '@loopback/repository';

export class PgDataSource extends juggler.DataSource {
  static dataSourceName = 'pg';

  constructor(
    @inject('datasources.config.pg', {optional: true})
    dsConfig: object = {
      name: 'pg',
      connector: 'postgresql',
      url: '',
      host: process.env.EDM_DB_HOST,
      port: parseInt(process.env.EDM_DB_PORT + '', 10),
      user: process.env.EDM_DB_USER,
      password: process.env.EDM_DB_PWD,
      database: process.env.EDM_DB_DB,
      ssl: true,
      schema: process.env.EDM_DB_SCHEMA,
    },
  ) {
    super(dsConfig);
  }
}
