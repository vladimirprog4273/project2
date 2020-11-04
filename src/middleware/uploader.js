const multer = require('multer')

const { INBOX_DIR, MAX_FILE_SIZE } = require('../config')

const ACCEPT_MIMETYPES = ['text/csv', 'application/vnd.ms-excel']
const FIELD_NAME = 'file'

const multerUpload = multer({
  dest: INBOX_DIR,
  limits: { fileSize: MAX_FILE_SIZE, fields: 0 },
  fileFilter: (req, file, cb) => {
    if (ACCEPT_MIMETYPES.includes(file.mimetype)) {
      return cb(null, true)
    }
    req.log.warn('Unacceptable file MIME type: %s', file.mimetype)

    const error = new Error()
    error.statusCode = 415
    error.message = 'File must be a valid CSV file'
    error.code = 'FILE_FORMAT'
    return cb(error)
  },
}).single(FIELD_NAME)

function upload(req, res, next) {
  multerUpload(req, res, (err) => {
    if (err) {
      const error = { message: err.message }
      /* istanbul ignore else */
      if (err.code) {
        error.code = err.code
      }
      /* istanbul ignore else */
      if (err.statusCode) {
        error.statusCode = err.statusCode
      } else if (err.code === 'LIMIT_UNEXPECTED_FILE') { // when putting file in a different field than expected
        error.statusCode = 422
      } else if (err.code === 'LIMIT_FIELD_COUNT') {
        error.statusCode = 400
      } else if (err.code === 'LIMIT_FILE_SIZE') {
        error.statusCode = 413
      }
      next(error)
      return
    }

    if (!req.file) {
      next({
        statusCode: 422,
        message: 'File is required',
        code: 'FILE_IS_REQUIRED',
      })
    } else {
      next()
    }
  })
}

module.exports = upload
