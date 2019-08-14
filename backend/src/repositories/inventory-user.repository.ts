import {DefaultCrudRepository} from '@loopback/repository';
import {InventoryUser, InventoryUserRelations} from '../models';
import {PgDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class InventoryUserRepository extends DefaultCrudRepository<
  InventoryUser,
  typeof InventoryUser.prototype.id,
  InventoryUserRelations
> {
  constructor(@inject('datasources.pg') dataSource: PgDataSource) {
    super(InventoryUser, dataSource);
  }
}
