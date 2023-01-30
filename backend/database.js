const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({path: './config.env'});

const dbName = process.env.DATABASE.replace('<password>', process.env.DATABASE_PASSWORD);

module.exports = mongoose.connect(dbName, {
    useNewUrlParser: true
}).then(()=> console.log('Database connection successful...'))