import mongoose from "mongoose";

export const connection = ()=>{
    mongoose.connect( "mongodb://127.0.0.1:27017", {
        dbName: "JOB_PORTAL_WITH_AUTOMATION"
    }).then(()=>{
        console.log("Connected to database.")
    }).catch(err=>{
        console.log(`Some error occured while connecting to database: ${err}`)
    })
}