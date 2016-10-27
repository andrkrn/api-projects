const express = require('express')
const Base62 = require('base62')
const mongoose = require('mongoose')

const router = express.Router()

const Url = require('../models/url')

router.use(function(req, res, next) {
  console.log('Shortener Route')
  console.log(req.method)
  next()
})

router.get('/', function(req, res) {
  res.render('shortener/index')
})

router.get('/list', function(req, res) {
  Url.find({}, function(err, urls) {
    res.render('shortener/list', {
      urls: urls
    })
  })
})

router.get('/:encoded_id', function(req, res) {
  if (req.params.encoded_id) {
    Url.findOne({ _id: Base62.decode(req.params.encoded_id) }, function(err, doc) {
      res.redirect(301, doc.long_url)
    })
  } else {
    res.render('shortener/index')
  }
})

router.post('/shorten', function(req, res) {
  let long_url = req.body.url;

  Url.findOne({long_url: long_url}, function(err, url) {
    if (url) {
      console.log('URL: ' + url)
      let short_url = 'http://localhost:3000/shortener/' + url.slug
      res.send({'short_url': short_url})
    } else {
      let new_url = new Url({ long_url: long_url })

      new_url.save(function(err) {
        if (err) { console.log(err) }

        let short_url = 'http://localhost:3000/shortener/' + new_url.slug
        res.send({'short_url': short_url})
      })
    }
  })
})

router.get('/delete/:id', function(req, res) {
  Url.findOne({ _id: req.params.id }, function(err, doc) {
    if (err) {
      console.log(err)
      res.send(err)
    } else {
      doc.remove()
      res.redirect('/shortener/list')
    }
  })
})

module.exports = router
