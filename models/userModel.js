const crypto = require('crypto')
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter your name']
    },
    email: {
        type: String,
        required: [true, 'Pleasse enter your email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    photo: {
        type: String
    },
    role: {
        type: String,
        enum: ['user', 'guide', 'lead-guide', 'admin'],
        default: 'user'
    },
    password: {
        type: String,
        required: [true, 'Please enter your password'],
        minlength: 8,
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password'],
        minlength: 8,
        validate: {
            // This only works on SAVE and CREATE
            validator: function(el) {
                return el === this.password;
            },
            message: 'Passwords does not match'
        }
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
        type: Boolean,
        default: true,
        select: false
    }
})

userSchema.pre('save', async function(next) {
    // Only run this function if password was modified
    if(!this.isModified('password')) {
        return next();
    }
    // Hash the password with cost of 12
    this.password = await bcrypt.hash(this.password, 12);
    // Delete passwordConfirm
    this.passwordConfirm = undefined;
    next();
});

userSchema.pre('save', function(next) {
    if(!this.isModified('password') || this.isNew) {
        return next();
    }
    this.passwordChangedAt = Date.now() - 1000;
    next();
})

userSchema.pre(/^find/, function(next) {
    // this points to the current query
    this.find({active: {$ne: false}});
    next();
})

userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
}

userSchema.methods.changedPasswordAfter = async function(JWTTimestamp) {
    if(this.passwordChangedAt) {
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);

        console.log(changedTimestamp, JWTTimestamp);
        if(JWTTimestamp < changedTimestamp) {
            return true;
        }  
    }
    return false;  
}

userSchema.methods.createPasswordResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    console.log({resetToken}, this.passwordResetToken);

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    
    return resetToken;
}

const User = mongoose.model('User', userSchema);  
module.exports = User;