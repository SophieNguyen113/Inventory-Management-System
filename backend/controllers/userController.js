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

    if (passwordIsCorrect) {
        res.cookie("token", token, {
            path: "/",
            httpOnly: true,
            exprires: new Date(Date.now() + 1000 * 86400),
            sameSite: "none",
            secure: true
        })
    }


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

const logoutUser = asyncHandler (async (req, res) => {
    res.cookie("token", "", {
        path: "/",
        httpOnly: true,
        exprires: new Date(0),
        sameSite: "none",
        secure: true
    })
    return res.status(200).json({message: "Successfully Logged Out"})
})

const getUser = asyncHandler (async (req, res) => {
    const user = await User.findById(req.user._id)

    if (user) {
        const { _id, name, email, photo, phone, bio } = user;
        res.status(200).json({
            _id, name, email, photo, phone, bio, 
        });     
    } else {
        res.status(400);
        throw new Error('User Not Found');   
    }
})

const loginStatus = asyncHandler (async (req, res) => {
    const token = req.cookies.token
        if(!token){
            return res.json(false)
        }
    
    const verified = jwt.verify(token, process.env.JWT_SECRET)
    if(verified){
        return res.json(true)
    }
    return res.json(false)
})

const updateUser = asyncHandler (async (req, res) => {
    const user = await User.findById(req.user._id)

    if (user) {
        const { name, email, photo, phone, bio } = user;
        user.email = email
        user.name = req.body.name || name
        user.phone = req.body.phone || phone
        user.bio = req.body.bio || bio
        user.photo = req.body.photo || photo

        const updatedUser = await user.save()
    res.status(200).json({
        _id: updatedUser._id, 
        name: updatedUser.name, 
        email: updatedUser.email, 
        photo: updatedUser.photo, 
        phone: updatedUser.phone, 
        bio: updatedUser.bio,
    })
    } else {
        res.status(404);
        throw new Error('User not found');  
    }

})

const changePassword = asyncHandler (async (req, res) => {
    res.send('Sccuesslly HCnage dPasswordc')
})

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    getUser,
    loginStatus,
    updateUser,
    changePassword
}