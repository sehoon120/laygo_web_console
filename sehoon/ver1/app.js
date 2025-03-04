const express = require('express');
const dbConnect = require('./config/dbConnect');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');


const app = express();

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.static('./public'));

app.use(methodOverride('_method'));

dbConnect();


// 바디파서 등록
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

// routes
app.use('/', require('./routes/loginRoutes'));
app.use('/logout', require('./routes/logoutRoutes'));   // 로그아웃 라우트트
app.use('/main', require('./routes/middleRoutes'));     // 미들웨어 테스트 -> 토큰검사
app.use('/main', require('./routes/contactRoutes'));


app.use((req, res, next) => {       // 에러 페이지지
    res.render('404');
    next();
});


app.listen(3000, () => {
    console.log('server is running');
});



// app.get('/', (req, res) => {
//     res.sendFile(__dirname + "/index.html");
// })