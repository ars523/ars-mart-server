const express = require('express');
const Product = require('../models/productModel.js');
const data = require('../data');
const User = require('../models/userModel.js');
const seedRouter = express.Router();

seedRouter.get('/', async(req, res)=>{
    await Product.remove({})
    const createdProducts = await Product.insertMany(data.products)
    await User.remove({})
    const createdUser = await User.insertMany(data.users)
    res.send(createdProducts)
})

module.exports = seedRouter