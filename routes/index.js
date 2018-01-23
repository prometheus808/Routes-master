var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

router.get('/able', function(req, res, next) {
    res.render('index', { title: 'AAAA' });
});

router.get('/baker', function(req, res, next) {
    res.render('index', { title: 'BBBB' });
});

router.get('/c', function(req, res, next) {
    res.render('index', { title: 'CCCCCCCC' });
});

module.exports = router;
