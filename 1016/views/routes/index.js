var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: '홈페이지', pageName:'home.ejs' }); // res 응답 render 입력 // index 뷰 페이지 
});

module.exports = router;
