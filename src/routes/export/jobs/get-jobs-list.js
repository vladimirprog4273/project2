const JobModel = require('../../../models/job-export')
const { modelPagination } = require('../../utils')
const { getJobInfo } = require('./utils')

async function getJobsList(req, res) {
  const {
    limit, skip, results, total,
  } = await modelPagination(req, JobModel)

  res.send({
    data: results.map(getJobInfo),
    meta: {
      total,
      count: results.length,
      limit,
      skip,
    },
  })
}

module.exports = getJobsList
