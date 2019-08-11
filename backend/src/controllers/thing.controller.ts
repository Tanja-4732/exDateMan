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
import {Thing} from '../models';
import {ThingRepository} from '../repositories';

export class ThingController {
  constructor(
    @repository(ThingRepository)
    public thingRepository: ThingRepository,
  ) {}

  @post('/things', {
    responses: {
      '200': {
        description: 'Thing model instance',
        content: {'application/json': {schema: getModelSchemaRef(Thing)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Thing, {exclude: ['id']}),
        },
      },
    })
    thing: Omit<Thing, 'id'>,
  ): Promise<Thing> {
    return this.thingRepository.create(thing);
  }

  @get('/things/count', {
    responses: {
      '200': {
        description: 'Thing model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(Thing)) where?: Where<Thing>,
  ): Promise<Count> {
    return this.thingRepository.count(where);
  }

  @get('/things', {
    responses: {
      '200': {
        description: 'Array of Thing model instances',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Thing)},
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(Thing))
    filter?: Filter<Thing>,
  ): Promise<Thing[]> {
    return this.thingRepository.find(filter);
  }

  @patch('/things', {
    responses: {
      '200': {
        description: 'Thing PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Thing, {partial: true}),
        },
      },
    })
    thing: Thing,
    @param.query.object('where', getWhereSchemaFor(Thing)) where?: Where<Thing>,
  ): Promise<Count> {
    return this.thingRepository.updateAll(thing, where);
  }

  @get('/things/{id}', {
    responses: {
      '200': {
        description: 'Thing model instance',
        content: {'application/json': {schema: getModelSchemaRef(Thing)}},
      },
    },
  })
  async findById(@param.path.number('id') id: number): Promise<Thing> {
    return this.thingRepository.findById(id);
  }

  @patch('/things/{id}', {
    responses: {
      '204': {
        description: 'Thing PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Thing, {partial: true}),
        },
      },
    })
    thing: Thing,
  ): Promise<void> {
    await this.thingRepository.updateById(id, thing);
  }

  @put('/things/{id}', {
    responses: {
      '204': {
        description: 'Thing PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() thing: Thing,
  ): Promise<void> {
    await this.thingRepository.replaceById(id, thing);
  }

  @del('/things/{id}', {
    responses: {
      '204': {
        description: 'Thing DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.thingRepository.deleteById(id);
  }
}
