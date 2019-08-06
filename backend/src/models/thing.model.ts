import {Entity, model, property} from '@loopback/repository';

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
    type: 'number',
    required: true,
  })
  inventoryId: number;

  @property({
    type: 'string',
  })
  code?: string;


  constructor(data?: Partial<Thing>) {
    super(data);
  }
}

export interface ThingRelations {
  // describe navigational properties here
}

export type ThingWithRelations = Thing & ThingRelations;
