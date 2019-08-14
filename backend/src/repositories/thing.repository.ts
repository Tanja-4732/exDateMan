import {
  DefaultCrudRepository,
  HasManyRepositoryFactory,
  repository,
} from '@loopback/repository';
import {Thing, ThingRelations, Stock, ThingWithRelations} from '../models';
import {PgDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {StockRepository} from './stock.repository';

import {Filter, Options} from '@loopback/repository';
import {StockWithRelations} from '../models';

export class ThingRepository extends DefaultCrudRepository<
  Thing,
  typeof Thing.prototype.id,
  ThingRelations
> {
  // Declare a HasManyRepositoryFactory here
  public readonly stocks: HasManyRepositoryFactory<
    Stock,
    typeof Thing.prototype.id
  >;

  constructor(
    @inject('datasources.pg') dataSource: PgDataSource,
    // Inject StockRepository-getter
    @repository.getter(StockRepository)
    protected stockRepositoryGetter: Getter<StockRepository>,
  ) {
    super(Thing, dataSource);
    // Some kind of factory
    this.stocks = this.createHasManyRepositoryFactoryFor(
      'stocks',
      stockRepositoryGetter,
    );
  }

  async find(
    filter?: Filter<Thing>,
    options?: Options,
  ): Promise<ThingWithRelations[]> {
    // Prevent juggler for applying "include" filter
    // Juggler is not aware of LB4 relations
    const include = filter && filter.include;
    filter = {...filter, include: undefined};
    const result = await super.find(filter, options);

    // poor-mans inclusion resolver, this should be handled by DefaultCrudRepo
    // and use `inq` operator to fetch related stocks in fewer DB queries
    // this is a temporary implementation, please see
    // https://github.com/strongloop/loopback-next/issues/3195
    if (include && include.length && include[0].relation === 'stocks') {
      await Promise.all(
        result.map(async r => {
          r.stocks = await this.stocks(r.id).find();
        }),
      );
    }

    return result;
  }

  async findById(
    id: typeof Thing.prototype.id,
    filter?: Filter<Thing>,
    options?: Options,
  ): Promise<ThingWithRelations> {
    // Prevent juggler for applying "include" filter
    // Juggler is not aware of LB4 relations
    const include = filter && filter.include;
    filter = {...filter, include: undefined};

    const result = await super.findById(id, filter, options);

    // poor-mans inclusion resolver, this should be handled by DefaultCrudRepo
    // and use `inq` operator to fetch related stocks in fewer DB queries
    // this is a temporary implementation, please see
    // https://github.com/strongloop/loopback-next/issues/3195
    if (include && include.length && include[0].relation === 'stocks') {
      result.stocks = await this.stocks(result.id).find();
    }

    return result;
  }
}
