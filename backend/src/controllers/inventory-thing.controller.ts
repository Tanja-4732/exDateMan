import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  Inventory,
  Thing,
} from '../models';
import {InventoryRepository} from '../repositories';

export class InventoryThingController {
  constructor(
    @repository(InventoryRepository) protected inventoryRepository: InventoryRepository,
  ) { }

  @get('/inventories/{id}/things', {
    responses: {
      '200': {
        description: 'Array of Thing\'s belonging to Inventory',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Thing)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Thing>,
  ): Promise<Thing[]> {
    return this.inventoryRepository.things(id).find(filter);
  }

  @post('/inventories/{id}/things', {
    responses: {
      '200': {
        description: 'Inventory model instance',
        content: {'application/json': {schema: getModelSchemaRef(Thing)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Inventory.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Thing, {exclude: ['id']}),
        },
      },
    }) thing: Omit<Thing, 'id'>,
  ): Promise<Thing> {
    return this.inventoryRepository.things(id).create(thing);
  }

  @patch('/inventories/{id}/things', {
    responses: {
      '200': {
        description: 'Inventory.Thing PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Thing, {partial: true}),
        },
      },
    })
    thing: Partial<Thing>,
    @param.query.object('where', getWhereSchemaFor(Thing)) where?: Where<Thing>,
  ): Promise<Count> {
    return this.inventoryRepository.things(id).patch(thing, where);
  }

  @del('/inventories/{id}/things', {
    responses: {
      '200': {
        description: 'Inventory.Thing DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Thing)) where?: Where<Thing>,
  ): Promise<Count> {
    return this.inventoryRepository.things(id).delete(where);
  }
}
