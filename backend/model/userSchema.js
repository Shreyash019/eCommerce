const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'please enter your name.'],
        maxLength: [30, `Name cannot exceed 30 characters`],
        minLength: [4, `Name should not be less than 4 charcters`]
    },
    email: {
        type: String,
        required: [true, `Please enter your email address.`],
        unique: true,
        validate: [validator.isEmail, `Please enter valid Email`]
    },
    password: {
        type: String,
        true: [true, `Please enter password`],
        minLength: [8, `Password should not be less than 8 charcters.`],
        select: false
    },
    profileImage: {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },
    role: {
        type: String,
        default: 'user',

    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
});

// Hashing password
userSchema.pre("save", async function(next){
    if(!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
})

// Comparing Password
userSchema.methods.correctPassword = async function(candidatePassword, userPassword){
    return await bcrypt.compare(candidatePassword, userPassword)
}
const UserModel = mongoose.model("UserModel", userSchema);

module.exports = UserModel