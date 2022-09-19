const express = require('express')
const { getProducts,
    getProductBySlug,
    getProductsByAdmin,
    createProduct,
    getProductById,
    EditProductById, 
    deleteProductById} = require('../controllers/productController')
const isAdmin = require('../middleware/adminMiddleware')
const protect = require('../middleware/authMiddleware')
const productRouter = express.Router()

productRouter.get('/', getProducts)
productRouter.post('/', protect, isAdmin, createProduct)
productRouter.get('/admin', protect, isAdmin, getProductsByAdmin)
productRouter.get('/:slug', getProductBySlug)
productRouter.get('/admin/:id', protect, isAdmin, getProductById)
productRouter.put('/admin/:id', protect, isAdmin, EditProductById)
productRouter.delete('/admin/:id', protect, isAdmin, deleteProductById)

module.exports = productRouter