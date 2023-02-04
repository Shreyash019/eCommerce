const UserModel = require('../model/userSchema');
const ErrorHandler = require('../utils/errorHandler');
const crypto = require('crypto');
const CatchAsync = require('../middleware/catchAsync');
const ApiFeatures = require('../utils/apiFeatures');
const authToken = require('../utils/authToken');
const mail = require('../middleware/sendEmail')


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

    authToken.sendToken(userRegis, 200, res)
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

// User logout
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


exports.forgotPassword = CatchAsync( async(req, res, next)=>{
    const user = await UserModel.findOne({email: req.body.email})
    console.log(user)

    if(!user){
        return next(new ErrorHandler("User not found", 404));
    }

    // Get ResetPasswordToken
    const resetToken = await user.getResetPasswordToken();

    await user.save({validateBeforeSave: false});

    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`;

    const message = `Your password reset token is:- \n\n ${resetPasswordUrl}, \n\n If you have not request this email then please ignore it.`;

    try{
        await mail.sendEmail({
            email: user.email,
            subject: `Ecommerce password recovery.`,
            message,
        })
        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} successfully`
        })
    } catch(err){
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({validateBeforeSave: false});
        return next(new ErrorHandler(err.message, 500))
    }

})


// Reset Password
exports.resetPassword = CatchAsync( async(req, res, next)=>{

    // Creating token hash
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

    const user = await UserModel.findOne({
        resetPasswordToken,
        resetPasswordExpire: {$gt: Date.now()}
    })

    if(!user){
        return next(new ErrorHandler("Reset password token is invalid or has been expired", 404));
    }

    if(req.body.password !== req.body.confirmPassword){
        return next(new ErrorHandler("Password doesn't matched.", 404));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save()
    authToken.sendToken(user, 200, res)
})


// Get user profile
exports.getUserDetails = CatchAsync( async(req, res, next)=>{
    const user = await UserModel.findById(req.user.id);
    res.status(200).json({
        suncess: true,
        user
    })
})



exports.updateUserDetails = CatchAsync( async(req, res, next)=>{

    const newUserData = {
        name: req.body.name,
        email: req.body.email,
    }

    const user = await UserModel.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        userFindAndModify: true
    });
    res.status(200).json({
        suncess: true,
        user
    })
})


// Update User Password
exports.userPasswordUpdate = CatchAsync( async(req, res, next)=>{
    const user = await UserModel.findById(req.user.id).select("+password");

    const passwordMatch = await user.correctPassword(req.body.oldPassword, user.password);

    if(!passwordMatch){
        return next(new ErrorHandler('Old password is incorrect', 400))
    }

    if(req.body.newPassword !== req.body.confirmPassword){
        return next(new ErrorHandler('Password not matched.', 400))
    }

    user.password = req.body.newPassword;

    await user.save()

    authToken.sendToken(user, 200, res)
})


// Get All users

exports.getAllUsersByAdmin = CatchAsync(async(req, res, next)=>{
    const user = await UserModel.find();

    res.status(200).json({
        success: true,
        user
    })
})

// Adomi get User detail

exports.getUserDetailByAdmin = CatchAsync( async(req, res, next)=>{
    const user = await UserModel.findById(req.params.id);
    if(!user){
        return next(new ErrorHandler(`User does not exist with ID: ${req.params.id}`))
    }
    res.status(200).json({
        success: true,
        user
    })
})

// Update User Role By Admin

exports.updateUserRoleByAdmin = CatchAsync( async(req, res, next)=>{

    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role
    }

    const user = await UserModel.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true,
        userFindAndModify: true
    });
    res.status(200).json({
        suncess: true,
        user
    })
})


// Delete user by Admin
exports.deleteUserByAdmin = CatchAsync( async(req, res, next)=>{

    const user = await UserModel.findById(req.params.id);

    if(!user){
        return next(new ErrorHandler(`User does not exist with ID: ${req.params.id}`))
    }

    const deletedUser = await user.remove()

    res.status(200).json({
        suncess: true,
        message: 'User Deleted',
        deletedUser
    })
})


