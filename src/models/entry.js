const mongoose = require('mongoose')

const { Schema } = mongoose

const EntrySchema = new Schema({
  jobId: { type: mongoose.ObjectId, index: true },
  status: String,
  imported: Boolean,
  placed: Boolean,
  markerId: { type: String, index: true },
  floorId: { type: String, index: true },
  buildingId: { type: String, index: true },
  data: Object,
  error: Object,
}, {
  timestamps: true,
})

EntrySchema.index({
  'data.email': 1,
})

module.exports = mongoose.model('Entry', EntrySchema)
