var express = require('express');
var router = express.Router();
var db = require('../db'); //하나 올라가서 가져오므로 ../

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

//로그인페이지
router.get('/login', function(req,res){
    res.render('index', {title:'로그인', pageName:'users/login.ejs'})
});

//로그인 체크
router.post('/login', function(req,res){ //post -> req 요청
    const uid=req.body.uid;
    const upass=req.body.upass;
    const sql='select * from users where uid=?';
    db.get().query(sql, [uid], function(err, rows){ // get() 함수라서 소괄호/ query 메소드/ [uid] 배열값 /에러, 결과
        let result='0'; //초기값 (아이디가 없다)
        if(rows[0]){//id가 있으면?
            if(rows[0].upass == upass){
                result = '1'; //성공
            }else{
                result = '2';
            }
        }
        res.send(result);
    });
});

module.exports = router;