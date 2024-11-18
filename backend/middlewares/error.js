class ErrorHandler extends Error{
    constructor(message,statusCode){
        super(message);
        this.statusCode=statusCode;
    }
}

export const errorMiddleware = (err,req,res,next)=>
    {
        err.statusCode=err.statusCode||500;
        err.message=err.message|| "Internal Server error";


if(err.name ==="CastError"){
    const message = `Invalid ${err.path}`;
    err= new ErrorHandler(message,400);

}

if(err.name ==="JsonwebTokenError"){
    const message = `Json webtoken is invalid,try gain`;
    err= new ErrorHandler(message,400);

}

if(err.name ==="TokenExpireError"){
    const message = `Json web token is expired, Try again`;
    err= new ErrorHandler(message,400);

}

if(err.code===11000){
const message = `Duplicate ${Object.keys(err.keyValue)} Entered`
}

return res.status(err.statusCode).json({
    success:false,
    message:err.message,
    err:err 
})

}
export default ErrorHandler;