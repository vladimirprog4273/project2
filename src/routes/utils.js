async function modelPagination(req, model) {
  const { skip, limit } = req.query

  const [results, total] = await Promise.all([
    model.find({})
      .sort('-createdAt -_id')
      .limit(limit)
      .skip(skip)
      .exec(),
    model.estimatedDocumentCount({}),
  ])

  return {
    limit,
    skip,
    results,
    total,
  }
}

module.exports = { modelPagination }
