const mongoose = require('mongoose')
const autoIncrement = require('mongoose-auto-increment')

autoIncrement.initialize(mongoose.connection)

const UrlSchema = new mongoose.Schema({
  long_url: String,
  slug: String,
  created_at: Date
})

UrlSchema.plugin(autoIncrement.plugin, {
  model: 'Url',
  startAt: 10000
})

const Url = mongoose.model('Url', UrlSchema)

module.exports = Url
