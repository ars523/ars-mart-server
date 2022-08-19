const express = require('express')
const userRouter = express.Router()
const {signinUser} = require('../controllers/userControllers')

userRouter.post('/signin', signinUser)


module.exports = userRouter