const express = require('express');
const app = express();
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser')
const productRoute = require('./routes/productRoute');
const userRoute = require('./routes/userRoute')
const errorMiddleware = require('./middleware/error');


dotenv.config({path: './config.env'});
app.use(express.json());
app.use(cookieParser())

app.use('/api/v1/', productRoute)
app.use('/api/v1/', userRoute)

// Middleware for error
app.use(errorMiddleware)


module.exports = app;