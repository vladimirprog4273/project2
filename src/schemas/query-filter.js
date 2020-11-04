const Joi = require('@hapi/joi')

const queryFilterSchema = {
  query: Joi.object({
    filter: Joi.object({
      search: Joi.string().optional(),
      status: Joi.string().valid('created', 'updated', 'deleted', 'skipped', 'failed').optional(),
      placed: Joi.boolean().optional(),
    }),
  }).unknown(),
}

module.exports = queryFilterSchema
