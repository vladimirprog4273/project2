const mongoose = require('mongoose')

const { Schema } = mongoose

const JobExportSchema = new Schema({
  resource: String,
  floorIds: [String],
  status: { type: String, default: 'created' },
  completedAt: Date,
  expiresAt: Date,
  session_id: String,
}, {
  timestamps: true,
  minimize: false,
})

module.exports = mongoose.model('JobExport', JobExportSchema, 'jobExports')
