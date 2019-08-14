import {DefaultCrudRepository, Options, Filter} from '@loopback/repository';
import {Stock, StockRelations, StockWithRelations} from '../models';
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

  async find(
    filter?: Filter<Stock>,
    options?: Options,
  ): Promise<StockWithRelations[]> {
    // Prevent juggler for applying "include" filter
    // Juggler is not aware of LB4 relations
    const include = filter && filter.include;
    filter = {...filter, include: undefined};

    const result = await super.find(filter, options);

    // poor-mans inclusion resolver, this should be handled by DefaultCrudRepo
    // and use `inq` operator to fetch related Stock-lists in fewer DB queries
    // this is a temporary implementation, please see
    // https://github.com/strongloop/loopback-next/issues/3195
    if (include && include.length && include[0].relation === 'thing') {
      await Promise.all(
        result.map(async r => {
          r.thing = await this.thing(r.id);
        }),
      );
    }

    return result;
  }

  async findById(
    id: typeof Stock.prototype.id,
    filter?: Filter<Stock>,
    options?: Options,
  ): Promise<StockWithRelations> {
    // Prevent juggler for applying "include" filter
    // Juggler is not aware of LB4 relations
    const include = filter && filter.include;
    filter = {...filter, include: undefined};

    const result = await super.findById(id, filter, options);

    // poor-mans inclusion resolver, this should be handled by DefaultCrudRepo
    // and use `inq` operator to fetch related Stock-lists in fewer DB queries
    // this is a temporary implementation, please see
    // https://github.com/strongloop/loopback-next/issues/3195
    if (include && include.length && include[0].relation === 'thing') {
      result.thing = await this.thing(result.id);
    }

    return result;
  }
}
