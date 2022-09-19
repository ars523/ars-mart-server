const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const User = require('../models/userModel')

//@desc Signin a user
//@routes POST api/users/signin
//@access Public
const signinUser = asyncHandler(async (req, res)=>{ 
    const {email, password} = req.body
    const user = await User.findOne({email})
    if(user && await(bcrypt.compare(password, user.password))){
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: getToken(user._id),
        })
    }else{
        res.status(401)
        throw new Error('Invalid crediantials')
    }
})

function getToken(id){
    return jwt.sign({id},process.env.JWT_SECRET ,{expiresIn: '30d'})
}

module.exports = {signinUser}