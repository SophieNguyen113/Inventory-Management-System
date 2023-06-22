const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');    
const bcrypt = require('bcryptjs'); 

const registerUser = asyncHandler (async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        res.status(400);
        throw new Error('Please fill in all fields');   
    }

    if (password.length < 6) {
        res.status(400);
        throw new Error('Password must be at least 6 characters');   
    }   

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error('User already exists');   
    }

    const user = await User.create({ 
        name,
        email,
        password
    })

    if (user) {
        const { _id, name, email, photo, phone, bio } = user;
        res.status(201).json({
            _id, name, email, photo, phone, bio
        });     
    } else {
        res.status(400);
        throw new Error('Invalid user data');   
    }


});

module.exports = {
    registerUser,
}