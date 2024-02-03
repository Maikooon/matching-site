var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
  console.log('aaaaaaa');
});

module.exports = router;





// これも使用されているのかわからないのでのちに悪女
