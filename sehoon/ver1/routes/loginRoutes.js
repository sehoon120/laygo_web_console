const express = require('express');
const router = express.Router();

const {
    getLogin, 
    loginUser, 
    getRegister, 
    registerUser,
    sendVerificationEmail,
    verifyEmailCode
} = require('../controllers/loginController');

router.route('/')
    .get(getLogin)
    .post(loginUser);

router.route('/register')
    .get(getRegister)
    .post(registerUser);

router.route('/sendVerificationEmail')
    .post(sendVerificationEmail);

router.route('/sendVerificationEmail')
    .post(verifyEmailCode);

module.exports = router;