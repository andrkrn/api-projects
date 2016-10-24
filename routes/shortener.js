const express = require('express')
const Base62 = require('base62')
const mongoose = require('mongoose')

const router = express.Router()

const Url = require('../models/url')

router.use(function(req, res, next) {
  console.log('Shortener Route')
  next()
})

router.get('/', function(req, res) {
  res.render('shortener/index')
})

router.get('/:encoded_id', function(req, res) {
  console.log(Base62.encode('g7'))
  Url.findOne({_id: req.params.encoded_id}, function(err, doc) {
    res.send(doc)
  })
})

router.post('/shorten', function(req, res) {
  let long_url = req.body.url;

  Url.findOne({long_url: long_url}, function(err, url) {
    if (url) {
      console.log('URL: ' + url)
      let short_url = 'http://localhost:3000/' + Base62.encode(url._id)
      res.send({'short_url': short_url})
    } else {
      let new_url = Url({
        long_url: long_url
      })

      new_url.save(function(err) {
        if (err) { console.log(err) }

        let short_url = 'http://localhost:3000/' + Base62.encode(new_url._id)
        res.send({'short_url': short_url})
      })
    }
  })
})

module.exports = router
