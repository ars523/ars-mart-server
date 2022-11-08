const express = require('express')
const userRouter = express.Router()
const {
    signinUser, 
    getAllUsers, 
    updateUserProfile,
    registerUser,
} = require('../controllers/userControllers')
const isAdmin = require('../middleware/adminMiddleware')
const protect = require('../middleware/authMiddleware')

userRouter.post('/register', registerUser)
userRouter.post('/signin', signinUser)
userRouter.put('/profile', protect, updateUserProfile)
userRouter.get('/', protect, isAdmin, getAllUsers)


module.exports = userRouter