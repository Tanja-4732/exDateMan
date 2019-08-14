import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getFilterSchemaFor,
  getModelSchemaRef,
  getWhereSchemaFor,
  patch,
  put,
  del,
  requestBody,
} from '@loopback/rest';
import {Inventory} from '../models';
import {InventoryRepository} from '../repositories';

export class InventoryController {
  constructor(
    @repository(InventoryRepository)
    public inventoryRepository : InventoryRepository,
  ) {}

  @post('/inventories', {
    responses: {
      '200': {
        description: 'Inventory model instance',
        content: {'application/json': {schema: getModelSchemaRef(Inventory)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Inventory, {exclude: ['id']}),
        },
      },
    })
    inventory: Omit<Inventory, 'id'>,
  ): Promise<Inventory> {
    return this.inventoryRepository.create(inventory);
  }

  @get('/inventories/count', {
    responses: {
      '200': {
        description: 'Inventory model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(Inventory)) where?: Where<Inventory>,
  ): Promise<Count> {
    return this.inventoryRepository.count(where);
  }

  @get('/inventories', {
    responses: {
      '200': {
        description: 'Array of Inventory model instances',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Inventory)},
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(Inventory)) filter?: Filter<Inventory>,
  ): Promise<Inventory[]> {
    return this.inventoryRepository.find(filter);
  }

  @patch('/inventories', {
    responses: {
      '200': {
        description: 'Inventory PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Inventory, {partial: true}),
        },
      },
    })
    inventory: Inventory,
    @param.query.object('where', getWhereSchemaFor(Inventory)) where?: Where<Inventory>,
  ): Promise<Count> {
    return this.inventoryRepository.updateAll(inventory, where);
  }

  @get('/inventories/{id}', {
    responses: {
      '200': {
        description: 'Inventory model instance',
        content: {'application/json': {schema: getModelSchemaRef(Inventory)}},
      },
    },
  })
  async findById(@param.path.number('id') id: number): Promise<Inventory> {
    return this.inventoryRepository.findById(id);
  }

  @patch('/inventories/{id}', {
    responses: {
      '204': {
        description: 'Inventory PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Inventory, {partial: true}),
        },
      },
    })
    inventory: Inventory,
  ): Promise<void> {
    await this.inventoryRepository.updateById(id, inventory);
  }

  @put('/inventories/{id}', {
    responses: {
      '204': {
        description: 'Inventory PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() inventory: Inventory,
  ): Promise<void> {
    await this.inventoryRepository.replaceById(id, inventory);
  }

  @del('/inventories/{id}', {
    responses: {
      '204': {
        description: 'Inventory DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.inventoryRepository.deleteById(id);
  }
}
