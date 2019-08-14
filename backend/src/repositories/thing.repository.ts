import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {Thing, ThingRelations, Stock} from '../models';
import {PgDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {StockRepository} from './stock.repository';

export class ThingRepository extends DefaultCrudRepository<
  Thing,
  typeof Thing.prototype.id,
  ThingRelations
> {

  public readonly stocks: HasManyRepositoryFactory<Stock, typeof Thing.prototype.id>;

  constructor(@inject('datasources.pg') dataSource: PgDataSource, @repository.getter('StockRepository') protected stockRepositoryGetter: Getter<StockRepository>,) {
    super(Thing, dataSource);
    this.stocks = this.createHasManyRepositoryFactoryFor('stocks', stockRepositoryGetter,);
  }
}
