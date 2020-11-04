const { EXPORT_FILE_TTL } = require('../../../config')
const JobModel = require('../../../models/job-export')

async function createJob(req, res) {
  const { cookies, body } = req
  const { resource, floorIds } = body
  const expiresAt = new Date(Date.now() + EXPORT_FILE_TTL * 1000)

  const { id, status } = await JobModel.create({
    resource,
    floorIds,
    expiresAt,
    session_id: cookies.session_id,
  })

  res.status(201).send({
    id,
    status,
    resource,
    floorIds,
    expiresAt,
  })
}

module.exports = createJob
