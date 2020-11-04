const expressValidation = require('express-validation')

const options = {
  context: true,
  statusCode: 422,
}

function validate(schema) {
  return expressValidation.validate(schema, options)
}

module.exports = validate
