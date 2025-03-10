const asyncHandler = require('express-async-handler');
const File = require('../models/fileModel');


const getAllContacts = asyncHandler(async (req, res) => {
    File.find({ user: req.user.username })
        .sort({ updatedAt: -1 })  // updatedAt 필드를 기준으로 내림차순 정렬
        .then(files => {
            res.render('getallfiles', { files });
        })
        .catch(err => {
            console.error(err);
            res.status(500).send('파일 데이터를 불러오는 중 오류가 발생했습니다.');
        });
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

// change file
// GET  /:id
const getContact = asyncHandler(async (req, res) => {
    const file = await File.findById(req.params.id);
    res.render('update', { file: file});

});

// change file name
// PUT
const updateContact = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const {name, type, path} = req.body;

    const file = await File.findById(id);
    if (!file) {
        throw new Error('File not found.');
    }

    file.filename = name;
    file.filetype = type;
    file.filePath = path;
    file.save();
    res.redirect('/main');
});

// delete file
// DEL
const deleteContact = asyncHandler(async (req, res) => {
    // console.log(req.params.id)
    const id = req.params.id;
    await File.findByIdAndDelete(id);
    res.redirect('/main')

});

// edit file
// GET
const editFile = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const file = await File.findById(id);
    res.render('edit', {file: file});
});


// save file
// PUT
const saveFile = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const { content } = req.body;

    const file = await File.findById(id);
    if (!file) {
        return res.status(404).json({ error: 'File not found.' });
    }

    file.content = content;
    await file.save();
    res.json({ success: true });
});




module.exports = {
    getAllContacts, 
    createContact,
    getContact,
    updateContact,
    deleteContact,
    addContactForm,
    editFile,
    saveFile
};

