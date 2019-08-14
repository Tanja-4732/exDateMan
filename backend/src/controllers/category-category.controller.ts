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
import {Category} from '../models';
import {CategoryRepository} from '../repositories';

export class CategoryCategoryController {
  constructor(
    @repository(CategoryRepository)
    protected categoryRepository: CategoryRepository,
  ) {}

  @get('/categories/{id}/categories', {
    responses: {
      '200': {
        description: "Array of Category's belonging to Category",
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
    return this.categoryRepository.categories(id).find(filter);
  }

  @post('/categories/{id}/categories', {
    responses: {
      '200': {
        description: 'Category model instance',
        content: {'application/json': {schema: getModelSchemaRef(Category)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Category.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Category, {exclude: ['id']}),
        },
      },
    })
    category: Omit<Category, 'id'>,
  ): Promise<Category> {
    return this.categoryRepository.categories(id).create(category);
  }

  @patch('/categories/{id}/categories', {
    responses: {
      '200': {
        description: 'Category.Category PATCH success count',
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
    @param.query.object('where', getWhereSchemaFor(Category))
    where?: Where<Category>,
  ): Promise<Count> {
    return this.categoryRepository.categories(id).patch(category, where);
  }

  @del('/categories/{id}/categories', {
    responses: {
      '200': {
        description: 'Category.Category DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Category))
    where?: Where<Category>,
  ): Promise<Count> {
    return this.categoryRepository.categories(id).delete(where);
  }
}
