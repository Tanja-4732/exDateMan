import {Entity, model, property} from '@loopback/repository';

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

  constructor(data?: Partial<Category>) {
    super(data);
  }
}

export interface CategoryRelations {}

export type CategoryWithRelations = Category & CategoryRelations;
