const request = require('supertest')
const chai = require('chai')
chai.use(require('chai-datetime'))
const mongoose = require('mongoose')
const { EXPORT_FILE_TTL } = require('../../../src/config')
const { setupDB, setupConfig } = require('../../utils')
const JobModel = require('../../../src/models/job-export')
const { CheckError } = require('../common')

const { expect } = chai

setupConfig()
const app = require('../../../src/app')
const checkAuth = require('../auth-check')

const url = '/export/jobs'

describe('POST /export - create export job', () => {
  checkAuth(app, () => request(app).post(url))
  setupDB()

  const checkError = CheckError(app, url)

  it('should return 422 if not resource in request',
    () => checkError({}, {
      message: '"resource" is required',
      path: ['resource'],
      type: 'any.required',
    }))

  it('should return 422 if resource is not from enum',
    () => checkError({
      fileId: 'test_id',
      resource: 'test',
    }, {
      message: '"resource" must be one of [staff, desks, rooms, utilities]',
      path: ['resource'],
      type: 'any.only',
    }))

  it('should return 422 if not floorIds in request',
    () => checkError({
      resource: 'staff',
    }, {
      message: '"floorIds" is required',
      path: ['floorIds'],
      type: 'any.required',
    }))

  describe('db checks', () => {
    beforeEach((done) => {
      mongoose.connection.collections.jobExports.drop(() => {
        done()
      })
    })

    it('should return 201 and response if all is valid', (done) => {
      request(app)
        .post(url)
        .set('Cookie', ['session_id=value'])
        .send({
          resource: 'staff',
          floorIds: ['fl1', 'fl2', 'fl3'],
        })
        .expect(201)
        .end((err, res) => {
          if (err) {
            done(err)
          } else {
            JobModel.findOne({}, (findErr, job) => {
              expect(res.body).to.deep.include({
                id: job.id,
                status: 'created',
                resource: 'staff',
                floorIds: ['fl1', 'fl2', 'fl3'],
              })

              const expiresAt = new Date(res.body.expiresAt)
              expect(expiresAt).closeToTime(new Date(Date.now() + EXPORT_FILE_TTL * 1000), 5)

              done()
            })
          }
        })
    })

    it('should return 201 if columns has nulls', (done) => {
      request(app)
        .post(url)
        .set('Cookie', ['session_id=value'])
        .send({
          resource: 'staff',
          floorIds: ['fl1'],
        })
        .expect(201)
        .end((err) => {
          if (err) {
            done(err)
          } else {
            JobModel.findOne({}, (findErr, job) => {
              expect(job.floorIds).to.eql(['fl1'])
              done()
            })
          }
        })
    })

    it('should set session_id from cookie to job', (done) => {
      request(app)
        .post(url)
        .set('Cookie', ['session_id=valueOne'])
        .send({
          resource: 'staff',
          floorIds: ['fl1'],
        })
        .expect(201)
        .end((err) => {
          if (err) {
            done(err)
          } else {
            JobModel.findOne({}, (findErr, job) => {
              expect(job.session_id).to.equal('valueOne')

              done()
            })
          }
        })
    })

    it('should return 422 if not found session_id in cookies',
      () => checkError({
        resource: 'staff',
        floorIds: ['fl1'],
      }, {
        message: '"session_id" is required',
        path: ['session_id'],
        type: 'any.required',
      }, []))

    it('should return 422 if session_id in cookies is empty',
      () => checkError({
        resource: 'staff',
        floorIds: ['fl1'],
      }, {
        message: '"session_id" is not allowed to be empty',
        path: ['session_id'],
        type: 'string.empty',
      }, ['session_id=']))
  })
})
