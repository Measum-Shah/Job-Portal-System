import cron from "node-cron";
import { User } from "../models/userSchema.js";
import { job } from "../models/jobSchema.js";
import { sendEmail } from "../utils/sendEmails.js";

export const newsLetterCron = () => {
    cron.schedule("*/1 * * * *", async () => {
        console.log("Running News Letter through Cron Automation");
        const jobs = await job.find({ newsLetterSent: false });
        for (const Job of jobs) {
            try {
                const filteredUsers = await User.find({
                    $or: [
                        { "niches.firstNiche": Job.jobNiche },
                        { "niches.secondNiche": Job.jobNiche },
                        { "niches.thirdNiche": Job.jobNiche },
                    ],
                });

                if (filteredUsers.length === 0) {
                    console.log(`No users found for job niche: ${Job.jobNiche}`);
                    continue; // Skip if no users found for the job niche
                }
                if(filteredUsers.length !== 0){
                    console.log("Found a job match")
                }

                for (const user of filteredUsers) {
                    const subject = `Hot Job Alert: ${Job.title} in ${Job.jobNiche} Available Now`;
                    const message = `Hello ${user.name},\n\nGreat news! A new job has just been posted that aligns perfectly with your skills and career goals. Based on your profile, we believe this opportunity could be an excellent fit for you.\n\nHere are the details of the job:\n\n- **Job Title**: ${Job.title}\n- **Company**: ${Job.companyName}\n- **Location**: ${Job.location}\n- **Salary**: ${Job.salary}\n\nIf this role sounds like something you’re interested in, we encourage you to apply as soon as possible. Don't miss out on this chance to take your career to the next level!\n\nBest regards,\nThe Job Portal Team`;

                    await sendEmail({
                        email: user.email,
                        subject,
                        message,
                    });
                }

                Job.newsLetterSent = true;
                await Job.save();
            } catch (error) {
                console.log("ERROR IN NODE CRON CATCH BLOCK");
                console.log(error || "Some error in CRON");
            }
        }
    });
};
