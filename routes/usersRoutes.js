const express = require('express')
const userRouter = express.Router()
const {signinUser, getAllUsers} = require('../controllers/userControllers')
const isAdmin = require('../middleware/adminMiddleware')
const protect = require('../middleware/authMiddleware')

userRouter.post('/signin', signinUser)
userRouter.get('/', protect, isAdmin, getAllUsers)


module.exports = userRouter