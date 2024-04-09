import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Please enter a username"],
        unique: [true, "Username already exists"],
    },
    email:{
        type: String,
        required: [true, "Please enter an email"],
        unique: [true, "Email already exists"],
    },
    password:{
        type: String,
        required: [true, "Please enter a password"],
        minLength: [8, "Password must be at least 8 characters long"],
    },
    isVerified:{
        type: Boolean,
        default: false,
    },
    isAdmin:{
        type: Boolean,
        default: false,
    },
    
    forgotPasswordToken:String,
    forgotPasswordTokenExpiry:Date,
    verifyToken: String,
    verifyTokenExpiry: Date,
});

const User = mongoose.models.users || mongoose.model("users", userSchema);

export default User;