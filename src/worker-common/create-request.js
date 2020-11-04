const axios = require('axios')

function createRequest(API_URL, sessionId, log) {
  const cookie = `session_id=${sessionId};`
  const headers = { Cookie: cookie }
  const request = axios.create({ baseURL: API_URL, headers, withCredentials: true })

  // Add debug logging for all requests
  request.interceptors.request.use((config) => {
    if (!config.data) {
      log.debug('API request, method %s, url: %s', config.method.toUpperCase(), config.url)
    } else {
      log.debug('API request, method %s, url: %s, data: %o',
        config.method.toUpperCase(),
        config.url,
        config.data)
    }
    return config
  })

  return request
}

module.exports = createRequest
