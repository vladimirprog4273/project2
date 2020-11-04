const express = require('express')

const jobs = require('./jobs')

const router = express.Router()

router.use('/jobs', jobs)

module.exports = router
