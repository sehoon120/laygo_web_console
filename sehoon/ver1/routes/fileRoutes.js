const express = require('express');
const router = express.Router();

const {
    getAllContacts, 
    createContact,
    getContact,
    updateContact,
    deleteContact,
    addContactForm
} = require('../controllers/fileController');

router.route('/')
    .get(getAllContacts);

// // 연락처 가져오기
// app.get('/contacts', (req, res) => {
//     res.send('Contacts Page');
// });

// //새 연락처 추가
// app.post('/contacts', (req, res) => {
//     res.send('Create Contacts');
// });

router.route('/add')
    .get(addContactForm)
    .post(createContact);


router.route('/:id')
    .get(getContact)
    .put(updateContact)
    .delete(deleteContact);


// //특정 연락처 가져오기
// app.get('/contacts/:id', (req, res) => {
//     res.send(`View Contact for ID : ${req.params.id}`);
// });

// //연락처 수정
// app.put('/contacts/:id', (req, res) => {
//     res.send(`Update Contact for ID : ${req.params.id}`);
// });

// //연락처 삭제
// app.delete('/contacts/:id', (req, res) => {
//     res.send(`Delete Contact for ID : ${req.params.id}`);
// });


module.exports = router;
