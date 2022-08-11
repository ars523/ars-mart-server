const express = require('express')
const dotevn = require('dotenv').config()
const data = require('./data')
const connectDb = require('./config/db')
const seedRouter = require('./routes/seedRoutes')
const productRouter = require('./routes/productRoutes')
connectDb()

const app = express()
const Port = 5000

app.use('/api/seed', seedRouter)
app.use('/api/products', productRouter) 

app.listen(Port, () => {
  console.log(`Example app listening on Port ${Port}`)
})