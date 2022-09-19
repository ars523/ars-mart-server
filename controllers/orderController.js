const asyncHandler = require('express-async-handler')
const Order = require('../models/orderModel')

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
//@access Privatee
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
        else{
            res.status(200).json(order)
        }

    }
)

//@desc  Get all orders
//@route /api/orders
//@access private (admin)
const getAllOrders = asyncHandler(
    async (req, res) => {
        const orders = await Order.find({}).populate('user', 'name')
        if (!orders) {
            res.status(404)
            throw new Error('Not found')
        }
        res.status(200).json(orders)

    }
)

module.exports = { orderProducts, getOrderById, getUserOrders, getAllOrders }