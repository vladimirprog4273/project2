function getJobInfo(job) {
  const info = {
    id: job.id,
    status: job.status,
    floorIds: job.floorIds,
    resource: job.resource,
    createdAt: job.createdAt,
    expiresAt: job.expiresAt,
  }

  if (job.status === 'completed') {
    info.completedAt = job.completedAt
  }

  return info
}

module.exports = { getJobInfo }
