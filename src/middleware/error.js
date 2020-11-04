const { ValidationError } = require('express-validation')

// eslint-disable-next-line no-unused-vars
const handler = (err, req, res, next) => {
  if (err instanceof ValidationError) {
    req.log.info({ err }, 'Handle validation error')

    const { message, path, type } = Object.values(err.details)[0][0]

    const convertedError = {
      error: true,
      message: 'Validation Error',
      code: 'VALIDATION_ERROR',
      details: { message, path, type },
    }

    return res.status(err.statusCode).json(convertedError)
  }

  if ('statusCode' in err) {
    req.log.info({ err }, 'Handle API error')

    const convertedError = {
      error: true,
      message: err.message,
      code: err.code,
      details: err.details,
    }

    return res.status(err.statusCode).json(convertedError)
  }

  req.log.error({ err }, 'Handle internal server error')

  const convertedError = {
    error: true,
    message: 'Internal Server Error',
    code: 'INTERNAL_SERVER_ERROR',
  }

  return res.status(500).json(convertedError)
}

module.exports = { handler }
