const exporting = require('./exporting')

async function exportCsv() {
  this.csv = await exporting(this.request, 'staff', [])
}

module.exports = exportCsv
