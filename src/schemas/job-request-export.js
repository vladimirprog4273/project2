const Joi = require('@hapi/joi')
const {
  STAFF, DESKS, ROOMS, UTILITIES,
} = require('../config/constants')

const jobRequestSchema = {
  body: Joi.object({
    resource: Joi.string().valid(STAFF, DESKS, ROOMS, UTILITIES).required(),
    floorIds: Joi.array().items(Joi.string()).required(),
  }),

  cookies: Joi.object({
    session_id: Joi.string().required(),
  }).unknown(),
}

module.exports = jobRequestSchema
