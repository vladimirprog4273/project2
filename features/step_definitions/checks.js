const { Then } = require('cucumber')
const { assert, expect } = require('chai')
const lodash = require('lodash')
const constants = require('../../src/config/constants')
const markerToRecord = require('../../src/worker-import/utils/marker-to-record')
const mappingSuggestion = require('../../src/routes/import/files/mapping-suggestion')
const EntryModel = require('../../src/models/entry')
const { getTypeByName, getNameByType } = require('../support/utils/types')

// eslint-disable-next-line func-names
Then(/^following (.+) markers exist after update:$/, async function (typeName, table) {
  const type = getTypeByName(typeName)

  const refs = {}

  const translateTable = {
    Ref: (name, index) => {
      if (name !== '') {
        assert(!(name in refs), `Ref with name '${name}' already exists`)
        refs[name] = index
      }
    },
    Building: () => constants.BUILDING_NAME,
    Floor: () => constants.FLOOR_LABEL,
    Email: () => constants.EMAIL,
    'Location ID': () => constants.LOCATION_ID,
    Name: () => constants.DISPLAY_NAME,
    Nickname: () => constants.NICKNAME,
    Role: () => constants.ROLE,
    Notes: () => constants.NOTES,
    Status: () => constants.STATUS,
    'Status Text': () => constants.STATUS_TEXT,
    'Phone Mobile': () => constants.PHONE_MOBILE,
    'Phone Office': () => constants.PHONE_OFFICE,
    Skype: () => constants.SKYPE,
    LinkedIn: () => constants.LINKEDIN,
    Twitter: () => constants.TWITTER,
    URL: () => constants.URL,
  }

  const hashes = table.hashes()
  const columnsObject = {}

  const compareTable = hashes.map((row, index) => {
    const object = { type }
    Object.entries(row).forEach(([key, value]) => {
      const translateFunc = translateTable[key]
      assert(translateFunc, `Field '${key}' wasn't recognized`)

      const name = translateFunc(value, index)
      if (name) {
        object[name] = value
        columnsObject[name] = true
      }
    })
    return object
  })

  const columns = Object.keys(columnsObject)

  const filterObj = { where: { type }, include: { floor: 'building' } }
  const filter = JSON.stringify(filterObj)
  const markers = (await this.request.get(`/markers/?filter=${filter}`)).data

  const compareMarkers = []

  markers.forEach((marker) => {
    const record = markerToRecord(marker)

    const object = { type: marker.type }
    columns.forEach((column) => {
      object[column] = record[column]
    })

    compareMarkers.push(object)
  })

  expect(compareMarkers).to.have.deep.members(compareTable)

  Object.entries(refs).forEach(([name, index]) => {
    const record = compareTable[index]
    const markerIndex = compareMarkers.findIndex((marker) => lodash.isEqual(record, marker))
    this.refs[name] = markers[markerIndex]
  })
})

Then('import job details have following entries:', async (table) => {
  const tableValues = {
    true: true, false: false, undefined, 'not provided': undefined,
  }
  const markerIdValues = { provided: true, undefined: false, 'not provided': false }

  const translateCheckValues = {
    Status: (value) => value.toLowerCase(),
    Placed: (value) => tableValues[value],
    'Marker ID': (value) => markerIdValues[value],
    Name: (value) => (value in tableValues ? tableValues[value] : value),
    Email: (value) => (value !== '' ? value : undefined),
    'Location ID': (value) => (value in tableValues ? tableValues[value] : value),
    Error: (value) => (value !== '' ? value : undefined),
    Type: (value) => (value in tableValues ? tableValues[value] : value),
  }

  const getEntryValues = {
    Building: (entry) => entry.data.buildingName,
    Floor: (entry) => entry.data.floorLabel,
    Email: (entry) => entry.data.email,
    'Location ID': (entry) => entry.data.locationId,
    Status: (entry) => entry.status,
    Placed: (entry) => entry.placed,
    Name: (entry) => entry.data.displayName,
    Error: (entry) => {
      const errorDetailsMessage = lodash.get(entry, 'error.details.message')
      if (errorDetailsMessage !== undefined) return errorDetailsMessage
      const errorMessage = lodash.get(entry, 'error.message')
      if (errorMessage) return errorMessage
      return undefined
    },
    'Marker ID': (entry) => (typeof entry.markerId === 'string'),
    Type: (entry) => (entry.data.type === undefined ? undefined : getNameByType(entry.data.type)),
    'Desk Type': (entry) => entry.data.deskType,
  }

  const raw = table.raw()
  const columns = raw.shift()

  const compare1 = raw.map((r) => {
    const object = {}
    columns.forEach((column, i) => {
      const value = r[i]
      object[column] = translateCheckValues[column] ? translateCheckValues[column](value) : value
    })

    return object
  })

  const entries = await EntryModel.find({})

  const compare2 = []

  entries.forEach((entry) => {
    const object = {}
    columns.forEach((column) => {
      const translateFunc = getEntryValues[column]
      assert(translateFunc, `Field '${column}' wasn't recognized`)

      object[column] = translateFunc(entry)
    })

    compare2.push(object)
  })

  expect(compare2).to.have.deep.members(compare1)
})

