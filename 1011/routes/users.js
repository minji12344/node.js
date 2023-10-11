var express = require('express');
var router = express.Router();
var db = require('../db'); //하나 올라가서 가져오므로 ../

/* 사용자목록 페이지  */
router.get('/', function(req, res, next) {
    res.render('index', {title:'사용자목록', pageName:'users/list.ejs'})
});

//사용자목록 JSON
router.get('/list.json', function(req, res){
    const sql='select * from users order by uname'; //order by 정렬
    db.get().query(sql, function(err, rows){
        res.send(rows);
    });
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

// 회원가입 페이지 이동
router.get('/insert', function(req,res){
    res.render('index', {title:'회원가입', pageName:'users/insert.ejs'});
});

// 회원가입 -> 서브쪽으로 전송함
router.post('/insert', function(req,res){
    const uid=req.body.uid;
    const upass=req.body.upass;
    const uname=req.body.uname;
    const phone=req.body.phone;
    const address1=req.body.address1;
    const address2=req.body.address2;
    console.log(uid,upass,uname,phone,address1,address2);
    const sql="insert into users(uid,upass,uname,phone,address1,address2) values(?,?,?,?,?,?)"; //오류날 경우 sql 오류가 남
    db.get().query(sql,[uid,upass,uname,phone,address1,address2], function(err, rows){
        res.redirect('/users/login') // 성공했을경우 로그인화면으로 이동
    });
});
module.exports = router;