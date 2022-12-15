const express = require('express')
const cors = require('cors');
const dotevn = require('dotenv').config()
const path = require('path')
const data = require('./data')
const { errorHandler } = require('./middleware/errorMiddleware')
const connectDb = require('./config/db')
const seedRouter = require('./routes/seedRoutes')
const productRouter = require('./routes/productRoutes')
const userRouter = require('./routes/usersRoutes')
const orderRouter = require('./routes/orderRoutes')
const uploadRouter = require('./routes/uploadRoutes')
connectDb()

const app = express()
const Port = process.env.PORT || 5000

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors({ origin: ['http://localhost:3000', 'https://ars-mart.onrender.com'] }));
app.use('/api/seed', seedRouter)
app.use('/api/products', productRouter)
app.use('/api/users', userRouter)
app.use('/api/orders', orderRouter)
app.use('/api/upload', uploadRouter)

app.get('/', (_, res) => {
  res.status(200).json({ message: 'Welcome to the ars-mart API' })
})

app.use(errorHandler)

app.listen(Port, () => {
  console.log(`Example app listening on Port ${Port}`)
})