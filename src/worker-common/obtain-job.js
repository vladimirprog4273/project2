async function obtainJob(JobModel, log) {
  let job = await JobModel.findOne({ status: 'in_progress' })

  if (job) {
    log.info('Worker started')

    // eslint-disable-next-line camelcase
    const { session_id, ...jobWithoutSessionId } = job.toJSON()
    log.info({ job: jobWithoutSessionId }, 'Continue job processing')
  } else {
    job = await JobModel.findOneAndUpdate(
      { status: 'created' }, { status: 'in_progress' }, { new: true },
    )

    if (job) {
      log.info('Worker started')

      // eslint-disable-next-line camelcase
      const { session_id, ...jobWithoutSessionId } = job.toJSON()
      log.info({ job: jobWithoutSessionId }, 'Job obtained')
    }
  }

  return job
}

module.exports = obtainJob
