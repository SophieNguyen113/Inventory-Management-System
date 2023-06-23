const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');  
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); 

const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: "1d"})
};


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
        password,
    })

    const token = generateToken(user._id);

    res.cookie("token", token, {
        path: "/",
        httpOnly: true,
        exprires: new Date(Date.now() + 1000 * 86400),
        sameSite: "none",
        secure: true
    })

    if (user) {
        const { _id, name, email, photo, phone, bio } = user;
        res.status(201).json({
            _id, name, email, photo, phone, bio, token,
        });     
    } else {
        res.status(400);
        throw new Error('Invalid user data');   
    }


});

const loginUser = asyncHandler( async (req, res) => {
    
    const {email, password} = req.body

    if (!email || !password) {
        res.status(400);
        throw new Error('Please add email and password');   
    }

    const user = await User.findOne({email});

    if (!user) {
        res.status(400);
        throw new Error('User not found, please sign up');   
    }

    const passwordIsCorrect = await bcrypt.compare(password, user.password)

    const token = generateToken(user._id);

    res.cookie("token", token, {
        path: "/",
        httpOnly: true,
        exprires: new Date(Date.now() + 1000 * 86400),
        sameSite: "none",
        secure: true
    })

    if(user && passwordIsCorrect) {
        const { _id, name, email, photo, phone, bio } = user;
        res.status(200).json({
            _id, name, email, photo, phone, bio, token,
        });  
    } else {
        res.status(400);
        throw new Error('Invalid email or password');   
    }

});

module.exports = {
    registerUser,
    loginUser,
}