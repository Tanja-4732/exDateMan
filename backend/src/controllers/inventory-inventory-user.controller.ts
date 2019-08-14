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
  InventoryUser,
} from '../models';
import {InventoryRepository} from '../repositories';

export class InventoryInventoryUserController {
  constructor(
    @repository(InventoryRepository) protected inventoryRepository: InventoryRepository,
  ) { }

  @get('/inventories/{id}/inventory-users', {
    responses: {
      '200': {
        description: 'Array of InventoryUser\'s belonging to Inventory',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(InventoryUser)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<InventoryUser>,
  ): Promise<InventoryUser[]> {
    return this.inventoryRepository.inventoryUsers(id).find(filter);
  }

  @post('/inventories/{id}/inventory-users', {
    responses: {
      '200': {
        description: 'Inventory model instance',
        content: {'application/json': {schema: getModelSchemaRef(InventoryUser)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Inventory.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(InventoryUser, {exclude: ['id']}),
        },
      },
    }) inventoryUser: Omit<InventoryUser, 'id'>,
  ): Promise<InventoryUser> {
    return this.inventoryRepository.inventoryUsers(id).create(inventoryUser);
  }

  @patch('/inventories/{id}/inventory-users', {
    responses: {
      '200': {
        description: 'Inventory.InventoryUser PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(InventoryUser, {partial: true}),
        },
      },
    })
    inventoryUser: Partial<InventoryUser>,
    @param.query.object('where', getWhereSchemaFor(InventoryUser)) where?: Where<InventoryUser>,
  ): Promise<Count> {
    return this.inventoryRepository.inventoryUsers(id).patch(inventoryUser, where);
  }

  @del('/inventories/{id}/inventory-users', {
    responses: {
      '200': {
        description: 'Inventory.InventoryUser DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(InventoryUser)) where?: Where<InventoryUser>,
  ): Promise<Count> {
    return this.inventoryRepository.inventoryUsers(id).delete(where);
  }
}
