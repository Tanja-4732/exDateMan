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
import {Stock} from '../models';
import {StockRepository} from '../repositories';

export class StockController {
  constructor(
    @repository(StockRepository)
    public stockRepository : StockRepository,
  ) {}

  @post('/stocks', {
    responses: {
      '200': {
        description: 'Stock model instance',
        content: {'application/json': {schema: getModelSchemaRef(Stock)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Stock, {exclude: ['id']}),
        },
      },
    })
    stock: Omit<Stock, 'id'>,
  ): Promise<Stock> {
    return this.stockRepository.create(stock);
  }

  @get('/stocks/count', {
    responses: {
      '200': {
        description: 'Stock model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(Stock)) where?: Where<Stock>,
  ): Promise<Count> {
    return this.stockRepository.count(where);
  }

  @get('/stocks', {
    responses: {
      '200': {
        description: 'Array of Stock model instances',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Stock)},
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(Stock)) filter?: Filter<Stock>,
  ): Promise<Stock[]> {
    return this.stockRepository.find(filter);
  }

  @patch('/stocks', {
    responses: {
      '200': {
        description: 'Stock PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Stock, {partial: true}),
        },
      },
    })
    stock: Stock,
    @param.query.object('where', getWhereSchemaFor(Stock)) where?: Where<Stock>,
  ): Promise<Count> {
    return this.stockRepository.updateAll(stock, where);
  }

  @get('/stocks/{id}', {
    responses: {
      '200': {
        description: 'Stock model instance',
        content: {'application/json': {schema: getModelSchemaRef(Stock)}},
      },
    },
  })
  async findById(@param.path.number('id') id: number): Promise<Stock> {
    return this.stockRepository.findById(id);
  }

  @patch('/stocks/{id}', {
    responses: {
      '204': {
        description: 'Stock PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Stock, {partial: true}),
        },
      },
    })
    stock: Stock,
  ): Promise<void> {
    await this.stockRepository.updateById(id, stock);
  }

  @put('/stocks/{id}', {
    responses: {
      '204': {
        description: 'Stock PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() stock: Stock,
  ): Promise<void> {
    await this.stockRepository.replaceById(id, stock);
  }

  @del('/stocks/{id}', {
    responses: {
      '204': {
        description: 'Stock DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.stockRepository.deleteById(id);
  }
}
