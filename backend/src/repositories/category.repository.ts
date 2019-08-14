import {
  DefaultCrudRepository,
  repository,
  HasManyRepositoryFactory,
} from '@loopback/repository';
import {Category, CategoryRelations} from '../models';
import {PgDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';

export class CategoryRepository extends DefaultCrudRepository<
  Category,
  typeof Category.prototype.id,
  CategoryRelations
> {
  public readonly categories: HasManyRepositoryFactory<
    Category,
    typeof Category.prototype.id
  >;

  constructor(
    @inject('datasources.pg') dataSource: PgDataSource,
    @repository.getter('CategoryRepository')
    protected categoryRepositoryGetter: Getter<CategoryRepository>,
  ) {
    super(Category, dataSource);
    this.categories = this.createHasManyRepositoryFactoryFor(
      'categories',
      categoryRepositoryGetter,
    );
  }
}
