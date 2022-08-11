const express = require('express')
const Product = require('../models/productModel')
const productRouter = express.Router()

productRouter.get('/', async (req, res)=>{
    const products = await Product.find()
    res.send(products)
})
productRouter.get('/:slug', async (req, res)=>{
    const slug = req.params.slug
    const product = await Product.findOne({slug: slug})
    if(product){
        res.send(product)
    }else{
        res.status(404).send('Product not found')
    }
})

module.exports = productRouter