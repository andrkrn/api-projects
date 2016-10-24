const mongoose = require('mongoose')
const autoIncrement = require('mongoose-auto-increment')

const UrlSchema = new mongoose.Schema({
  _id: { type: Number, index: true },
  long_url: String,
  slug: String,
  created_at: Date
})

autoIncrement.initialize(mongoose.connection)

UrlSchema.plugin(autoIncrement.plugin, 'Url')
const Url = mongoose.model('Url', UrlSchema)

module.exports = Url
