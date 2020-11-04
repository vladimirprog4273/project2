const mongoose = require('mongoose')

function getJobByIdFactory(JobModel) {
  return async function getJobById(req, res, next) {
    const { jobId } = req.params

    if (mongoose.Types.ObjectId.isValid(jobId)) {
      const job = await JobModel.findById(jobId)

      if (job) {
        // eslint-disable-next-line camelcase
        const { session_id, ...jobWithoutSessionId } = job.toJSON()
        req.log.info({ job: jobWithoutSessionId }, 'Obtain job by id')
        req.job = job
        next()
      } else {
        next({
          statusCode: 404,
          message: 'Job not found',
          code: 'JOB_NOT_FOUND',
        })
      }
    } else {
      next({
        statusCode: 422,
        message: 'Job id is not valid',
        code: 'JOB_ID_IS_INVALID',
        details: { jobId },
      })
    }
  }
}

module.exports = getJobByIdFactory
