const sinon = require('sinon')
const request = require('supertest')
const axios = require('axios')

const { setupConfig } = require('../utils')

setupConfig()
const app = require('../../src/app')

describe('Auth checks', () => {
  it('should return 403 if auth service returns 403', (done) => {
    sinon.replace(axios, 'get', () => {
      const err = new Error()
      err.response = { status: 403 }
      throw err
    })

    request(app)
      .get('/import/files')
      .expect(403, {
        error: true,
        message: 'Forbidden Error',
        code: 'FORBIDDEN',
      }, (err) => {
        if (err) {
          done(err)
        } else {
          sinon.restore()
          done()
        }
      })
  })
})
