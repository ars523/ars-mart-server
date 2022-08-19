const asyncHandler = require('express-async-handler')
const jwt = require('jsonwebtoken')
const User = require('../models/userModel')
const protect =  asyncHandler(
    async (req, res, next) =>{
        let token

        if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
            try {
                //Get token from user
                token = req.headers.authorization.split(' ')[1]
                //Verify token
                const decoded = jwt.verify(token, process.env.JWT_SECRET)
                req.user = await User.findById(decoded.id).select('-password')

                next()
            } catch (error) {
                res.status(401)
                throw new Error('Not authorized')
            }
        }
        if(!token){
            res.status(401)
            throw new Error('Not authorized')
        }
    }
)
module.exports = protect