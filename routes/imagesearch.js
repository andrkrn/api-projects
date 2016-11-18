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
  next()
})

router.get('/', function(req, res) {
  res.send('Welcome to image route!')
})

router.get('/latest', function(req, res) {
  History.find({}, null, {
    limit: 10,
    sort: {
      created_at: -1,
    }
  }, function(err, docs) {
    if (err) return console.error(err);
    res.json(docs)
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
