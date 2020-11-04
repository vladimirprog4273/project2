const {
  BeforeAll, Before, After, AfterAll,
} = require('cucumber')

const auth = require('./auth')
const createRequest = require('./create-request')
const cleanupDataApi = require('./cleanup-data-api')
const cleanupFS = require('./cleanup-fs')
const db = require('./db')

BeforeAll(auth)
BeforeAll(db.open)

Before(createRequest)
Before(cleanupDataApi)
Before(db.clear)

After(cleanupFS)

AfterAll(db.close)
