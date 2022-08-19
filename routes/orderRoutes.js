const express = require('express')
const {orderProducts, getOrderById, getUserOrders} = require('../controllers/orderController')
const protect = require('../middleware/authMiddleware')
const orderRouter = express.Router()

orderRouter.post('/', protect, orderProducts)
orderRouter.get('/me', protect, getUserOrders)
orderRouter.get('/:id', protect, getOrderById)
module.exports = orderRouter