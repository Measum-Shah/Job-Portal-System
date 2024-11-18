import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
// import validator from "validator";

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        minLength:[3,"Name must Contain Atleast 3 chracters"],
        maxLength:[30,"Name cannot exceed 30 chracters"]
    },
    email:{
        type:String,
        required:true,
        // validate:[validator.isEmail,"Please Provide Valid Email"],

    },
    phone:{
        type:Number,
        required:true,
    },
    address:{
        type:String,
        required:true
    },
    niches:{
        firstNiche:String,
        secondNiche:String,
        thirdNiche:String,

    },
    password:{
        type:String,
        required:true,
        minLength:[8,"Password must contain atleast 8 chracters"],
        maxLength:[30,"Password can't exceed 30 chracters"]
    },
    resume:{
        public_id:String,
        url:String
    },
    coverLetter:{
        type:String,
    },
    role: {
        type: String,
        required: true,
        enum: ["Job Seeker", "Employer"],
        message: "{VALUE} is not a valid role" // Custom error message (optional)
    }
    ,
    createdAt:{ 
        type:Date,
        default:Date.now,
    }
})

// -----------------------------------------jwt work
userSchema.methods.getJWTToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};




export const User = mongoose.model("User",userSchema);