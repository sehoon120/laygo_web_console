// Get all contacts
// GET /contacts
const asyncHandler = require('express-async-handler');

const Contact = require('../models/contactModel');
const { use } = require('../routes/contactRoutes');



// const getAllContacts = async (req, res) => {
//     try {
//         res.send('Contacts Page');
//     } catch(error) {
//         res.send(error);
//     }
// };

// GET
const getAllContacts = asyncHandler(async (req, res) => {
    const contacts = await Contact.find();
    // res.send(contact);
    // const users = [
    //     {name: 'AA', mail: 'sdkljfdslkh@naver.com', phone: '0000'},
    //     {name: 'BB', mail: 'gwefgwwere@naver.com', phone: '08913754'}
    // ];
    // res.render('getAll', {users: users});
    res.render('index', { contacts: contacts});
});

// View add contact form
// GET  /contacts/add
const addContactForm = (req, res) => {
    res.render('add');
}


// POST
const createContact = asyncHandler(async (req, res) => {
    console.log(req.body);
    const{name, mail, phone} = req.body;
    if (!name || !mail|| !phone){
        return res.send('essential data is not written');
    }

    const contact = await Contact.create({
        name, mail, phone
    });
    // res.send('Create Contacts');
    res.redirect('/main');
});

// GET
const getContact = asyncHandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id);
    res.render('update', { contact: contact});
    // res.send(`View Contact for ID : ${req.params.id}
    //     ${contact}
    //     `);
});

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
    // res.send(`Update Contact for ID : ${req.params.id}
    //     ${contact}
    //     `);
    // res.json(contact);  // 결과 표시

    res.redirect('/main');
});

// DEL
const deleteContact = asyncHandler(async (req, res) => {
    const id = req.params.id;
    // const contact = await Contact.findById(id);
    // if (!contact) {
    //     throw new Error('contact not found.');
    // }
    // await contact.deleteOne();
    await Contact.findByIdAndDelete(id);
    // res.send(`Delete Contact for ID : ${req.params.id}
    //     Deleted
    //     `);
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

