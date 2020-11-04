const shortid = require('shortid')
const Logger = require('../utils/logger')

function onResFinished() {
  this.log.info({ statusCode: this.statusCode }, 'Request completed')
}

module.exports = (req, res, next) => {
  const log = Logger('api:request', { requestId: shortid.generate() })

  log.info({ method: req.method, url: req.originalUrl }, 'Handle request')

  req.log = log
  res.log = log

  res.on('finish', onResFinished)

  if (next) {
    next()
  }
}
