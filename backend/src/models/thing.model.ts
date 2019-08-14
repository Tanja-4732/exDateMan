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
    type: 'string',
  })
  code?: string;

  constructor(data?: Partial<Thing>) {
    super(data);
  }
}

export interface ThingRelations {}

export type ThingWithRelations = Thing & ThingRelations;
