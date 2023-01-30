const server = require('./app')
const dotenv = require('dotenv');


// Handling uncaught Exception
process.on('uncaughtException', (err)=>{
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to uncaught Exception`);
    process.exit(1);
})

const connectDatabase = require('./database')
dotenv.config({path: '../config.env'});
connectDatabase

const PORT = process.env.PORT || 5000
const sutServer = server.listen(PORT, (err)=>{
    if(err) return console.log(err)
    console.log(`Server running at port:: ${PORT}`)
})


// Unhandled promises Rejection
process.on('unhandledRejection', (err=>{
    console.log(`Error ${err.message}`);
    console.log(`Sutting down the server due to handled promise rejection`);

    sutServer.close(()=>{
        process.exit(1);
    })
}))