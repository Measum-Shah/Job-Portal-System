import {catchAsyncErrors} from "../middlewares/catchAsyncErrors.js"
import ErrorHandler from "../middlewares/error.js"
import {User} from "../models/userSchema.js"
import {v2 as cloudinary} from "cloudinary";
import { sendToken } from "../utils/jwtTokens.js"
// import {} from "crypto";



// ---------------------------------------------------------Register---------------------------------
export const register = catchAsyncErrors(async(req,res,next)=>{
   try {
    const {name, email, phone, address, password, role, firstNiche, secondNiche, thirdNiche, coverLetter}=req.body

    if(!name || !email || !phone || !address || !password || !role){
        return next(new ErrorHandler("All fields are required",400))
    }

    if(role==="Job Seeker"&&(!firstNiche||!secondNiche|| !thirdNiche)){
        return next(new ErrorHandler("Please provide your prefered niches",400))
    }
    const existingUser = await User.findOne({email});
    if(existingUser){
        return next(new ErrorHandler("Email is already Registered",400))
    }

    const userData ={name, email, phone, address, password, role, niches:
        {firstNiche, secondNiche, thirdNiche}, coverLetter};
        const timestamp = Math.floor(Date.now() / 1000);
        // debug by creating time stamp


        if(req.files&&req.files.resume){
            const {resume}=req.files;
            if(resume){

                try {
                    const cloudinaryResponse = await cloudinary.uploader.upload(
                        resume.tempFilePath,
                        { folder: "Job_Seekers_Resume"}
                      );
                    //   finally debugged,error in postman
                    //   console.log({cloudinaryResponse});

                    if(!cloudinaryResponse||cloudinaryResponse.error){
                     
                        return next(new ErrorHandler("failer to upload resume to cloud #cloudinaryissue",500))
                    }


                    userData.resume={
                        public_id: cloudinaryResponse.public_id,
                        url:cloudinaryResponse.secure_url,
                    }
                } catch (error) {
                    console.log("error=",{error});
                    return next(new ErrorHandler("failed to upload resume #error",500))
                                   
                    
                }
            }
        }
        

        const user = await User.create(userData);




        sendToken(user,201,res,"User Registered") ;
    //    ------------------------jwtwork above
       
    
    // res.status(201).json({
           
        //     success:true,
        //     message:"User Registered",
        // })

   } catch (error) {
    next(error)
   }
})

// -------------------------------------------------LOGIN-----------------------------------------
export const login = catchAsyncErrors(async (req, res, next) => {
    const { role, email, password } = req.body;

    // Validate input
    if (!role || !email || !password) {
        return next(
            new ErrorHandler("Email, Password, and Role are required", 400)
        );
    }
    // Find user by email
    const user = await User.findOne({ email }).select("+password"); // Explicitly include password
    if (!user) {
        return next(new ErrorHandler("Invalid Email or Password", 400));
    }

    // Check password
    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) {
        return next(new ErrorHandler("Invalid Email or Password", 400));
    }

    // Check role
    if (user.role !== role) {
        return next(new ErrorHandler("Invalid User Role", 400));
    }

    // Generate token and send response
    sendToken(user, 200, res, "User logged in successfully");
});

// ----------------------------------logout-------------------------------------------
export const logout = catchAsyncErrors(async(req,res,next)=>{
    res.status(200).cookie("token","",
        { expires: new Date(Date.now()),
            httpOnly: true,
        }).json({
        success:true,
        message:"logged out Successfully"
    })
})

export const  getUser = catchAsyncErrors(async(req,res,next)=>{
    const user = req.user;
    res.status(200).json({
        success:true,
        user,
    })
})
// -------------------------------------------UpdateProfile---------------------------------------
export const updateProfile = catchAsyncErrors(async(req,res,next)=>{
    const newUserData={
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        address:req.body.address,
        coverLetter: req.body.coverLetter,
        niches:{
            firstNiche: req.body.firstNiche,
            secondNiche: req.body.secondNiche,
            thirdNiche: req.body.thirdNiche
        }
    }

    const {firstNiche,secondNiche,thirdNiche}= newUserData.niches;

    if(req.user.role === "Job Seeker" && (!firstNiche || !secondNiche || !thirdNiche)){
        return next (new ErrorHandler("Please Provide All Niches",400));

    }

    if(req.files){
        const resume = req.files.resume;
        if(resume){
            const resume = req.files.resume.public_id;
            if(resume){
                const currentResumeId = req.user.resume.public_id;
                if(currentResumeId){
                    await cloudinary.uploader.destroy(currentResumeId);
                }  
            const newResume = await cloudinary.uploader.upload(tempFilePath,{
                folder:"Job_Seekers_Resume"
            });
            newUserData.resume= {
                public_id:newResume.public_id,
                url:newResume.secure_url
            }
            
            }
        }
    }
// ----------------------{
//     "success": false,
//     "message": "Cannot access 'user' before initialization",
//     "err": {
//         "statusCode": 500
//     }
// } comes when i write user isntead of User
// // --------------------------
    const user = await User.findByIdAndUpdate(req.user.id,newUserData,{
        new:true,
        runValidators:true,
        useFindAndModify:false,
    });

    res.status(200).json({
        success:true,
        user,
        message:"profile updated successfully"
    });



})