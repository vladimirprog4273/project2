const Joi = require('@hapi/joi')

module.exports = {
  query: Joi.object({
    skip: Joi.number()
      .integer()
      .positive()
      .allow(0)
      .default(0),

    limit: Joi.number()
      .integer()
      .min(1)
      .max(100)
      .default(20),
  }).unknown(),
}
