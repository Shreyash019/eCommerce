const UserModel = require('../model/userSchema');
const ErrorHandler = require('../utils/errorHandler')
const CatchAsync = require('../middleware/catchAsync');
const ApiFeatures = require('../utils/apiFeatures');
const authToken = require('../utils/authToken');


// User registration
exports.userRegistraion = CatchAsync( async(req, res, next)=>{

    const {name, email, password, profileImage} = req.body;
    if(!name || !email || !password || !profileImage){
        return res.send('Please Enter Details')
    }
    const existingUser = await UserModel.find({email});
    if(!existingUser){
        return res.status(200).send(`User Already exist`)
    }
    const userRegis = await UserModel.create({
        name,
        email, 
        password,
        profileImage
    });

    const token = authToken.authSignToken(userRegis._id)
    res.status(201).json({
        status: "Success",
        token,
        data: {
            userRegis
        }
    })
})

// User login
exports.loginUser = CatchAsync( async(req, res, next)=>{
    const {email, password} = req.body;
    let userCheck;
    // Checking if email and password
    if(!email || !password){
        return next(new ErrorHandler(`Please enter email and password`, 400))
    }

    // Checking if user exist
    userCheck  = await UserModel.findOne({email}).select("+password");
    console.log(userCheck.email)

    if(!userCheck || !await userCheck.correctPassword(password, userCheck.password)){
        return next(new ErrorHandler('Invalid email and password', 401))
    }
    authToken.sendToken(userCheck, 200, res)
})

// User login
exports.logoutUser = CatchAsync( async(req, res, next)=>{

    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })

    res.status(200).json({
        success: true,
        message: "logged Out"
    })
})