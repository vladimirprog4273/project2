const Joi = require('@hapi/joi')
const {
  STAFF, DESKS, ROOMS, UTILITIES, FLOOR_LABEL, BUILDING_NAME, EMAIL, LOCATION_ID, COLUMNS,
} = require('../config/constants')

const jobRequestSchema = {
  body: Joi.object({
    fileId: Joi.string().required(),
    resource: Joi.string().valid(STAFF, DESKS, ROOMS, UTILITIES).required(),
    columns: Joi.array().items(
      Joi.string().valid(...(COLUMNS.concat(null))).required(),
    ).required()
      .has(FLOOR_LABEL)
      .message(`${FLOOR_LABEL} is required`)
      .has(BUILDING_NAME)
      .message(`${BUILDING_NAME} is required`)
      .when(Joi.ref('resource'), {
        is: STAFF,
        then: Joi.array().has(EMAIL).message(`${EMAIL} is required`),
        otherwise: Joi.array().has(LOCATION_ID).message(`${LOCATION_ID} is required`),
      }),
    options: Joi.object({
      attributesUpdateMode: Joi.string().valid('replace', 'merge').default('replace'),
      removeUnmatchedMode: Joi.string().valid('none', 'floorScope', 'all').default('none'),
    }).required(),
  }),

  cookies: Joi.object({
    session_id: Joi.string().required(),
  }).unknown(),
}

module.exports = jobRequestSchema
