import {Entity, model, property, hasMany} from '@loopback/repository';
import {Stock} from './stock.model';

@model({settings: {}})
export class Thing extends Entity {
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
    type: 'string',
  })
  code?: string;

  @property({
    type: 'number',
  })
  inventoryId?: number;

  @hasMany(() => Stock)
  stocks: Stock[];

  constructor(data?: Partial<Thing>) {
    super(data);
  }
}

export interface ThingRelations {}

export type ThingWithRelations = Thing & ThingRelations;
