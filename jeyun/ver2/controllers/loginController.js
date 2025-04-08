const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const bcrypt = require('bcrypt');
require('dotenv').config();
const jwtSecret= process.env.JWT_SECRET;
const jwt = require('jsonwebtoken');
const transporter = require('../config/mailer');

// GET login page
const getLogin = (req, res) => {
    res.render('home');
};

// POST login user
const loginUser = asyncHandler(async(req, res) => {
    const { username, password } = req.body;
    // console.log(`${username}, ${password}`);

    const user = await User.findOne({username});
    if (!user) {
        return res.json({ message: '일치하는 사용자가 없습니다.'});
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.json({ message: '비밀번호가 일치하지 않습니다.'});
    }

    const token = jwt.sign({username: username, id: user._id}, jwtSecret, { expiresIn: '12h' });
    res.cookie('token', token, {httpOnly: true});
    res.redirect('/main');

});

// GET register page
const getRegister = (req, res) => {
    res.render('register');
};

// POST register user
const registerUser = asyncHandler(async(req, res) => {
    const {username, password, password2, email, num} = req.body;
    if (password === password2) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create( { username, password: hashedPassword, email});
        // res.json( {message: "Register successed", user});
        // req.session.username = username;
        // req.session.password = hashedPassword;
        // req.session.email = email;
        res.redirect('/');
    } else {
        res.send("Register Failed");
    }
});
// alpha    1234



const sendVerificationEmail = async (req, res) => {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    const { email } = req.body;
    // 6자리 인증 코드 생성
    const code = Math.floor(100000 + Math.random() * 900000);
    
    // 세션에 인증 코드와 이메일을 저장 (나중에 비교하기 위함)
    req.session.verificationCode = code;
    req.session.verificationEmail = email;

    const mailOptions = {
      from: process.env.NAVER_USER,
      to: email,
      subject: 'Laygo Web Console 이메일 인증 코드',
      text: `인증 코드는 ${code} 입니다.`
    };

    try {
      await transporter.sendMail(mailOptions);
    //   res.json({ success: true, message: '인증 메일 전송 성공', code: code });
      res.json({ success: true, message: '인증 메일 전송 성공'});
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: '메일 전송 실패' });
    }
};


const verifyEmailCode = (req, res) => {
    const { email, code } = req.body;
    
    // 세션에 저장된 인증 코드와 이메일이 존재하는지 확인합니다.
    if (req.session.verificationCode && req.session.verificationEmail) {
      // 세션에 저장된 이메일과 코드가 클라이언트에서 전송된 값과 일치하는지 확인합니다.
      if (
        req.session.verificationEmail === email &&
        req.session.verificationCode.toString() === code
      ) {
        // 인증 성공 시 세션에 저장된 인증 정보를 삭제합니다.
        delete req.session.verificationCode;
        delete req.session.verificationEmail;
        return res.json({ success: true, message: '이메일 인증 성공' });
      } else {
        // 인증 정보가 일치하지 않을 경우 에러를 반환합니다.
        return res.status(400).json({ success: false, message: '인증 코드가 올바르지 않습니다.' });
      }
    } else {
      // 세션에 인증 코드가 없거나 만료된 경우
      return res.status(400).json({ success: false, message: '인증 코드가 만료되었거나 존재하지 않습니다.' });
    }
  };
  



module.exports = {getLogin, loginUser, getRegister, registerUser, sendVerificationEmail, verifyEmailCode};