const request = require('supertest')
const mongoose = require('mongoose')
const { setupDB, setupConfig } = require('../../utils')
const JobModel = require('../../../src/models/job-export')

setupConfig()
const app = require('../../../src/app')
const checkAuth = require('../auth-check')
const { checkJobExists } = require('../common')

describe('GET /export/jobs/{id}/csv - download csv file', () => {
  checkAuth(app, () => request(app).get('/export/jobs/job-id/csv'))
  setupDB()

  before((done) => {
    mongoose.connection.collections.jobExports.drop(() => {
      JobModel.insertMany([
        { resource: 'test_id' },
        { resource: 'test_id2', status: 'completed', completedAt: new Date() },
        {
          _id: mongoose.Types.ObjectId('5ecb74b73158026b54d3e431'),
          resource: 'test_id3',
          status: 'completed',
          completedAt: new Date(),
        },
      ], done)
    })
  })

  checkJobExists(app, '/export/jobs', '/csv')

  it('should return 404 if job is not complete', (done) => {
    JobModel.findOne({}, (findErr, job) => {
      request(app)
        .get(`/export/jobs/${job.id}/csv`)
        .expect(404, {
          error: true,
          message: 'Data not ready',
          code: 'DATA_NOT_READY',
        }, done)
    })
  })

  it('should return 404 if job file is not found', (done) => {
    JobModel.findOne({ resource: 'test_id2' }, (findErr, job) => {
      request(app)
        .get(`/export/jobs/${job.id}/csv`)
        .expect(404, {
          error: true,
          message: "Data file doesn't exist",
          code: 'DATA_FILE_DOESNT_EXIST',
        }, done)
    })
  })

  it('should set headers for download file', (done) => {
    request(app)
      .get('/export/jobs/5ecb74b73158026b54d3e431/csv')
      .expect(200)
      .expect('Content-Disposition', 'attachment; filename="export.csv"')
      .end(done)
  })
})
