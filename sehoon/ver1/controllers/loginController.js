const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const bcrypt = require('bcrypt');
require('dotenv').config();
const jwtSecret= process.env.JWT_SECRET;
const jwt = require('jsonwebtoken');


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
    const {username, password, password2} = req.body;
    if (password === password2) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create( { username, password: hashedPassword});
        // res.json( {message: "Register successed", user});
        res.redirect('/');
    } else {
        res.send("Register Failed");
    }
});
// alpha    1234


module.exports = {getLogin, loginUser, getRegister, registerUser};