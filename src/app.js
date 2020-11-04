const express = require('express')
const bodyParser = require('body-parser')
const helmet = require('helmet')
const cookieParser = require('cookie-parser')

const logger = require('./middleware/logger')
const authentication = require('./middleware/authentication')
const importRoutes = require('./routes/import')
const exportRoutes = require('./routes/export')
const { handler } = require('./middleware/error')

const app = express()

app.use(bodyParser.json())
app.use(helmet())
app.use(cookieParser())

app.use(logger)

app.use(authentication)

app.get('/', rootRoutes)
app.use('/import', importRoutes)
app.use('/export', exportRoutes)

app.use(handler)

module.exports = app
