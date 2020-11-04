const mongoose = require('mongoose')

const log = require('./utils/logger')('api:server')
const handleUnexpected = require('./utils/handle-unexpected')

const { DB_URL, PORT } = require('./config')
const app = require('./app')

mongoose.connect(DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
}, (err) => {
  if (err) {
    log.fatal({ err }, 'Error on mongoose connection')
    // eslint-disable-next-line no-process-exit
    process.exit(1)
  }

  handleUnexpected()

  const server = app.listen(PORT, () => {
    log.info(`Listening on port ${PORT}...`)
  })

  function shutdown() {
    server.close(async () => {
      await mongoose.connection.close(true)
      // eslint-disable-next-line no-process-exit
      process.exit(0)
    })
  }

  process.on('SIGINT', shutdown)
  process.on('SIGTERM', shutdown)
})
