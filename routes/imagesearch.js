const express = require('express')
const bingSearch = require('bing.search')
const mongoose = require('mongoose')
const config = require('../config')

const router = express.Router()
const search = new bingSearch(config.bing_search_api)

const History = require('../models/history')
const PER_PAGE = 10

router.use(function(req, res, next) {
  console.log('API Route')
  console.log(req.method)
  console.log(req.protocol)
  console.log(req.get('host'))
  console.log(req.originalUrl)
  next()
})

router.get('/', function(req, res) {
  res.render('imagesearch/index')
})

router.post('/', function(req, res) {
  res.redirect(`${req.protocol}://${req.get('host')}/imagesearch/${req.body.query}`)
});

router.get('/latest', function(req, res) {
  History.find({}, null, {
    limit: 10,
    sort: {
      created_at: -1,
    }
  }, function(err, docs) {
    if (err) return console.error(err);
    res.json(docs.map(function(doc) {
      return {
        query: doc.query,
        when: doc.created_at
      }
    }))
  });
})

router.get('/:query', function(req, res) {
  let history = new History({
    query: req.params.query,
    created_at: new Date()
  })

  history.save();

  search.images(
    req.params.query,
    { top: PER_PAGE, skip: (req.query.offset * PER_PAGE || 0) },
    function(err, results) {
      res.json(results.map(json_structure));
    }
  );
})

function json_structure(obj) {
  return {
    url: obj.url,
    snippet: obj.title,
    thumbnail: obj.thumbnail.url,
    context: obj.sourceUrl
  }
}

module.exports = router
