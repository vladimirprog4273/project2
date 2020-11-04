const pino = require('pino')

function handleUnexpected() {
  const logger = pino({ name: 'final' })

  process.on('uncaughtException', pino.final(logger, (err, finalLogger) => {
    finalLogger.error(err, 'uncaughtException')
    // eslint-disable-next-line no-process-exit
    process.exit(1)
  }))

  process.on('unhandledRejection', pino.final(logger, (err, finalLogger) => {
    finalLogger.error(err, 'unhandledRejection')
    // eslint-disable-next-line no-process-exit
    process.exit(1)
  }))
}

module.exports = handleUnexpected
