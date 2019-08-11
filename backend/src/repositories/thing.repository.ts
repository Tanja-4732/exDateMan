import {DefaultCrudRepository} from '@loopback/repository';
import {Thing, ThingRelations} from '../models';
import {PgDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class ThingRepository extends DefaultCrudRepository<
  Thing,
  typeof Thing.prototype.id,
  ThingRelations
> {
  constructor(@inject('datasources.pg') dataSource: PgDataSource) {
    super(Thing, dataSource);
  }
}
