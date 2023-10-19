var express = require('express');
var router = express.Router();
var db = require('../db'); //하나 올라가서 가져오므로 ../
var multer=require('multer');

//업로드함수
var upload = multer({
    storage:multer.diskStorage({
        destination:(req,file, done) => {
            done(null,'./public/upload/photo')
        },
        filename:(req, file, done)=>{
            var fileName=Date.now() + ".jpg";
            done(null, fileName);
        }
    })
});


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

// 회원가입페이지 이동
router.get('/insert', function(req,res){
    res.render('index',{title:'회원가입', pageName:'users/insert.ejs'})
});

//회원가입
router.post('/insert', function(req,res){
    const uid=req.body.uid;
    const upass=req.body.upass;
    const uname=req.body.uname;
    const phone=req.body.phone;
    const address1=req.body.address1;
    const address2=req.body.address2;
    console.log(uid, upass, uname, phone, address1, address2);
    const sql='insert into users(uid, upass, uname, phone, address1, address2) values(?,?,?,?,?,?)';
    db.get().query(sql,[uid, upass, uname, phone, address1, address2], function(err, rows){
        res.redirect('/users/login');
    });
});

// 마이페이지 이동
router.get('/mypage', function(req,res){ 
    const uid=req.query.uid;
    const sql='select * from users where uid=?';
    db.get().query(sql, [uid], function(err,rows){
        //console.log('..............', rows[0]);
        res.render('index', {title:'마이페이지', pageName:'users/mypage.ejs', user:rows[0]});
    });
});

//수정페이지 이동
router.get('/update', function(req,res){
    const uid=req.query.uid;
    const sql='select * from users where uid=?';
    db.get().query(sql, [uid], function(err,rows){
        //console.log('..............', rows[0]);
        res.render('index', {title:'정보수정', pageName:'users/update.ejs', user:rows[0]});
    });
});

//정보수정하기
router.post('/update', upload.single('file'), function(req,res){
    const uname = req.body.uname;
    const uid= req.body.uid;
    const phone=req.body.phone;
    const address1=req.body.address1;
    const address2=req.body.address2;
    let photo=req.body.photo;
    if(req.file) photo=req.file.filename;
    const sql='update users set uname=?,phone=?,address1=?,address2=?, photo=? where uid=?';
    db.get().query(sql,[uname,phone,address1,address2,photo,uid], function(err, rows){
        if(err) console.log('sql 오류 ..............', err); //sql에서 틀린 것 찾아내기 위한 코드
        res.redirect('/users/mypage?uid=' + uid);
    });
});

//비밀번호변경 페이지 이동  // get 가져오는, 연동시켜주는  post데이터수정
router.get("/change", function(req, res) {
    res.render("index", {title:"비밀번호변경", pageName:"users/change.ejs"});
});

//비밀번호 변경
router.post("/change", function(req, res){
    const uid=req.body.uid;
    const upass=req.body.npass;
    const sql='update users set upass=? where uid=?';
    db.get().query(sql, [upass,uid],function(err,rows){
        if(err) console.log(err);
        res.sendStatus(200);
    });
});

module.exports = router;