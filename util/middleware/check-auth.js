const jwt = require("jsonwebtoken");
const HttpError = require("../../models/http-error");

module.exports = (req,res,next)=>{
    if(req.method==="OPTIONS"){
        return next();
    } 
    try{
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            const error = new Error("ssssssssss")
            throw error;
        }
        const decodedToken = jwt.verify(token,process.env.JWT_KEY);
        req.userData = {userId:decodedToken.userId};
        next();
    }catch(err){
        const error = new HttpError(err,403)
        return next(error); 
    }
};