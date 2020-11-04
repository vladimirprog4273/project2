const request = require('supertest')
const { expect } = require('chai')
const { setupConfig } = require('../utils')

setupConfig()
const app = require('../../src/app')
const checkAuth = require('./auth-check')

const url = '/'

describe('GET /', () => {
  checkAuth(app, () => request(app).get(url))

  it('should return 200 and "integration" as plain text', async () => {
    const req = request(app)

    const res = await req.get(url).set('Cookie', ['session_id=sessionValue'])

    expect(res.type).equal('text/plain')
    expect(res.text).equal('integration')
  })
})
