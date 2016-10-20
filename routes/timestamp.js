const express = require('express')
const moment = require('moment');
const router = express.Router()

const acceptable_formats = [
  'MMMM DD, YYYY',
  'MMMM-DD-YYYY',
  'DD MMMM YYYY',
  'DD MMMM, YYYY',
  'DD-MMMM-YYYY',
]

router.use(function(req, res, next) {
  next()
})

router.get('/', function(req, res) {
  res.render('timestamp/index')
})

router.get('/:timestamp', function(req, res) {
  let time = moment(req.params.timestamp, acceptable_formats, true);
  time = time.isValid() ? time : moment.unix(req.params.timestamp);

  if (time.isValid()) {
    res.json({
      unix: time.format('X'),
      natural: time.format('MMMM DD, YYYY')
    })
  } else {
    res.json({
      unix: null,
      natural: null
    })
  }
})

module.exports = router
