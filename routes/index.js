var express = require('express');
var router = express.Router();

router.get('/*', function (req, res) {
  res.render('index', { title: 'Intruo | Videogen' });
});

module.exports = router;
