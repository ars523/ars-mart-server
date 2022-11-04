const asyncHandler = require('express-async-handler')
const Order = require('../models/orderModel')
const Product = require('../models/productModel')
const User = require('../models/userModel')

//@des POST Order Product
//@route /api/orders
//@access private
const orderProducts = asyncHandler(
    async (req, res) => {

        const order = await Order.create({
            orderItems: req.body.orderItems.map((x) => ({ ...x, product: x._id })),
            shippingAddress: req.body.shippingAddress,
            paymentMethod: req.body.paymentMethod,
            itemsPrice: req.body.itemsPrice,
            shippingPrice: req.body.shippingPrice,
            taxPrice: req.body.taxPrice,
            totalPrice: req.body.totalPrice,
            user: req.user.id,
        })

        res.status(201).json(order)
    }
)


//@des GET Get orders of an user
//@route /api/orders/me
//@access Private
const getUserOrders = asyncHandler(
    async (req, res) => {
        const orders = await Order.find({ user: req.user._id })
        if (!orders) {
            res.status(404)
            throw new Error('Not found')
        }
        res.status(200).json(orders)
    }
)

//@des GET Get Order By id
//@route /api/orders/:id
//@access Parivate
const getOrderById = asyncHandler(
    async (req, res) => {
        const order = await Order.findById(req.params.id)
        if (!order) {
            res.status(404)
            throw new Error('Order not found')
        }
        else if (order.user.toString() !== req.user._id.toString()) {
            if (req.user.isAdmin) {
                res.status(200).json(order)
            }
            else {
                res.status(401)
                throw new Error('Not authorized')
            }
        }
        else {
            res.status(200).json(order)
        }

    }
)

//@desc  Get all orders
//@route /api/orders/admin
//@access private (admin)
const getAllUsersOrders = asyncHandler(
    async (req, res) => {
        const orders = await Order.find({}).populate('user', 'name')
        if (!orders) {
            res.status(404)
            throw new Error('Not found')
        }
        res.status(200).json(orders)

    }
)

//@desc DLETE Delete a order by admin using id
//@route /api/orders/admin/:orderId
//@access private (Admin)
const deleteOrderByAdmin = asyncHandler(
    async (req, res) => {
        console.log(req.params.id)
        const order = await Order.findById(req.params.orderId)
        if (!order) {
            res.status(404)
            throw new Error('Order not found')
        }
        const deletedOrder = await order.remove()
        res.status(200).json(deletedOrder)

    }
)

//@desc GET get order summery
//@route /api/orders/summery
//@access private (Admin)
const getOrderSummery = asyncHandler(
    async (req, res) =>{
        const orders = await Order.aggregate([
            {
              $group: {
                _id: null,
                numOrders: { $sum: 1 },
                totalSales: { $sum: '$totalPrice' },
              },
            },
          ]);
          const users = await User.aggregate([
            {
              $group: {
                _id: null,
                numUsers: { $sum: 1 },
              },
            },
          ]);
          const dailyOrders = await Order.aggregate([
            {
              $group: {
                _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                orders: { $sum: 1 },
                sales: { $sum: '$totalPrice' },
              },
            },
            { $sort: { _id: 1 } },
          ]);
          const productCategories = await Product.aggregate([
            {
              $group: {
                _id: '$category',
                count: { $sum: 1 },
              },
            },
          ]);
          res.send({ users, orders, dailyOrders, productCategories });
    }
)

module.exports = { 
    orderProducts, 
    getOrderById, 
    getUserOrders, 
    getAllUsersOrders,
    deleteOrderByAdmin,
    getOrderSummery,
}