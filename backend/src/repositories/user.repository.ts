import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {User, UserRelations, InventoryUser} from '../models';
import {PgDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {InventoryUserRepository} from './inventory-user.repository';

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.id,
  UserRelations
> {

  public readonly inventoryUsers: HasManyRepositoryFactory<InventoryUser, typeof User.prototype.id>;

  constructor(@inject('datasources.pg') dataSource: PgDataSource, @repository.getter('InventoryUserRepository') protected inventoryUserRepositoryGetter: Getter<InventoryUserRepository>,) {
    super(User, dataSource);
    this.inventoryUsers = this.createHasManyRepositoryFactoryFor('inventoryUsers', inventoryUserRepositoryGetter,);
  }
}
