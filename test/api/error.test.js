const { expect } = require('chai')
const sinon = require('sinon')
const request = require('supertest')
const axios = require('axios')

const { setupConfig } = require('../utils')

setupConfig()
const app = require('../../src/app')

describe('Auth checks', () => {
  it('should not output the actual error on 500', async () => {
    sinon.replace(axios, 'get', () => {
      throw new Error()
    })

    const req = request(app)
    const res = await req.get('/')

    expect(res.statusCode).to.equal(500)

    expect(res.body).to.eql({
      error: true,
      message: 'Internal Server Error',
      code: 'INTERNAL_SERVER_ERROR',
    })

    sinon.restore()
  })
})
