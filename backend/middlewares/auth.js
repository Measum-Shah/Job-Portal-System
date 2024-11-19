import jwt from "jsonwebtoken";
import { catchAsyncErrors } from "./catchAsyncErrors.js";
import ErrorHandler from "./error.js";
import {User} from "../models/userSchema.js"

export const isAuthenticated = catchAsyncErrors(async(req,res,next)=>{
    const {token} = req.cookies;
    // console.log("i get the token",{token})
    if(!token){
        return next(new ErrorHandler("User is not autheticated",400))
    }
    // console.log("Jwt secret key=", process.env.JWT_SECRET_KEY)
    const decoded = jwt.verify(token,process.env.JWT_SECRET_KEY);
    req.user= await User.findById(decoded.id);
    // try {
    //     const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    //     console.log("Decoded JWT:", decoded);
    // } catch (error) {
    //     console.error("JWT verification failed:", error.message);
    // }
    
    next();
})