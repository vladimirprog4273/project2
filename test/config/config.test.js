const { expect } = require('chai')
const decache = require('decache')
const sinon = require('sinon')

describe('Config', () => {
  let initialEnv

  function setEnv(env = {}) {
    process.env = { ...initialEnv, ...env }
  }

  before(() => {
    initialEnv = { ...process.env }
  })

  beforeEach(() => {
    decache('../../src/config/index')
  })

  afterEach(() => {
    decache('../../src/config/index')
    process.env = { ...initialEnv }
  })

  it('should log error and exit on validation error', () => {
    const processExit = sinon.spy()
    sinon.replace(process, 'exit', processExit)

    setEnv({ PORT: 'string' })

    // eslint-disable-next-line global-require
    require('../../src/config/index')

    expect(processExit.getCalls()).to.have.lengthOf(1)
    expect(processExit.getCall(0).args).to.eql([1])

    sinon.restore()
  })
})
