import {DefaultCrudRepository} from '@loopback/repository';
import {Stock, StockRelations} from '../models';
import {PgDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class StockRepository extends DefaultCrudRepository<
  Stock,
  typeof Stock.prototype.id,
  StockRelations
> {
  constructor(@inject('datasources.pg') dataSource: PgDataSource) {
    super(Stock, dataSource);
  }
}
