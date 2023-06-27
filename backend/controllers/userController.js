const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');  
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); 
const Token = require('../models/tokenModel');  
const crypto = require('crypto');

const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: "1d"})
};

// Register user
const registerUser = asyncHandler (async (req, res) => {
    const { name, email, password } = req.body;

    // Check if user exists
    if (!name || !email || !password) {
        res.status(400);
        throw new Error('Please fill in all fields');   
    }

    if (password.length < 6) {
        res.status(400);
        throw new Error('Password must be at least 6 characters');   
    }   

    // Check if user email exists
    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error('User already exists');   
    }

    // Create new user
    const user = await User.create({ 
        name,
        email,
        password,
    })

    // Create token
    const token = generateToken(user._id);

    // Send HTTP-only cookie
    if (passwordIsCorrect) {
        res.cookie("token", token, {
            path: "/",
            httpOnly: true,
            exprires: new Date(Date.now() + 1000 * 86400), // 1 day
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

// Login user
const loginUser = asyncHandler( async (req, res) => {
    
    const {email, password} = req.body

    // Validate email and password
    if (!email || !password) {
        res.status(400);
        throw new Error('Please add email and password');   
    }

    // Check if user exists
    const user = await User.findOne({email});

    if (!user) {
        res.status(400);
        throw new Error('User not found, please sign up');   
    }

    // User exists, check if password is correct
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

// Logout user
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

// Get user profile 
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

// Login status
const loginStatus = asyncHandler (async (req, res) => {
    const token = req.cookies.token
        if(!token){
            return res.json(false)
        }
    // Verify token
    const verified = jwt.verify(token, process.env.JWT_SECRET)
    if(verified){
        return res.json(true)
    }
    return res.json(false)
})

// Update user profile  
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

// Change password, not forgot password
const changePassword = asyncHandler (async (req, res) => {
    const user = await User.findById(req.user._id)

    const { oldPassword, password } = req.body;

    if (!user) {
        res.status(400);
        throw new Error('User not found, please sign up');   
    }

    // Validate email and password
    if (!oldPassword || !password) {
        res.status(400);
        throw new Error('Please add old and new password');

    }

    // Check if old password matches password in database
    const passwordIsCorrect = await bcrypt.compare(oldPassword, user.password)

    if (user && passwordIsCorrect){
        user.password = password
        await user.save()
        res.status(200).send("Password Changed Successfully")  
    } else {
        res.status(400);
        throw new Error('Old password is incorrect');
    }
})

// Forgot password
const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
  
    if (!user) {
      res.status(404);
      throw new Error("User does not exist");
    }
    
    // Delete any existing reset tokens
    let token = await Token.findOne({ userId: user._id });
    if (token) {
      await token.deleteOne();
    }
  
    // Create reset token
    let resetToken = crypto.randomBytes(32).toString("hex") + user._id;
    console.log(resetToken);
    
    // Hash reset token and save to database
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Save token to database
    await new Token({
      userID: user._id,
      token: hashedToken,
      createdAt: Date.now(),
      expriresAt: Date.now() + 30 * (60 * 1000), // 30 minutes
    }).save();
    
    // Construct reset password url
    const resetUrl = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`;
    
    // Reset email template
    // const message = `
    //     <h2>Hello ${user.name}</h2>
    //     <p>Please use the url below to reset your password</p>  
    //     <p>This reset link is valid for only 30minutes.</p>
  
    //     <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
  
    //     <p>Warm wishes,</p>
    //     <p>Sophie Nguyen</p>
    //   `;

    const message = `
    <html>
      <head>
        <style>
          /* CSS styles for the email */
          body {
            font-family: Arial, sans-serif;
            line-height: 1.5;
          }
    
          h2 {
            color: #333333;
          }
    
          p {
            color: #555555;
          }
    
          a {
            color: #007bff;
            text-decoration: none;
          }
        </style>
      </head>
    
      <body>
        <div>
          <h2>Hello ${user.name},</h2>
    
          <p>We noticed that you need to reset your password.</p>
    
          <p>Please click the button below to securely reset your password:</p>
    
          <p style="text-align: center;">
            <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #ffffff; border-radius: 5px; text-decoration: none;">Reset Password</a>
          </p>
    
          <p style="font-size: 12px;">Note: This reset link is valid for 30 minutes only.</p>
    
          <p>If you didn't request a password reset, you can safely ignore this email.</p>
    
          <p>Warm wishes,</p>
    
          <p>Your Support Team</p>

          <p>Sophie Nguyen</p>
        </div>
      </body>
    </html>
  `;
  

    const subject = "Password Reset Request";
    const send_to = user.email;
    const sent_from = process.env.EMAIL_USER;
  
    try {
      await sendEmail(subject, message, send_to, sent_from);
      res.status(200).json({ success: true, message: "Reset Email Sent" });
    } catch (error) {
      res.status(500);
      throw new Error("Email not sent, please try again");
    }
  });

// Reset password
const resetPassword = asyncHandler(async (req, res) => {
    const { password } = req.body;
    const { resetToken } = req.params;
  
    // Hash token and compare with database
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
  
    // Find token in database
    const userToken = await Token.findOne({
      token: hashedToken,
      expiresAt: { $gt: Date.now() },
    });
  
    if (!userToken) {
      res.status(404);
      throw new Error("Invalid or Expired Token");
    }
    
    // Find user and update password
    const user = await User.findOne({ _id: userToken.userId });
    user.password = password;
    await user.save();
    res.status(200).json({
      message: "Password Reset Successful, Please Login",
    });
  });


module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    getUser,
    loginStatus,
    updateUser,
    changePassword,
    forgotPassword,
    resetPassword
}