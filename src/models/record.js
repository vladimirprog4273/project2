const mongoose = require('mongoose')
const { BUILDING_NAME, FLOOR_LABEL, LOCATION_ID } = require('../config/constants')

const { Schema } = mongoose

const RecordSchema = new Schema({
  jobId: { type: mongoose.ObjectId, index: true },
  [BUILDING_NAME]: String,
  [FLOOR_LABEL]: String,
  [LOCATION_ID]: String,
}, {
  timestamps: true,
})

RecordSchema.index({
  jobId: 1,
  [BUILDING_NAME]: 1,
  [FLOOR_LABEL]: 1,
  [LOCATION_ID]: 1,
})

module.exports = mongoose.model('Record', RecordSchema)
