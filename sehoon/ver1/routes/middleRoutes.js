const express = require('express');
const router = express.Router();
const authenticateJWT = require('../controllers/middleController');

// 보호된 라우트: JWT 인증이 필요한 엔드포인트

router.route('/')
    .get(authenticateJWT);

//   res.send(`세션이 만료되었습니다.`);


module.exports = router;
