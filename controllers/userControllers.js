const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const User = require('../models/userModel')


//@des Register new user
//@route /api/users/register
//@access Public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, confirmPassword } = req.body;
    if (!name || !email || !password || !confirmPassword) {
        res.status(400)
        throw new Error('Please include all fields')
    }
    //Check password matched or not
    if (password !== confirmPassword) {
        res.status(400)
        throw new Error('Password not matched')
    }
    //Find if user already exist
    const userExist = await User.findOne({ email })
    if (userExist) {
        res.status(400)
        throw new Error('User already exist')
    }

    //Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    //Create user
    const user = await User.create({
        name,
        email,
        password: hashedPassword
    })

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: getToken(user._id)
        })
    }
    else {
        res.status(400)
        throw new error('Invalid user data');
    }
})



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


//@desc get all users
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
        } else {
            res.status(404).json("user not found")
        }

    }
)

//@desc delete a user
//@routes DELETE api/users/:id
//@access private (Admin)
const deleteUser = asyncHandler(
    async (req, res) => {
        const id = req.params.id
        const user = await User.findById(id)
        if(!user){
            res.status(404)
            throw new Error('User not found')
        }
        const removedUser = await user.remove()
        res.status(200).json(removedUser)
    }
)

function getToken(id) {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' })
}

module.exports = {
    signinUser,
    getAllUsers,
    updateUserProfile,
    registerUser,
    deleteUser,
    
}