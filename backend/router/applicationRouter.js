import express, { application } from "express";
import { isAuthenticated,isAuthorized } from "../middlewares/auth.js";
import { postApplication , employerGetAllApplications, deleteApplication,jobSeekerGetAllApplication } from "../controllers/applicationController.js";
const router = express.Router();


router.post("/post/:id",isAuthenticated,isAuthorized("Job Seeker"),postApplication);
// job id above

router.get("/employer/getall",isAuthenticated,isAuthorized("Employer"),employerGetAllApplications)

router.get("/jobseeker/getall",isAuthenticated,isAuthorized("Job Seeker"),jobSeekerGetAllApplication)

router.delete("/delete/:id",isAuthenticated,deleteApplication)

export default router;

