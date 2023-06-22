const mongoose = require('mongoose');   
const userSchema = mongoose.Schema({
    name: {
        type: String,   
        required: [true, "Please enter your name"]
    },  
    email: {
        type: String,   
        required: [true, "Please enter your email"],
        unique: true,
        trim: true,
        match: [
            /^\s*[\w\-\+_]+(\.[\w\-\+_]+)*\@[\w\-\+_]+\.[\w\-\+_]+(\.[\w\-\+_]+)*\s*$/,
            "Please enter a valid email address"    
        ]
    } ,
    password: {   
        type: String,
        required: [true, "Please enter your password"],
        minLength: [6, "Your password must be at least 6 characters long"],
        maxLength: [23, "Your password must be at most 23 characters long"] 
    },
    photo: {
        type: String,
        required: [true, "Please add your photo"],
        default: "https://i.pinimg.com/736x/67/a6/56/67a65600a05aa8890c1e86379aa8cfee.jpg"
    },
    phone: {
        type: String,
        default: "+123"
    },
    bio: {
        type: String,
        maxLength: [250, "Your bio must be at least 250 characters long"],
        default: "bio"
    }
}, {
    timestamps: true,
}); 

const User = mongoose.model('User', userSchema);    

module.exports = User;  