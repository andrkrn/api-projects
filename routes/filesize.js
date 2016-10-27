const express = require('express')
const multer = require('multer')

const router = express.Router()
const upload = multer({
  dest: './public/uploads'
}).single('file')

router.use(function(req, res, next) {
  next()
})

router.get('/', function(req, res) {
  res.render('filesize/index')
})

router.post('/', function(req, res) {
  upload(req, res, function(err) {
    if (err) {
      res.send(err)
      return
    }

    res.json({
      size: req.file.size,
      mimetype: req.file.mimetype
    })
  })
})

module.exports = router
