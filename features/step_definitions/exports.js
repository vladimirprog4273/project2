const { When, Then } = require('cucumber')
const actions = require('../support/actions/exports')
const { checkResource } = require('../support/utils/types')
const exporting = require('../support/actions/exports/exporting')

When('just trying of exporting for templates', actions.exportCsv)

When('exporting data with {word}', actions.exportWithType)

Then('empty CSV', actions.checkEmptyCsv)

Then('CSV containing data about the markers of the selected {word}', actions.checkCsvWithType)

// eslint-disable-next-line func-names
When('I export {string} data for following floors:', async function (resource, table) {
  checkResource(resource)

  const floorIds = table.hashes()
    .map(({ Building, Floor }) => this.floorIds[Building][Floor])

  this.csv = await exporting(this.request, resource, floorIds)
})
