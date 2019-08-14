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
  User,
  InventoryUser,
} from '../models';
import {UserRepository} from '../repositories';

export class UserInventoryUserController {
  constructor(
    @repository(UserRepository) protected userRepository: UserRepository,
  ) { }

  @get('/users/{id}/inventory-users', {
    responses: {
      '200': {
        description: 'Array of InventoryUser\'s belonging to User',
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
    return this.userRepository.inventoryUsers(id).find(filter);
  }

  @post('/users/{id}/inventory-users', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {'application/json': {schema: getModelSchemaRef(InventoryUser)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof User.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(InventoryUser, {exclude: ['id']}),
        },
      },
    }) inventoryUser: Omit<InventoryUser, 'id'>,
  ): Promise<InventoryUser> {
    return this.userRepository.inventoryUsers(id).create(inventoryUser);
  }

  @patch('/users/{id}/inventory-users', {
    responses: {
      '200': {
        description: 'User.InventoryUser PATCH success count',
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
    return this.userRepository.inventoryUsers(id).patch(inventoryUser, where);
  }

  @del('/users/{id}/inventory-users', {
    responses: {
      '200': {
        description: 'User.InventoryUser DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(InventoryUser)) where?: Where<InventoryUser>,
  ): Promise<Count> {
    return this.userRepository.inventoryUsers(id).delete(where);
  }
}
