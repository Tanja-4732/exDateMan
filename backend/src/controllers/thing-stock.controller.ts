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
  Thing,
  Stock,
} from '../models';
import {ThingRepository} from '../repositories';

export class ThingStockController {
  constructor(
    @repository(ThingRepository) protected thingRepository: ThingRepository,
  ) { }

  @get('/things/{id}/stocks', {
    responses: {
      '200': {
        description: 'Array of Stock\'s belonging to Thing',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Stock)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Stock>,
  ): Promise<Stock[]> {
    return this.thingRepository.stocks(id).find(filter);
  }

  @post('/things/{id}/stocks', {
    responses: {
      '200': {
        description: 'Thing model instance',
        content: {'application/json': {schema: getModelSchemaRef(Stock)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Thing.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Stock, {exclude: ['id']}),
        },
      },
    }) stock: Omit<Stock, 'id'>,
  ): Promise<Stock> {
    return this.thingRepository.stocks(id).create(stock);
  }

  @patch('/things/{id}/stocks', {
    responses: {
      '200': {
        description: 'Thing.Stock PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Stock, {partial: true}),
        },
      },
    })
    stock: Partial<Stock>,
    @param.query.object('where', getWhereSchemaFor(Stock)) where?: Where<Stock>,
  ): Promise<Count> {
    return this.thingRepository.stocks(id).patch(stock, where);
  }

  @del('/things/{id}/stocks', {
    responses: {
      '200': {
        description: 'Thing.Stock DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Stock)) where?: Where<Stock>,
  ): Promise<Count> {
    return this.thingRepository.stocks(id).delete(where);
  }
}
