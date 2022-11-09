const express = require('express')
const userRouter = express.Router()
const {
    signinUser, 
    getAllUsers, 
    updateUserProfile,
    registerUser,
    deleteUser,
    updateUser,
    getUser,
} = require('../controllers/userControllers')
const isAdmin = require('../middleware/adminMiddleware')
const protect = require('../middleware/authMiddleware')

userRouter.post('/register', registerUser)
userRouter.post('/signin', signinUser)
userRouter.put('/profile', protect, updateUserProfile)
userRouter.get('/', protect, isAdmin, getAllUsers)
userRouter.delete('/:id', protect, isAdmin, deleteUser)
userRouter.put('/:id', protect, isAdmin, updateUser)
userRouter.get('/:id', protect, isAdmin, getUser)


module.exports = userRouter