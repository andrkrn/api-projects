const mongoose = require('mongoose')
const autoIncrement = require('mongoose-auto-increment')

autoIncrement.initialize(mongoose.connection)

const HistorySchema = new mongoose.Schema({
  query: String,
  created_at: Date
})

HistorySchema.plugin(autoIncrement.plugin, {
  model: 'History',
})

const History = mongoose.model('History', HistorySchema)

module.exports = History
