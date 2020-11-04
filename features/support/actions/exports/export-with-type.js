const exporting = require('./exporting')

async function exportWithType(type) {
  this.csv = await exporting(this.request, type, this.floorIds)
}

module.exports = exportWithType
