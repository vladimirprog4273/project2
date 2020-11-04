const request = require('supertest')
const { expect } = require('chai')
const mongoose = require('mongoose')
const { setupDB, setupConfig } = require('../../utils')
const JobModel = require('../../../src/models/job-export')

setupConfig()
const app = require('../../../src/app')
const checkAuth = require('../auth-check')
const { checkJobExists } = require('../common')

describe('GET /export/jobs/{id} - get job details', () => {
  checkAuth(app, () => request(app).get('/export/jobs/job-id'))
  setupDB()

  before((done) => {
    mongoose.connection.collections.jobExports.drop(() => {
      JobModel.insertMany([
        {
          resource: 'test_id',
          floorIds: ['1', '2', '3'],
          expiresAt: new Date(),
        },
        {
          resource: 'test_id2',
          status: 'completed',
          completedAt: new Date(),
          expiresAt: new Date(),
        },
      ], done)
    })
  })

  checkJobExists(app, '/export/jobs')

  it('should return job info if exists', (done) => {
    JobModel.findOne({}, (findErr, job) => {
      request(app)
        .get(`/export/jobs/${job.id}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).to.eql({
            id: job.id,
            resource: 'test_id',
            status: 'created',
            createdAt: job.createdAt.toJSON(),
            expiresAt: job.expiresAt.toJSON(),
            floorIds: job.floorIds,
          })
        })
        .end(done)
    })
  })

  it('should return completedAt and expires on completed job', (done) => {
    JobModel.findOne({ resource: 'test_id2' }, (findErr, job) => {
      request(app)
        .get(`/export/jobs/${job.id}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.completedAt).to.equal(job.completedAt.toJSON())
          expect(res.body.expiresAt).to.equal(job.expiresAt.toJSON())
        })
        .end(done)
    })
  })
})
