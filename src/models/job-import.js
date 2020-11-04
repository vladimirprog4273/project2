const mongoose = require('mongoose')

const { Schema } = mongoose

const JobSchema = new Schema({
  fileId: String,
  status: { type: String, default: 'created' },
  resource: String,
  columns: [String],
  options: Object,
  completedAt: Date,
  stats: {
    countCSVEntries: { type: Number, default: 0 },
    countImported: { type: Number, default: 0 },
    countCreated: { type: Number, default: 0 },
    countUpdated: { type: Number, default: 0 },
    countDeleted: { type: Number, default: 0 },
    countFailed: { type: Number, default: 0 },
    countSkipped: { type: Number, default: 0 },
    countUnplaced: { type: Number, default: 0 },
  },
  session_id: String,
}, {
  timestamps: true,
  minimize: false,
})

module.exports = mongoose.model('JobImport', JobSchema, 'jobImports')
