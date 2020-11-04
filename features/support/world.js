const { setWorldConstructor, setDefaultTimeout } = require('cucumber')
const { assert } = require('chai')

setDefaultTimeout(10000)

function World() {
  return Object.seal({
    request: null,
    csv: null,
    buildingsIds: {},
    floorIds: {},
    refs: {},
    async getRef(refName) {
      assert(refName in this.refs, `Ref with name '${refName}' not found`)

      const markerId = this.refs[refName].id

      const filterObj = { include: { floor: 'building' } }
      const filter = JSON.stringify(filterObj)
      return (await this.request.get(`/markers/${markerId}/?filter=${filter}`)).data
    },
    markers: null,
    existingMarker: null,
    positions: [],
  })
}

setWorldConstructor(World)
