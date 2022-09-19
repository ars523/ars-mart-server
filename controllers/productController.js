const asyncHandler = require('express-async-handler')
const Product = require('../models/productModel')

//@desc GET get all products
//@route /api/products
//@access public
const getProducts = asyncHandler(
    async (req, res) => {
        const products = await Product.find()
        res.status(200).json(products)
    }
)

//@desc GET get all products by admin
//@route /api/products/admin
//@access private (admin only)
const getProductsByAdmin = asyncHandler(
    async (req, res) => {
        const page = req?.query?.page || 1
        const pageSize = req.query.pageSize || 3
        const products = await Product.find().skip(pageSize * (page - 1)).limit(pageSize)
        const countProducts = await Product.countDocuments();
        res.status(200).json({
            products,
            countProducts,
            page,
            pages: Math.ceil(countProducts / pageSize)
        })
    }
)

//@desc POST Create Product
//@route /api/products
//@access private (admin only)
const createProduct = asyncHandler(
    async (req, res) => {
        const newProduct = await Product.create({
            name: 'sample name' + Date.now(),
            slug: 'sample-name' + Date.now(),
            image: '/images/p1.jpg',
            price: 0,
            category: 'sample category',
            brand: 'simple brand',
            countInStock: 0,
            rating: 0,
            numReviews: 0,
            description: 'sample description',
        })
        res.status(200).json(newProduct)
    }
)

//desc GET Get product by slug
//@route /api/products/:slug
//@access public
const getProductBySlug = asyncHandler(
    async (req, res) => {
        const slug = req.params.slug
        const product = await Product.findOne({ slug: slug })
        if (product) {
            res.send(product)
        } else {
            res.status(404).send('Product not found')
        }
    }
)

//desc GET Get product by id
//@route /api/products/admin/:id
//@access private(Admin)
const getProductById = asyncHandler(
    async (req, res) => {
        const id = req.params.id
        const product = await Product.findById(id)
        if (product) {
            res.send(product)
        } else {
            res.status(404).send('Product not found')
        }
    }
)

//desc PUT Edit product by id
//@route /api/products/admin/:id
//@access private(Admin)
const EditProductById = asyncHandler(
    async (req, res) => {
        const id = req.params.id
        const product = await Product.findById(id)
        if (!product) {
            res.status(404)
            throw new Error('Product not found')
        }
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true })
        res.status(200).json(updatedProduct)
    }
)

//desc DELETE Delete product by id
//@route /api/products/admin/:id
//@access private(Admin)
const deleteProductById = asyncHandler(
    async (req, res) => {
        const id = req.params.id
        const product = await Product.findById(id)
        if (!product) {
            res.status(404)
            throw new Error('Product not found')
        }
        const deletedProduct = await product.remove()
        res.status(200).json(deletedProduct)
    }
)

module.exports = {
    getProducts,
    getProductBySlug,
    getProductsByAdmin,
    createProduct,
    EditProductById,
    getProductById,
    deleteProductById,
}