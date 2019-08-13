import {
  Entity,
  model,
  property,
  belongsTo,
  hasMany,
} from '@loopback/repository';
import {InventoryWithRelations, Inventory} from './inventory.model';
import {Stock, StockWithRelations} from './stock.model';

@model({settings: {}})
export class Thing extends Entity {
  @property({
    type: 'number',
    id: true,
    required: true,
  })
  id: number;

  @belongsTo(() => Inventory)
  inventoryId: number;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
  })
  code?: string;

  @hasMany(() => Stock)
  stocks?: Stock[];

  constructor(data?: Partial<Thing>) {
    super(data);
  }
}

export interface ThingRelations {
  inventory?: InventoryWithRelations;
  stocks?: StockWithRelations[];
}

export type ThingWithRelations = Thing & ThingRelations;
