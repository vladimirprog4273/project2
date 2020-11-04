const fs = require('fs')
const path = require('path')

const fsPromises = fs.promises

const { EXPORTS_DIR } = require('../../../config')

async function downloadCSV(req, res, next) {
  const { job } = req

  if (job.status !== 'completed') {
    next({
      statusCode: 404,
      message: 'Data not ready',
      code: 'DATA_NOT_READY',
    })
    return
  }

  try {
    const filePath = path.join(EXPORTS_DIR, job.id)

    await fsPromises.access(filePath, fs.constants.R_OK)

    res.download(filePath, 'export.csv', (err) => {
      /* istanbul ignore next */
      if (err) {
        // eslint-disable-next-line camelcase
        const { session_id, ...jobWithoutSessionId } = job.toJSON()
        req.log.error({ err, job: jobWithoutSessionId }, 'Error in res.download()')
      }
    })
  } catch (e) {
    next({
      statusCode: 404,
      message: "Data file doesn't exist",
      code: 'DATA_FILE_DOESNT_EXIST',
    })
  }
}

module.exports = downloadCSV
