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
  Category,
} from '../models';
import {InventoryRepository} from '../repositories';

export class InventoryCategoryController {
  constructor(
    @repository(InventoryRepository) protected inventoryRepository: InventoryRepository,
  ) { }

  @get('/inventories/{id}/categories', {
    responses: {
      '200': {
        description: 'Array of Category\'s belonging to Inventory',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Category)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Category>,
  ): Promise<Category[]> {
    return this.inventoryRepository.categories(id).find(filter);
  }

  @post('/inventories/{id}/categories', {
    responses: {
      '200': {
        description: 'Inventory model instance',
        content: {'application/json': {schema: getModelSchemaRef(Category)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Inventory.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Category, {exclude: ['id']}),
        },
      },
    }) category: Omit<Category, 'id'>,
  ): Promise<Category> {
    return this.inventoryRepository.categories(id).create(category);
  }

  @patch('/inventories/{id}/categories', {
    responses: {
      '200': {
        description: 'Inventory.Category PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Category, {partial: true}),
        },
      },
    })
    category: Partial<Category>,
    @param.query.object('where', getWhereSchemaFor(Category)) where?: Where<Category>,
  ): Promise<Count> {
    return this.inventoryRepository.categories(id).patch(category, where);
  }

  @del('/inventories/{id}/categories', {
    responses: {
      '200': {
        description: 'Inventory.Category DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Category)) where?: Where<Category>,
  ): Promise<Count> {
    return this.inventoryRepository.categories(id).delete(where);
  }
}
