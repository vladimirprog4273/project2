const path = require('path')
const mongoose = require('mongoose')
const config = require('../src/config')

process.env.NODE_ENV = 'testing'

function setupConfig() {
  config.MAX_FILE_SIZE = 3000
  config.INBOX_DIR = path.join(__dirname, './fixtures/data')
  config.EXPORTS_DIR = path.join(__dirname, './fixtures/data-exports')

  return config.INBOX_DIR
}

function setupDB() {
  before((done) => {
    mongoose.connect('mongodb://127.0.0.1:27017/test', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    }, (err) => {
      if (err) {
        throw err
      }
      done()
    })
  })

  after((done) => {
    mongoose.connection.db.dropDatabase(() => {
      mongoose.connection.close(done)
    })
  })
}

module.exports = {
  setupConfig,
  setupDB,
}
