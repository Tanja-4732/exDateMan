import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {Inventory, InventoryRelations, InventoryUser, Category, Thing} from '../models';
import {PgDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {InventoryUserRepository} from './inventory-user.repository';
import {CategoryRepository} from './category.repository';
import {ThingRepository} from './thing.repository';

export class InventoryRepository extends DefaultCrudRepository<
  Inventory,
  typeof Inventory.prototype.id,
  InventoryRelations
> {

  public readonly inventoryUsers: HasManyRepositoryFactory<InventoryUser, typeof Inventory.prototype.id>;

  public readonly categories: HasManyRepositoryFactory<Category, typeof Inventory.prototype.id>;

  public readonly things: HasManyRepositoryFactory<Thing, typeof Inventory.prototype.id>;

  constructor(@inject('datasources.pg') dataSource: PgDataSource, @repository.getter('InventoryUserRepository') protected inventoryUserRepositoryGetter: Getter<InventoryUserRepository>, @repository.getter('CategoryRepository') protected categoryRepositoryGetter: Getter<CategoryRepository>, @repository.getter('ThingRepository') protected thingRepositoryGetter: Getter<ThingRepository>,) {
    super(Inventory, dataSource);
    this.things = this.createHasManyRepositoryFactoryFor('things', thingRepositoryGetter,);
    this.categories = this.createHasManyRepositoryFactoryFor('categories', categoryRepositoryGetter,);
    this.inventoryUsers = this.createHasManyRepositoryFactoryFor('inventoryUsers', inventoryUserRepositoryGetter,);
  }
}
