import {
  Entity,
  model,
  property,
  belongsTo,
  hasMany,
} from '@loopback/repository';
import {Inventory} from './inventory.model';

@model({settings: {}})
export class Category extends Entity {
  @property({
    type: 'number',
    id: true,
    required: true,
  })
  id: number;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @belongsTo(() => Inventory)
  inventoryId: number;

  @belongsTo(() => Category)
  parent?: number;

  @hasMany(() => Category)
  children?: Category[];

  constructor(data?: Partial<Category>) {
    super(data);
  }
}

export interface CategoryRelations {
  parent?: CategoryWithRelations;
  children?: CategoryWithRelations[];
}

export type CategoryWithRelations = Category & CategoryRelations;
