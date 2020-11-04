const { expect } = require('chai')
const sinon = require('sinon')
const axios = require('axios')

const { AUTH_URL } = require('../../src/config')

let user = { data: { role: 'admin' } }

sinon.stub(axios, 'get')
  .withArgs(`${AUTH_URL}/profile`)
  .callsFake(() => {
    if (user) {
      return user
    }

    const err = new Error()
    err.response = { status: 401 }
    throw err
  })

function checkAuth(app, doRequest) {
  it('should deny unauthenticated user', (done) => {
    user = null
    doRequest().expect(401, done)
  })

  it('should deny user with missing role', (done) => {
    user = { data: {} }
    doRequest().expect(403, done)
  })

  it('should deny user with role "guest"', (done) => {
    user = { data: { role: 'guest' } }
    doRequest().expect(403, done)
  })

  it('should deny user with role "viewer"', (done) => {
    user = { data: { role: 'viewer' } }
    doRequest().expect(403, done)
  })

  it('should allow user with role "editor"', (done) => {
    user = { data: { role: 'editor' } }
    doRequest()
      .end((err, res) => {
        expect(err).to.equal(null)
        expect(res.status).to.not.equal(403)
        done()
      })
  })

  it('should allow user with role "admin"', (done) => {
    user = { data: { role: 'admin' } }
    doRequest()
      .end((err, res) => {
        expect(err).to.equal(null)
        expect(res.status).to.not.equal(403)
        done()
      })
  })
}

module.exports = checkAuth
