import {DefaultCrudRepository} from '@loopback/repository';
import {Inventory, InventoryRelations} from '../models';
import {PgDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class InventoryRepository extends DefaultCrudRepository<
  Inventory,
  typeof Inventory.prototype.id,
  InventoryRelations
> {
  constructor(@inject('datasources.pg') dataSource: PgDataSource) {
    super(Inventory, dataSource);
  }
}
