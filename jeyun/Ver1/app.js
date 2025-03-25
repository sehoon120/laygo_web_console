//코드 간단하게 하기: router, controller
const express = require('express');
const app = express();
const session = require('express-session');

const yaml = require('js-yaml');
const fs = require('fs');
var doc;

const mysql = require('mysql2');
const db_info = {
    host:   "localhost",
    port:   "3306",
    user:   "root",
    password:    "Jeyun0616!",            //실행 시 mysql root 암호 입력
    database:   "laygo",
    multipleStatements: true
};
const sql_connection = mysql.createConnection(db_info);
//sql_connection.connect();

app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 60*60*1000
    }
}))


try {
   doc = yaml.load(fs.readFileSync('./yaml/test1_pmos.yaml', 'utf8')); 
   console.info(doc);
} catch (e) {
   console.log(e);
}


//ejs로 views 폴더에 있는 내용 보여주기
app.set("view engine", "ejs");
app.set("views", "./views");

//root page로 요청 들어옴. render->ejs 이용
app.get("/", (req, res) =>{
    res.render("app")
})

app.get("/login", (req, res) =>{
    res.render("loginPage")
})

//입력이 POST로 들어옴
app.post("/login", (req, res) =>{
    const {userID, userPW} = req.body;
    sql_connection.query('SELECT * FROM user WHERE username = ? AND pw = ?', [userID, userPW], (error, results, fields) => {
        if(error) throw error;
        if(results.length > 0)
        {   
            req.session.userid = userID;
            res.redirect('/mypage');
        }
        else
        {   
            //실패 알림 띄우기
            res.render("loginPage", {loginResult: 'fail'});
        }
    })
})

app.get("/signup", (req, res) =>{
    res.render("signupPage")
})

app.post("/signup", (req, res) =>{
    const {userID, userPW} = req.body;
    sql_connection.query('SELECT * FROM user WHERE username = ?', [userID], (error, results, fields) => {
        if(error) throw error;
        if(results.length > 0)
        {
            res.send("이미 존재하는 ID임")
        }
        else
        {
            sql_connection.query('INSERT INTO user(username, pw, deposit) values (?, ?, ?)', [userID, userPW, 100], (error, results, fields) => {
                if(error) throw error;
                else{
                    res.redirect("/");
                }
            })
        }
    })
})

app.get("/mypage", (req, res) =>{
    res.render("myPage", {drawObjectDoc: doc})
})

//History의 foreign key constraint 수정: history는 user가 탈퇴해도 남아있어야 함.
app.get("/mypage/signout", (req, res) => {
    console.log('signout');
    console.log(req.session.userid);
    var userID = req.session.userid
    sql_connection.query('DELETE FROM user WHERE username = ?;', [userID], (error, results, fields) => {
        if(error) throw error;
        else
        {
            delete req.session.userid;
            req.session.save(function(){
                res.redirect('/');
            })
        }
    })

})

app.get("/mypage/logout", (req, res) => {
    console.log('logout');
    console.log(req.session.userid);
    delete req.session.userid;
    req.session.save(function(){
        res.redirect('/');
    })
})

app.post("/mypage", (req, res) =>{
    const {script} = req.body;
    res.redirect('/mypage')
})


//port 3000, callback function
app.listen(3000, ()=>{
    console.log('서버 실행중');
})