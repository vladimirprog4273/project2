const { getJobInfo } = require('./utils')

function getJobDetails(req, res) {
  const { job } = req

  res.status(200).send(getJobInfo(job))
}

module.exports = getJobDetails
