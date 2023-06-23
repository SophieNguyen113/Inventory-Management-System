const mongoose = require('mongoose');

const tokenSchema = mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,   
        required: true,
        ref: "User"
    },
    token: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true
    },
    expriresAt: {
        type: Date,
        required: true
    }
});

const Token = mongoose.model('Token', tokenSchema); 

module.exports = Token; 