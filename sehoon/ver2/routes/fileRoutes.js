const express = require('express');
const router = express.Router();
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const {
    getAllContacts, 
    createContact,
    getContact,
    updateContact,
    deleteContact,
    addContactForm,
    editFile,
    saveFile,
    getLogFile,
    drawLayout
} = require('../controllers/fileController');


router.route('/add')
    .get(addContactForm)
    .post(upload.single('uploadFile'), createContact);

// router.route('/add-directory')
//     .get(adddir)
//     .post(createDir);





router.route('/:id/edit/draw')
    .get(drawLayout);  // ✅ 새로 추가될 layout draw 전용 라우트

router.route('/:id/edit/logs')
    .get(getLogFile);

router.route('/:id/edit')
    .get(editFile)
    .put(saveFile);     // Save (with optional generate)

router.route('/:id')
    .get(getContact)
    .put(updateContact)
    .delete(deleteContact);

router.route('/')
    .get(getAllContacts);

    
module.exports = router;
