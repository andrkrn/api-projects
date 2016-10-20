const express = require('express')
const path = require('path')

const timestamp = require('./routes/timestamp')
const filesize = require('./routes/filesize')

const app = express()

app.set('port', process.env.PORT || 3000)

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.get('/', function(req, res) {
  res.send('Something went wrong')
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

app.listen(app.get('port'), function() {
  console.log(`Server ready on port: ${app.get('port')}`)
})
