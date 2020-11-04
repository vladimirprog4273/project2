const { expect } = require('chai')
const sinon = require('sinon')

const logger = require('../../src/middleware/logger')

describe('Logger', () => {
  it('should call next if it present', () => {
    const next = sinon.spy()

    logger({}, { on: () => {} }, next)

    expect(next.getCalls()).to.have.lengthOf(1)
  })

  it('should no thrown error if next omitted', () => {
    const fn = () => {
      logger({}, { on: () => {} })
    }

    expect(fn).to.not.throw()
  })
})
