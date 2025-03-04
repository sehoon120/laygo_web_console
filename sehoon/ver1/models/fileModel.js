const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema( {
    filetype: {
        type: String,
        required: true
    },
    lines: {
        type: String
    }
});


module.exports = mongoose.model('User', UserSchema);