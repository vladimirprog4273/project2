const { expect } = require('chai')

async function checkEmptyCsv() {
  expect(this.csv.split('\n')).to.have.lengthOf(1)
}

module.exports = checkEmptyCsv
