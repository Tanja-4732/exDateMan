import {Entity, model, property} from '@loopback/repository';

@model({settings: {}})
export class InventoryUser extends Entity {
  @property({
    type: 'number',
    id: true,
    required: true,
    generated: true,
  })
  id: number;

  @property({
    type: 'number',
    required: true,
  })
  accessRights: number;

  @property({
    type: 'number',
  })
  userId?: number;

  @property({
    type: 'number',
  })
  inventoryId?: number;

  constructor(data?: Partial<InventoryUser>) {
    super(data);
  }
}

export interface InventoryUserRelations {
  // describe navigational properties here
}

export type InventoryUserWithRelations = InventoryUser & InventoryUserRelations;
