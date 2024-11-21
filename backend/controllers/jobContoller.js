import {catchAsyncErrors} from "../middlewares/catchAsyncErrors.js"
import ErrorHandler from "../middlewares/error.js"
import {User} from "../models/userSchema.js"
import {Job
} from "../models/jobSchema.js"

export const postJob =catchAsyncErrors(async(req,res,next)=>{
    const {title, jobType, location, companyName, introduction, responsibilities, qualifications, offers, salary,hiringMultipleCandidates, personalWebsiteTitle, personalWebsiteUrl, jobNiche, newsLetterSent, jobPostedOn
    ,postedBy} = req.body; 
        
    if( !title||   !jobType  ||  !companyName    ||  !location   ||  !introduction   ||  !responsibilities   ||!qualifications   ||  !salary ||  !jobNiche  ){
                return next(ErrorHandler("Please Provide Job Details",400))
            };


    if((personalWebsiteTitle && !personalWebsiteUrl) || (!personalWebsiteTitle && personalWebsiteUrl)){
        return next (new ErrorHandler("Provide both the url and title of website , or leave both blank",400))
    } ;       

    
    // const postedBy = req.ser._id

});
