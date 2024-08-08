const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const memberSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    approved: {
        type: Boolean,
        default: false
    }
});



const Member = mongoose.model('Member', memberSchema);
module.exports = Member;