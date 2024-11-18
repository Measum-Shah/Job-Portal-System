


export const sendToken = (user, statuscode, res, message) => {
    const token = user.getJWTToken()

    const options = {
        expires: new Date(
            Date.now() + process.env.COOKIES_EXPIRE * 24 * 60 * 60 * 1000
        ),
        // COOKIES_EXPIRE this only S was missing and i wasted my whole day debugging the code
        httpOnly: true,
    };

    res.status(statuscode)
        .cookie("token", token, options)
        .json({
            success: true,
            user,
            message,
            token,
        });
};
