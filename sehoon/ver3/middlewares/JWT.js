const asyncHandler = require('express-async-handler');
require('dotenv').config();
const jwtSecret= process.env.JWT_SECRET;
const jwt = require('jsonwebtoken');

const { promisify } = require('util');
const verifyAsync = promisify(jwt.verify);

// function authenticateJWT(req, res, next) {
//   const authHeader = req.headers.authorization; // 'Bearer <token>' 형식

//   if (authHeader) {
//     const token = authHeader.split(' ')[1];

//     jwt.verify(token, jwtSecrest, (err, user) => {
//       if (err) {
//         return res.sendStatus(403);  // 토큰이 유효하지 않거나 만료된 경우
//       }
//       req.user = user;  // 토큰에서 추출한 사용자 정보를 req 객체에 추가
//       next();
//     });
//   } else {
//     res.sendStatus(401); // 토큰이 없는 경우
//   }
// }

const authenticateJWT =  asyncHandler(async(req, res, next) => {
    const token = req.cookies.token;
    // console.log('🪪 [AUTH] JWT Middleware 접근됨');
    // console.log('🪪 token:', token);
    if (!token) {
        return res.status(401).send(`세션이 만료되었습니다.`);
    }
    // console.log(token);
    try {
        const user = await verifyAsync(token, jwtSecret);
        req.user = user;
        // 템플릿 전역 변수로 사용자 정보 설정 (예: username)
        res.locals.user = user;
        // console.log(user);
        next();
    } catch (error) {
        // console.error(error);
        res.status(403).json({ success: false, message: '토큰 인증 실패 또는 만료되었습니다.' });
        // res.send(`세션이 만료되었습니다.`);
    }
});

module.exports = authenticateJWT;
