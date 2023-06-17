const express  =  require("express");
const { check } = require("express-validator");
const Usercontroler = require("../controlers/user-cont.js");
const fileUpload = require("../util/middleware/file-Upload.js");
const router = express.Router();

router.get("/",Usercontroler.getUsers)

router.post("/signup",fileUpload.single("image"),[
    check("name").not().isEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({min:6})
],Usercontroler.signup)

router.post("/login",Usercontroler.login)

module.exports =router;