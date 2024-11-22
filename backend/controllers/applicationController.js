import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js"
import ErrorHandler from "../middlewares/error.js"
import {Application} from "../models/applicationSchema.js"
import {job} from "../models/jobSchema.js"
import {v2 as cloudinary} from "cloudinary";

// ------------------------------------POSTAPPLICATION----------------------------------------

export const postApplication = catchAsyncErrors(async(req,res,next)=>{
 const {id}  =req.params;
 const {name,email,phone,address,coverLetter}= req.body;
 if(!name || !email || !phone || !address || !coverLetter)
{
    return next(async(ErrorHandler("All Fields are required",400)))
}

const jobSeekerInfo ={
    id:req.user._id,
    name,
    email,
    phone,
    address,
    coverLetter,
    role:"Job Seeker"
};

const isAlreadyApplied = await Application.findOne({
    "jobInfo.id":id
    ,"jobSeekerInfo.id":req.user._id,
})
if(isAlreadyApplied){
    return next(new ErrorHandler("You have already applied for the job",400))
}
const jobDetails = await job.findBy(id);
if(!job){
    return next(new ErrorHandler("Job not found",404))
} 

if(req.files && req.files.resume){
    const {resume} =req.files;
    try {
        const cloudinaryResponse =await cloudinary.uploader.upload(resume.tempFilePath,{
            folder:"Job_Seekers_Resume"
        });
        if(!cloudinaryResponse||cloudinaryResponse.error){
                     
            return next(new ErrorHandler("failer to upload resume to cloud #cloudinaryissue",500))
        }
        jobSeekerInfo.resume = {
            public_id:cloudinaryResponse.public_id,
            url:cloudinaryResponse.secure_url,
        }

    } catch (error) {

        return next(new ErrorHandler("Failed to upload Resume,500"))
    }
}
else{
    if(req.user && !req.user.resume.url){
        return next(new ErrorHandler("Please upload your resume",400))
    }
    jobSeekerInfo.resume={
        public_id:req.user && req.user.public_id,
        url:req.user && req.user.url
    }
}

    const employerInfo = {
        id:jobDetails.postedBy,
        role:"Employer"
    }

    const jobInfo = {
        jobId: id,
        jobTitle: jobDetails.title,
    }
    // const application = await Aplication.create;

})

// -----------------------------employerGetAllApplications---------------------------------

export const employerGetAllApplications = catchAsyncErrors(async(req,res,next)=>{
    
})

// ------------------------------jobSeekerGetAllApplication------------------------------

export const jobSeekerGetAllApplication = catchAsyncErrors(async(req,res,next)=>{
    
})

// ---------------------------------deleteApplication------------------------------------

export const deleteApplication = catchAsyncErrors(async(req,res,next)=>{
    
})