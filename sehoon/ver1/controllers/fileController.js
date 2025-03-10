const asyncHandler = require('express-async-handler');
const File = require('../models/fileModel');


// GET  /
const getAllContacts = asyncHandler(async (req, res) => {
    // console.log(req.user);
    // console.log(req.user.username);
    // console.log(Object.getOwnPropertyNames(req));
    File.find({ user: req.user.username })
        .then(files => {
        res.render('getallfiles', { files });
        // console.log(files);
        })
        .catch(err => {
        console.error(err);
        res.status(500).send('파일 데이터를 불러오는 중 오류가 발생했습니다.');
    });
    // test
    // const contacts = await File.find();
    // res.render('getallfiles', { user: user, files: File});
});

// add file
// GET  /add
const addContactForm = (req, res) => {
    // console.log(req.user);
    res.render('add');
}


// save added file
// POST /add
const createContact = asyncHandler(async (req, res) => {
    // console.log(req.body);
    // console.log(req.user);
    // console.log(Object.getOwnPropertyNames(req));


    const {filename, filetype} = req.body;
    if (!filename || !filetype){
        return res.send('essential data is not written');
    }
        const file = await File.create({
        user: req.user.username, filename: filename, filetype: filetype, filePath: "test"
    });

    // const{name, mail, phone} = req.body;
    // if (!name || !mail|| !phone){
    //     return res.send('essential data is not written');
    // }

    // const contact = await Contact.create({
    //     name, mail, phone
    // });
    res.redirect('/main');
});

// edit file
// GET  /:id
const getContact = asyncHandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id);
    res.render('update', { contact: contact});

});

// change file
// PUT
const updateContact = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const {name, mail, phone} = req.body;

    const contact = await Contact.findById(id);
    if (!contact) {
        throw new Error('contact not found.');
    }

    contact.name = name;
    contact.mail = mail;
    contact.phone = phone;
    contact.save();
    res.redirect('/main');
});

// delete file
// DEL
const deleteContact = asyncHandler(async (req, res) => {
    const id = req.params.id;
    await Contact.findByIdAndDelete(id);
    res.redirect('/main')

});


module.exports = {
    getAllContacts, 
    createContact,
    getContact,
    updateContact,
    deleteContact,
    addContactForm
};

