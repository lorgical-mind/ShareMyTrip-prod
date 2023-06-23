const Users = require("../models/user")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {validationResult} = require("express-validator")
const HttpError = require("../models/http-error")

const getUsers = async(req,res,next)=>{
    let getusers;
    try{
    getusers = await Users.find({},"-password")
    }catch(err){
        const error = new HttpError("cannot get users",500);
        return next(error);
    }

    res.json({users:getusers.map(u=>u.toObject({getters:true}))})
}

const signup= async (req,res,next)=>{

    const {name , email ,password} = req.body;
    const signup_error = validationResult(req);
    if(!signup_error.isEmpty()){
        console.log(signup_error);
       return next(new HttpError("Invalid inputs passed , please check your data",422));
    }

    let hasEmail;
    try{
        hasEmail = await Users.findOne({email:email})
    }catch(err){
        const error = new HttpError("Signing up failed, please try again later.",500);
        return next(error);
    }

    if(hasEmail){
        const error = new HttpError("user already exists, try loging in instead.",422);
        return next(error);   
    }
    let HashedPassword;
    try{
        HashedPassword = await bcrypt.hash(password,12)
    }catch(err){
        const error = new HttpError("internal server error",500);
        return next(error)
    }
    const signin_user = new Users({
        name,
        email,
        password: HashedPassword,
        image: req.file.path,
        places:[]
    });

    let User
    try{
     User = await signin_user.save();
    }catch(err){
        const error = new HttpError(err,500);
        console.log(err)
        return next(error);
    }
    let token;
    try{
    token=jwt.sign({userId:User.id,email:User.email},process.env.JWT_KEY,{expiresIn:"1h"})
    }catch(err){
        const error = new HttpError("signing up failed, please try later",500)
        return next(error)
    }
    res.status(201).json({userId:User.userId,email:User.email,token:token})
}

const login= async(req,res,next)=>{
    const {email , password} = req.body;

    let hasEmail;
    try{
        hasEmail = await Users.findOne({email:email})
    }catch(err){
        const error = new HttpError("Loggin failed, please try later",500);
        return next(error);
    }

    if (!hasEmail){
        const error = new HttpError("The provided credintials didn't work",403);
        return next(error);
    }
    let matchedpassword = false;
    try{
        matchedpassword = await bcrypt.compare(password,hasEmail.password);
    }catch(err){
        const reeor = new HttpError("invalid credintials, please try again" , 500);
        return next(reeor);
    }
    if(!matchedpassword){
        const error = new HttpError("The provided credintials didn't work",401);
        return next(error);      
    }
    let token;
    try{
    token=jwt.sign({userId:hasEmail.id,email:hasEmail.email},process.env.JWT_KEY,{expiresIn:"1h"})
    }catch(err){
        const error = new HttpError("logging in failed, please try later",500)
        return next(error)
    }

    res.status(201).json({userId:hasEmail.id,email:hasEmail.email,token:token})
}


exports.getUsers= getUsers;
exports.login = login;
exports.signup=signup;
