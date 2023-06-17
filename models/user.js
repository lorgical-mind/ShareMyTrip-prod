const mongoose = require("mongoose");
const UniqueValidator = require("mongoose-unique-validator");

const Userschema = new mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true,minlength:6},
    image:{type:String,required:true},
    places:[{type:mongoose.Types.ObjectId , required:true , ref:"Places"}]  
});

Userschema.plugin(UniqueValidator);
module.exports = mongoose.model("Users",Userschema);