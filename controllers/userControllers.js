const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const User = require('../models/userModel')

//@desc Signin a user
//@routes POST api/users/signin
//@access Public
const signinUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (user && await (bcrypt.compare(password, user.password))) {
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: getToken(user._id),
        })
    } else {
        res.status(401)
        throw new Error('Invalid crediantials')
    }
})


//@desc Signin a user
//@routes POST api/users
//@access private (Admin)
const getAllUsers = asyncHandler(
    async (req, res) => {
        const allUsers = await User.find({}).select('-password')
        res.status(200).json(allUsers)
    }
)

//@desc update user
//@route PUT api/users/profile
//@access private
const updateUserProfile = asyncHandler(
    async (req, res) => {
        const user = await User.findById(req.user._id)
        if (user) {
            user.name = req.body.name || user.name
            user.email = req.body.email || user.email
            if (req.body.password) {
                user.password = bcrypt.hashSync(req.body.password, 8)
            }
            const updatedUser = await user.save()
            res.status(200).json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                isAdmin: updatedUser.isAdmin,
                token: getToken(updatedUser._id)
            })
        }else{
            res.status(404).json("user not found")
        }

    }
)

function getToken(id) {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' })
}

module.exports = {
    signinUser,
    getAllUsers,
    updateUserProfile,
}