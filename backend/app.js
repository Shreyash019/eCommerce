const express = require('express');
const app = express();
const productRoute = require('./routes/productRoute');
const errorMiddleware = require('./middleware/error')


app.use(express.json());


app.use('/api/v1/product', productRoute)

// Middleware for error
app.use(errorMiddleware)


module.exports = app;