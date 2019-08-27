import {Entity, model, property, hasMany} from '@loopback/repository';
import {InventoryUser} from './inventory-user.model';
import {Category} from './category.model';
import {Thing} from './thing.model';

@model({settings: {}})
export class Inventory extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
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

  @hasMany(() => InventoryUser)
  inventoryUsers: InventoryUser[];

  @hasMany(() => Category)
  categories: Category[];

  @hasMany(() => Thing)
  things: Thing[];

  constructor(data?: Partial<Inventory>) {
    super(data);
  }
}

export interface InventoryRelations {}

export type InventoryWithRelations = Inventory & InventoryRelations;
