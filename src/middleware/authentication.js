const axios = require('axios')
const config = require('../config')

module.exports = async function authenticationMiddleware(req, res, next) {
  try {
    const cookie = req.headers.cookie !== undefined ? req.headers.cookie : ''
    const headers = { Cookie: cookie }
    const response = (await axios.get(`${config.AUTH_URL}/profile`, { headers }))

    const user = response.data
    req.log.info({ userId: user.id }, 'Authentication')

    if (user.role !== 'admin' && user.role !== 'editor') {
      next({
        statusCode: 403,
        message: 'Forbidden Error',
        code: 'FORBIDDEN',
      })
    } else {
      next()
    }
  } catch (err) {
    if (err.response && err.response.status === 401) {
      next({
        statusCode: 401,
        message: 'Unauthorized Error',
        code: 'UNAUTHORIZED',
      })
    } else if (err.response && err.response.status === 403) {
      next({
        statusCode: 403,
        message: 'Forbidden Error',
        code: 'FORBIDDEN',
      })
    } else {
      next(err)
    }
  }
}
