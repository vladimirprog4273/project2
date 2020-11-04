const request = require('supertest')
const { expect } = require('chai')
const mongoose = require('mongoose')
const { setupDB, setupConfig } = require('../../utils')
const JobModel = require('../../../src/models/job-export')

setupConfig()
const app = require('../../../src/app')
const checkAuth = require('../auth-check')
const { checkSkipLimit } = require('../common')

const url = '/export/jobs'

describe('GET /export - get job list', () => {
  checkAuth(app, () => request(app).get(url))
  setupDB()

  const now = Date.now()
  const jobs = Array.from({ length: 30 }, (_, i) => ({
    resource: `resource-${i + 1}`,
    floorIds: ['1', '2'],
    createdAt: new Date(now + i),
  }))

  before((done) => {
    mongoose.connection.collections.jobExports.drop(() => {
      JobModel.insertMany(jobs, done)
    })
  })

  checkSkipLimit(app, url, 30, () => '', (res, done) => {
    JobModel.findOne({}).sort('-createdAt').exec((findErr, job) => {
      expect(res.body.data).to.eql([{
        id: job.id,
        resource: 'resource-30',
        status: 'created',
        floorIds: ['1', '2'],
        createdAt: job.createdAt.toJSON(),
      }])

      done()
    })
  })

  it('should return results after skipped', (done) => {
    request(app)
      .get(url)
      .query({ skip: 5, limit: 2 })
      .expect(200)
      .expect((res) => {
        expect(res.body.data).to.have.lengthOf(2)
        expect(res.body.data[0].resource).to.equal('resource-25')
        expect(res.body.data[1].resource).to.equal('resource-24')
      })
      .end(done)
  })

  it('should return jobs ordered by "most recent comes first"', (done) => {
    request(app)
      .get(url)
      .query({ limit: 3 })
      .expect(200)
      .expect((res) => {
        expect(res.body.data[0].resource).to.equal('resource-30')
        expect(res.body.data[1].resource).to.equal('resource-29')
        expect(res.body.data[2].resource).to.equal('resource-28')
      })
      .end(done)
  })
})
