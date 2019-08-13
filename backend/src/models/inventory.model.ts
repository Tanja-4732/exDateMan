import {Entity, model, property, hasMany} from '@loopback/repository';
import {Thing, ThingWithRelations} from './thing.model';
import {Category, CategoryWithRelations} from './category.model';

@model({settings: {}})
export class Inventory extends Entity {
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

  @property({
    type: 'date',
    required: true,
  })
  createdOn: string;

  @hasMany(() => Thing)
  things?: Thing[];

  @hasMany(() => Category)
  categories?: Category[];

  constructor(data?: Partial<Inventory>) {
    super(data);
  }
}

export interface InventoryRelations {
  things?: ThingWithRelations[];
  categories?: CategoryWithRelations[];
}

export type InventoryWithRelations = Inventory & InventoryRelations;
