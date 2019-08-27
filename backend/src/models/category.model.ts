import {Entity, model, property, hasMany} from '@loopback/repository';

@model({settings: {}})
export class Category extends Entity {
  @property({
    type: 'number',
    id: true,
    required: true,
    generated: true,
  })
  id: number;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'number',
  })
  inventoryId?: number;

  @hasMany(() => Category)
  categories: Category[];

  @property({
    type: 'number',
  })
  categoryId?: number;

  constructor(data?: Partial<Category>) {
    super(data);
  }
}

export interface CategoryRelations {}

export type CategoryWithRelations = Category & CategoryRelations;
