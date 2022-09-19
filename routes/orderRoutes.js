const express = require('express')
const {orderProducts, getOrderById, getUserOrders, getAllOrders} = require('../controllers/orderController')
const protect = require('../middleware/authMiddleware')
const isAdmin = require('../middleware/adminMiddleware')
const orderRouter = express.Router()

orderRouter.post('/', protect, orderProducts)
orderRouter.get('/', protect, isAdmin, getAllOrders)
orderRouter.get('/me', protect, getUserOrders)
orderRouter.get('/:id', protect, getOrderById)
module.exports = orderRouter