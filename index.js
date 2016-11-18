const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

const timestamp = require('./routes/timestamp')
const filesize = require('./routes/filesize')
const shortener = require('./routes/shortener')
const imagesearch = require('./routes/imagesearch')

const config = require('./config.js')

const app = express()

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://' + config.db.host + '/' + config.db.name)

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.set('port', process.env.PORT || 3000)

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.get('/', function(req, res) {
  res.render('index')
})

app.get('/whoami', function(req, res) {
  let ipaddresss = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  res.send({
    'ipaddresss': ipaddresss,
    'language': req.headers['accept-language'],
    'software': req.headers['user-agent']
  })
})

app.use('/timestamp', timestamp)
app.use('/filesize', filesize)
app.use('/shortener', shortener)
app.use('/imagesearch', imagesearch)

app.listen(app.get('port'), function() {
  console.log(`Server ready on port: ${app.get('port')}`)
})
