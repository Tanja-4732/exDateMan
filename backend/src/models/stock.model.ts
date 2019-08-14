import {Entity, model, property} from '@loopback/repository';

@model({settings: {}})
export class Stock extends Entity {
  @property({
    type: 'number',
    id: true,
    required: true,
  })
  id: number;

  @property({
    type: 'date',
    required: true,
  })
  exDate: string;

  @property({
    type: 'string',
  })
  quantity?: string;

  @property({
    type: 'number',
  })
  useUpIn?: number;

  @property({
    type: 'number',
    required: true,
  })
  percentLeft: number;

  @property({
    type: 'date',
  })
  openedOn?: string;

  @property({
    type: 'date',
    required: true,
  })
  addedOn: string;

  constructor(data?: Partial<Stock>) {
    super(data);
  }
}

export interface StockRelations {}

export type StockWithRelations = Stock & StockRelations;