// eslint-disable-next-line func-names
Then('marker {string} is located on floor {string} in building {string}', async function (
  refName, floorLabel, buildingName,
) {
  const marker = await this.getRef(refName)

  expect(marker.floor.label).to.equal(floorLabel)
  expect(marker.floor.building.name).to.equal(buildingName)
})

// eslint-disable-next-line func-names
Then('marker {string} has field {string} set to {string}', async function (
  refName, fieldName, value,
) {
  const marker = await this.getRef(refName)

  const field = mappingSuggestion([fieldName])[0]
  assert(field, `Field with name '${fieldName}' wasn't recognized`)

  const record = markerToRecord(marker)

  expect(record[field]).to.equal(value)
})

// eslint-disable-next-line func-names
Then('marker {string} is moved to top left slot {int} position', async function (refName, slotIndex) {
  const marker = await this.getRef(refName)

  const filter = JSON.stringify({ limit: 1, where: { pos: (slotIndex - 1) } })
  const [markerSlot] = (await this.request.get(`/floors/${marker.floorId}/marker-slots?filter=${filter}`)).data

  expect(markerSlot.taken).to.be.true
  expect(marker.lat).closeTo(markerSlot.lat, 0.0001)
  expect(marker.lng).closeTo(markerSlot.lng, 0.0001)
})

// eslint-disable-next-line func-names
Then(/^no (.*) markers exist$/, async function (typeName) {
  const type = getTypeByName(typeName)

  const filter = JSON.stringify({ where: { type } })
  const markers = (await this.request.get(`/markers/?filter=${filter}`)).data

  expect(markers).to.be.empty
})

// eslint-disable-next-line func-names
Then('marker {string} is at initial position of marker {string}', async function (refSource, refTarget) {
  const markerSource = await this.getRef(refSource)

  assert(refTarget in this.refs, `Ref with name '${refTarget}' not found`)

  const markerTarget = this.refs[refTarget]

  expect(markerSource.lat).closeTo(markerTarget.lat, 0.0001)
  expect(markerSource.lng).closeTo(markerTarget.lng, 0.0001)
})

// eslint-disable-next-line func-names
Then("marker {string} doesn't exist", async function (refName) {
  assert(refName in this.refs, `Ref with name '${refName}' not found`)

  const markerId = this.refs[refName].id

  const checkMarker = async () => this.request.get(`/markers/${markerId}`)
  return expect(checkMarker()).rejectedWith('Request failed with status code 404')
})

// eslint-disable-next-line func-names
Then(/^existing marker removed$/, async function () {
  const checkMarker = async () => this.request.get(`/markers/${this.existingMarker.id}`)
  return expect(checkMarker()).rejectedWith('Request failed with status code 404')
})

Then('import job details has empty entries list', async () => {
  const entries = await EntryModel.find({})
  expect(entries).to.have.lengthOf(0)
})

// eslint-disable-next-line func-names
Then('marker data updated', async function () {
  const floorId = this.floorIds[0]

  const entries = await EntryModel.find({})

  expect(entries).to.have.lengthOf(1)
  expect(entries[0]).to.include({
    status: 'updated',
    imported: true,
    placed: true,
    error: null,
  })
  expect(entries[0].floorId.toString()).to.equal(floorId)
  expect(entries[0].data).to.include({
    buildingName: 'test-b1',
    floorLabel: 'l1',
    status: 'remote',
    statusText: 'work from home',
  })

  const newMarkerData = (await this.request.get(`/markers/${entries[0].markerId}`)).data

  expect(newMarkerData.status).to.equal(1)
  expect(newMarkerData.statusText).to.equal('work from home')
})

// eslint-disable-next-line func-names
Then('I download CSV with the following data:', function (csv) {
  expect(this.csv).to.equal(csv)
})
