const express = require('express')
const dotevn = require('dotenv').config()
const data = require('./data')
const {errorHandler} = require('./middleware/errorMiddleware')
const connectDb = require('./config/db')
const seedRouter = require('./routes/seedRoutes')
const productRouter = require('./routes/productRoutes')
const userRouter = require('./routes/usersRoutes')
const orderRouter = require('./routes/orderRoutes')
const uploadRouter = require('./routes/uploadRoutes')
connectDb()

const app = express()
const Port = 5000

app.use(express.json())
app.use(express.urlencoded({extended:false}))

app.use('/api/seed', seedRouter)
app.use('/api/products', productRouter)
app.use('/api/users', userRouter)
app.use('/api/orders', orderRouter)
app.use('/api/upload', uploadRouter)


app.use(errorHandler)

app.listen(Port, () => {
  console.log(`Example app listening on Port ${Port}`)
})