const express = require('express')

const JobModel = require('../../../models/job-export')
const checkJobById = require('../../../middleware/get-job-by-id')(JobModel)
const jobRequestSchema = require('../../../schemas/job-request-export')
const queryParameters = require('../../../schemas/query-parameters')
const validate = require('../../../middleware/validation')
const createJob = require('./create-job')
const getJobsList = require('./get-jobs-list')
const getJobDetails = require('./get-job-details')
const downloadCSV = require('./download-csv')

const router = express.Router()

router.post('/', validate(jobRequestSchema), createJob)
router.get('/', validate(queryParameters), getJobsList)
router.get('/:jobId', checkJobById, getJobDetails)
router.get('/:jobId/csv', checkJobById, downloadCSV)

module.exports = router
