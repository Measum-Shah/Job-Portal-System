import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { User } from "../models/userSchema.js";
import { job } from "../models/jobSchema.js";

export const postJob = catchAsyncErrors(async (req, res, next) => {
    const {
        title,
        jobType,
        location,
        companyName,
        introduction,
        responsibilities,
        qualifications,
        offers,
        salary,
        hiringMultipleCandidates,
        personalWebsiteTitle
        ,personalWebsiteUrl,  
        jobNiche,
        newsLetterSent,
        jobPostedOn
    } = req.body;

    // Validate required fields
    if (!title || !jobType || !companyName || !location || !introduction || !responsibilities || !qualifications || !salary || !jobNiche) {
        return next(new ErrorHandler("Please Provide Job Details", 400));
    }

    // Validate personal website fields
    if ((personalWebsiteTitle && !personalWebsiteUrl) || (!personalWebsiteTitle && personalWebsiteUrl)) {
        return next(new ErrorHandler("Provide both the URL and title of website, or leave both blank", 400));
    }

    // Use a new variable for postedBy
    const postedBy = req.user._id;

    const jobDetails = await job.create({
        title,
        jobType,
        location,
        companyName,
        introduction,
        responsibilities,
        qualifications,
        offers,
        salary,
        hiringMultipleCandidates,
        personalWebsite: { title: personalWebsiteTitle, url: personalWebsiteUrl },
        jobNiche,
        newsLetterSent,
        jobPostedOn,
        postedBy,
    });

    res.status(201).json({
        success: true,
        message: "Job posted successfully",
        jobDetails,
    });
});
